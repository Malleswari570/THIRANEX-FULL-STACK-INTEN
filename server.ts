import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { initialProfileData } from "./src/data";
import { createServer as createViteServer } from "vite";

// Initialize express app
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Local JSON DB path
const DB_FILE = path.join(process.cwd(), "database.json");

interface DBStructure {
  profile: typeof initialProfileData;
  messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    isRead: boolean;
  }>;
}

// Ensure database file exists
function readDB(): DBStructure {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading database", e);
  }
  
  const defaultDB: DBStructure = {
    profile: initialProfileData,
    messages: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2), "utf-8");
  return defaultDB;
}

function writeDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing database", e);
  }
}

// API Routes
// 1. Get entire profile
app.get("/api/profile", (req, res) => {
  const db = readDB();
  res.json(db.profile);
});

// 2. Update entire profile (primarily projects/skills/summary via admin panel)
app.put("/api/profile", (req, res) => {
  const db = readDB();
  db.profile = { ...db.profile, ...req.body };
  writeDB(db);
  res.json({ success: true, profile: db.profile });
});

// 3. Reset profile to seed data
app.post("/api/profile/reset", (req, res) => {
  const db = readDB();
  db.profile = initialProfileData;
  writeDB(db);
  res.json({ success: true, profile: db.profile });
});

// 4. Contact messages list (for the developer panel)
app.get("/api/messages", (req, res) => {
  const db = readDB();
  res.json(db.messages);
});

// 5. Submit contact message (visitor form)
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  const db = readDB();
  const newMessage = {
    id: "msg-" + Date.now(),
    name,
    email,
    subject: subject || "No Subject",
    message,
    createdAt: new Date().toISOString(),
    isRead: false
  };

  db.messages.unshift(newMessage);
  writeDB(db);

  res.json({ success: true, message: "Thank you for getting in touch!" });
});

// 6. Delete a message
app.delete("/api/messages/:id", (req, res) => {
  const db = readDB();
  db.messages = db.messages.filter((m) => m.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// 7. Mark message as read
app.patch("/api/messages/:id/read", (req, res) => {
  const db = readDB();
  const index = db.messages.findIndex((m) => m.id === req.params.id);
  if (index !== -1) {
    db.messages[index].isRead = true;
    writeDB(db);
  }
  res.json({ success: true });
});

// AI Chat Integration using Server-Side Gemini API
app.post("/api/chat", async (req, res) => {
  const { message, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Retrieve current database stats for highly dynamic context
  const db = readDB();
  const p = db.profile;

  // Format professional profile instructions
  const pSkillsStr = p.skills.map((s) => `- ${s.name}: ${s.skills.join(", ")}`).join("\n");
  const pProjectsStr = p.projects.map((pr) => {
    return `- ${pr.title} (${pr.date}): ${pr.description}\n  Tech Stack: ${pr.techStack.join(", ")}\n  Key details:\n${pr.bulletPoints.map(b => `    * ${b}`).join("\n")}`;
  }).join("\n\n");
  const pExpStr = p.experiences.map((ex) => {
    return `- ${ex.role} at ${ex.company} (${ex.date})\n  Bullet points:\n${ex.bulletPoints.map(b => `    * ${b}`).join("\n")}`;
  }).join("\n\n");
  const pEduStr = p.education.map((ed) => {
    return `- ${ed.degree} from ${ed.institution} (${ed.date}) with ${ed.gradeLabel}: ${ed.gradeValue}`;
  }).join("\n");
  const pCertStr = p.certifications.map((c) => `- ${c.name} by ${c.issuer}`).join("\n");

  const systemInstruction = `You are the friendly, helpful AI portfolio chatbot companion for Bandaru Malleswari.
Your purpose is to answer inquiries from visitors, recruiters, and employers looking to hire her or learn about her works.
Speak of Malleswari in the third person ("Malleswari is..." or "She completed..."). Be professional, warm, engaging, and structured. 

Here is her UP-TO-DATE Profile Context:
-------------------------------------------
Name: ${p.name}
Title: ${p.title}
Email: ${p.email}
Phone: ${p.phone}
Location: ${p.location}
LinkedIn: ${p.linkedin}
GitHub: ${p.github}

Biography Summary:
${p.summary}

Technical Skills:
${pSkillsStr}

Projects Developed:
${pProjectsStr}

Professional Experience:
${pExpStr}

Education Background:
${pEduStr}

Professional Certifications:
${pCertStr}
-------------------------------------------

Guidelines:
1. Always state facts from the profile context. If asked about something not mentioned in her portfolio, reply politely that she hasn't listed information about that specific topic, but highlight her nearest AI, Data Science, Python, or Web Development skills.
2. Keep responses relatively short, readable, and beautifully structured (e.g. bold titles, small bullet points).
3. If they ask how to contact her, provide her email (${p.email}), mobile (${p.phone}), LinkedIn, or suggest using the Contact Form on the page.
4. She is currently studying at Kakinada Institute of Engineering and Technology (B.Tech in Artificial Intelligence & Data Science, expecting graduation in May 2027), with an excellent CGPA of 7.84. She completed her ML/AI Internship remotely at FMML IIIT Hyderabad in early 2025.
5. Answer questions with enthusiasm! If they want to test your capabilities, you can write mock machine learning scripts, discuss neural networks, or explain Python/Flask architectures.`;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured. Please add it via Settings > Secrets.",
        text: "Hi! I would love to tell you more about Malleswari, but my Gemini API integration is awaiting an API key. You can ask me questions once it is configured under Settings > Secrets!"
      });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // We can generate response
    // To support chat history, we can format our query or provide contents
    const contents: any[] = [];
    
    // Convert previous simple history into Gemini contents format
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((turn: { role: "user" | "model"; content: string }) => {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.content }]
        });
      });
    }
    
    // Add current user prompt
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "No response received." });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ 
      error: "Failed to communicate with AI model", 
      details: error?.message || error
    });
  }
});

// Vite Middleware for Development / Static serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
