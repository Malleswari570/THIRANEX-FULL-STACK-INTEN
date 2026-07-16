import express, { Request, Response, NextFunction } from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { DBManager } from "./src/server/db";

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        createdAt: string;
      };
    }
  }
}

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory token storage (tokens mapped to userId)
const SESSIONS = new Map<string, { userId: string; expiresAt: number }>();
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// Cleanup expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of SESSIONS.entries()) {
    if (session.expiresAt < now) {
      SESSIONS.delete(token);
    }
  }
}, 60 * 60 * 1000); // every hour

// Authentication Middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token is required" });
  }

  const session = SESSIONS.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) SESSIONS.delete(token);
    return res.status(403).json({ error: "Invalid or expired token" });
  }

  const user = DBManager.getUserById(session.userId);
  if (!user) {
    return res.status(403).json({ error: "User no longer exists" });
  }

  // Set user, excluding password secrets
  req.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };

  next();
}

// --- Auth Endpoints ---

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: "Username must be between 3 and 20 characters" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const newUser = DBManager.createUser(username, email, password);
    const token = crypto.randomBytes(32).toString("hex");
    
    SESSIONS.set(token, {
      userId: newUser.id,
      expiresAt: Date.now() + SESSION_EXPIRY_MS,
    });

    res.status(201).json({
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Registration failed" });
  }
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: "Email/Username and password are required" });
  }

  try {
    const authenticatedUser = DBManager.authenticateUser(emailOrUsername, password);
    const token = crypto.randomBytes(32).toString("hex");

    SESSIONS.set(token, {
      userId: authenticatedUser.id,
      expiresAt: Date.now() + SESSION_EXPIRY_MS,
    });

    res.json({
      user: {
        id: authenticatedUser.id,
        username: authenticatedUser.username,
        email: authenticatedUser.email,
        createdAt: authenticatedUser.createdAt,
      },
      token,
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message || "Authentication failed" });
  }
});

app.get("/api/auth/me", authenticateToken, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

app.post("/api/auth/logout", (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    SESSIONS.delete(token);
  }
  res.json({ success: true, message: "Logged out successfully" });
});

// --- Blog Posts Endpoints ---

app.get("/api/posts", (req: Request, res: Response) => {
  try {
    const posts = DBManager.getPosts();
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to load posts" });
  }
});

app.get("/api/posts/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = DBManager.getPostById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comments = DBManager.getCommentsForPost(id);
    res.json({ post, comments });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve post details" });
  }
});

app.post("/api/posts", authenticateToken, (req: Request, res: Response) => {
  const { title, content } = req.body;
  const user = req.user!;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const newPost = DBManager.createPost(title, content, user.id, user.username);
    res.status(201).json(newPost);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

app.put("/api/posts/:id", authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const user = req.user!;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const updatedPost = DBManager.updatePost(id, title, content, user.id);
    res.json(updatedPost);
  } catch (err: any) {
    res.status(err.message.includes("Unauthorized") ? 403 : 404).json({ error: err.message });
  }
});

app.delete("/api/posts/:id", authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;

  try {
    DBManager.deletePost(id, user.id);
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err: any) {
    res.status(err.message.includes("Unauthorized") ? 403 : 404).json({ error: err.message });
  }
});

// --- Comments Endpoints ---

app.post("/api/posts/:postId/comments", authenticateToken, (req: Request, res: Response) => {
  const { postId } = req.params;
  const { content } = req.body;
  const user = req.user!;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Comment content cannot be empty" });
  }

  try {
    const newComment = DBManager.addComment(postId, content, user.id, user.username);
    res.status(201).json(newComment);
  } catch (err: any) {
    res.status(404).json({ error: err.message || "Failed to add comment" });
  }
});

app.delete("/api/comments/:commentId", authenticateToken, (req: Request, res: Response) => {
  const { commentId } = req.params;
  const user = req.user!;

  try {
    DBManager.deleteComment(commentId, user.id);
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (err: any) {
    res.status(err.message.includes("Unauthorized") ? 403 : 404).json({ error: err.message });
  }
});

// --- Frontend Mounting & Dev/Prod Server Serving ---

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
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server", err);
});
