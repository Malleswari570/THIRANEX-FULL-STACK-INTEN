export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface UserDB extends User {
  passwordHash: string;
  salt: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
