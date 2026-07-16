import fs from "fs";
import path from "path";
import crypto from "crypto";
import { UserDB, Post, Comment } from "../types.js";

const DB_FILE = path.join(process.cwd(), "database.json");

interface DatabaseSchema {
  users: UserDB[];
  posts: Post[];
  comments: Comment[];
}

function getInitialDB(): DatabaseSchema {
  // Pre-populate with high-quality sample data
  const salt1 = crypto.randomBytes(16).toString("hex");
  const hash1 = crypto.pbkdf2Sync("password123", salt1, 1000, 64, "sha512").toString("hex");
  
  const salt2 = crypto.randomBytes(16).toString("hex");
  const hash2 = crypto.pbkdf2Sync("password123", salt2, 1000, 64, "sha512").toString("hex");

  const author1Id = "user_editorial";
  const author2Id = "user_designer";

  const users: UserDB[] = [
    {
      id: author1Id,
      username: "clara_valentin",
      email: "clara@journal.co",
      passwordHash: hash1,
      salt: salt1,
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: author2Id,
      username: "ethan_spaces",
      email: "ethan@designcraft.io",
      passwordHash: hash2,
      salt: salt2,
      createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
    }
  ];

  const posts: Post[] = [
    {
      id: "post_slow_living",
      title: "The Art of Slow Living in a Fast-Paced World",
      excerpt: "In a culture obsessed with speed and optimization, choosing to slow down is a radical act of self-preservation. Discover how deliberate pauses can cultivate focus and authentic creativity.",
      content: `In a culture obsessed with velocity, efficiency, and optimization, choosing to slow down is a radical act of self-preservation. From the moment we wake to the glowing screens of notifications, we are urged to produce more, consume faster, and optimize every sliver of our day.\n\nBut what if our obsession with speed is precisely what is diluting our depth?\n\n### The Illusion of Velocity\n\nWhen we rush through our lives, we experience them in low resolution. Details blur, connections become transactional, and our attention is fractured into infinite, shallow streams. Creative work requires incubation—it needs boredom, silence, and uninterrupted hours. Without slow time, we merely rearrange existing thoughts instead of generating new ones.\n\n### Practical Rituals for Slowing Down\n\n1. **The Morning Threshold**: Resist the urge to check your phone for the first 30 minutes of the day. Sip your tea or coffee, look out the window, and let your mind assemble its thoughts in quiet.\n2. **Mono-Tasking**: Dedicate singular focus to a single activity. If you are reading, read. If you are walking, walk. If you are writing, close all other browser tabs.\n3. **Tactile Grounding**: Engage in activities that require physical, offline interaction. Cooking from scratch, gardening, sketching on paper—these activities anchor us in the physical present.\n\nSlowing down is not about being unproductive; it is about protecting the quality of what we do produce, and more importantly, preserving the depth of our inner life.`,
      authorId: author1Id,
      authorName: "Clara Valentin",
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      commentsCount: 2
    },
    {
      id: "post_design_space",
      title: "Designing with Negative Space: A Craftsperson's Guide",
      excerpt: "The power of design often lies not in what we put on the canvas, but in what we choose to leave out. Explore how silence and empty space establish hierarchy and visual calm.",
      content: `The power of design often lies not in what we put on the canvas, but in what we choose to leave out. In visual composition, negative space (or whitespace) is not merely 'empty'—it is an active structural element that defines, frames, and elevates the content it surrounds.\n\nConsider the layout of a premium editorial. The margins are generous, the headers have breathing room, and the paragraph leading is open. This is not a waste of screen real estate; it is a deliberate choice to provide visual comfort and prioritize focus.\n\n### Why Space is the Ultimate Signal\n\n- **Clarity of Hierarchy**: When everything is crammed together, nothing stands out. Space around an element tells the eye: "This is important. Stop here."\n- **Reduced Cognitive Load**: A crowded UI causes visual fatigue. Strategic use of margins and spacing allows users to digest information in comfortable chunks.\n- **Aesthetic Prestige**: Generous spacing conveys confidence. It signals that the content is valuable enough to deserve its own space, rather than competing for scraps.\n\n### How to Apply It in Digital Interfaces\n\n1. **Increase your margins**: Try doubling your standard padding values. See how it changes the rhythm of the screen.\n2. **Embrace line height**: Let your body copy breathe with a line height of 1.6x to 1.8x the font size.\n3. **Resist decorative fillers**: If an element doesn't serve a clear information purpose, remove it. Let the typography and spacing do the work.\n\nRemember: good design is quiet. It speaks through structure, rhythm, and silence.`,
      authorId: author2Id,
      authorName: "Ethan Spaces",
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      commentsCount: 1
    }
  ];

  const comments: Comment[] = [
    {
      id: "comment_1",
      postId: "post_slow_living",
      authorId: author2Id,
      authorName: "Ethan Spaces",
      content: "This resonates deeply. I find that my best design work happens when I am completely disconnected from slack and my email for at least three consecutive hours.",
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "comment_2",
      postId: "post_slow_living",
      authorId: "user_reader_1",
      authorName: "Sophia Miller",
      content: "The 'Morning Threshold' rule has changed my relationship with anxiety. It turns out waking up to standard world emergencies doesn't put you in a very productive state of mind!",
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "comment_3",
      postId: "post_design_space",
      authorId: author1Id,
      authorName: "Clara Valentin",
      content: "This article is beautiful. The layout of this platform itself feels like a great example of editorial negative space!",
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
    }
  ];

  return { users, posts, comments };
}

export class DBManager {
  private static read(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_FILE)) {
        const initial = getInitialDB();
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
        return initial;
      }
      const raw = fs.readFileSync(DB_FILE, "utf8");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Database reading error, resetting...", e);
      const initial = getInitialDB();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
  }

  private static write(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
      console.error("Database writing error", e);
    }
  }

  // --- Auth & Users ---
  public static createUser(username: string, email: string, passwordPlain: string): UserDB {
    const db = this.read();
    
    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();
    const exists = db.users.some(u => u.email.toLowerCase() === normalizedEmail || u.username.toLowerCase() === normalizedUsername);
    if (exists) {
      throw new Error("Username or Email already registered");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = crypto.pbkdf2Sync(passwordPlain, salt, 1000, 64, "sha512").toString("hex");

    const newUser: UserDB = {
      id: "user_" + crypto.randomUUID(),
      username: username.trim(),
      email: normalizedEmail,
      passwordHash,
      salt,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    this.write(db);

    return newUser;
  }

  public static authenticateUser(emailOrUsername: string, passwordPlain: string): UserDB {
    const db = this.read();
    const identifier = emailOrUsername.toLowerCase().trim();
    const user = db.users.find(u => u.email.toLowerCase() === identifier || u.username.toLowerCase() === identifier);
    
    if (!user) {
      throw new Error("Invalid username/email or password");
    }

    const calculatedHash = crypto.pbkdf2Sync(passwordPlain, user.salt, 1000, 64, "sha512").toString("hex");
    if (calculatedHash !== user.passwordHash) {
      throw new Error("Invalid username/email or password");
    }

    return user;
  }

  public static getUserById(id: string): UserDB | null {
    const db = this.read();
    return db.users.find(u => u.id === id) || null;
  }

  // --- Posts ---
  public static getPosts(): Post[] {
    const db = this.read();
    // Sort posts by date descending
    return [...db.posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public static getPostById(id: string): Post | null {
    const db = this.read();
    return db.posts.find(p => p.id === id) || null;
  }

  public static createPost(title: string, content: string, authorId: string, authorName: string): Post {
    const db = this.read();
    
    const plainTextExcerpt = content
      .replace(/[#*`_\[\]()]/g, "") // remove simple md characters
      .slice(0, 180) + "...";

    const newPost: Post = {
      id: "post_" + crypto.randomUUID(),
      title: title.trim(),
      excerpt: plainTextExcerpt,
      content,
      authorId,
      authorName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      commentsCount: 0
    };

    db.posts.push(newPost);
    this.write(db);
    return newPost;
  }

  public static updatePost(id: string, title: string, content: string, userId: string): Post {
    const db = this.read();
    const postIndex = db.posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const post = db.posts[postIndex];
    if (post.authorId !== userId) {
      throw new Error("Unauthorized to edit this post");
    }

    const plainTextExcerpt = content
      .replace(/[#*`_\[\]()]/g, "")
      .slice(0, 180) + "...";

    const updatedPost: Post = {
      ...post,
      title: title.trim(),
      excerpt: plainTextExcerpt,
      content,
      updatedAt: new Date().toISOString()
    };

    db.posts[postIndex] = updatedPost;
    this.write(db);
    return updatedPost;
  }

  public static deletePost(id: string, userId: string): void {
    const db = this.read();
    const post = db.posts.find(p => p.id === id);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorId !== userId) {
      throw new Error("Unauthorized to delete this post");
    }

    // Filter out the post
    db.posts = db.posts.filter(p => p.id !== id);
    // Filter out comments associated with the post
    db.comments = db.comments.filter(c => c.postId !== id);

    this.write(db);
  }

  // --- Comments ---
  public static getCommentsForPost(postId: string): Comment[] {
    const db = this.read();
    return db.comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public static addComment(postId: string, content: string, authorId: string, authorName: string): Comment {
    const db = this.read();
    
    const postIndex = db.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const newComment: Comment = {
      id: "comment_" + crypto.randomUUID(),
      postId,
      authorId,
      authorName,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    db.comments.push(newComment);
    db.posts[postIndex].commentsCount = db.comments.filter(c => c.postId === postId).length;

    this.write(db);
    return newComment;
  }

  public static deleteComment(commentId: string, userId: string): void {
    const db = this.read();
    const commentIndex = db.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const comment = db.comments[commentIndex];
    const post = db.posts.find(p => p.id === comment.postId);

    // Only allow comment author OR the post owner to delete a comment
    const isCommentOwner = comment.authorId === userId;
    const isPostOwner = post ? post.authorId === userId : false;

    if (!isCommentOwner && !isPostOwner) {
      throw new Error("Unauthorized to delete this comment");
    }

    db.comments.splice(commentIndex, 1);

    // Update comment counts
    if (post) {
      const postIndex = db.posts.findIndex(p => p.id === post.id);
      if (postIndex !== -1) {
        db.posts[postIndex].commentsCount = db.comments.filter(c => c.postId === post.id).length;
      }
    }

    this.write(db);
  }
}
