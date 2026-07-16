import React from "react";
import { Calendar, User, MessageSquare, Clock } from "lucide-react";
import { Post } from "../types";

interface PostCardProps {
  key?: string;
  post: Post;
  onClick: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  // Format publication date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate reading time based on typical reading speed of 200 words per minute
  const getReadingTime = (text: string) => {
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  };

  return (
    <article
      onClick={onClick}
      className="group flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer relative overflow-hidden"
      id={`post-card-${post.id}`}
    >
      {/* Decorative subtle background gradient on card hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="space-y-4 relative z-10">
        {/* Author & Read Time Header */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-zinc-500" />
            <span className="font-semibold text-zinc-400">{post.authorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-zinc-500" />
            <span>{getReadingTime(post.content)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-sans text-xl sm:text-2xl font-bold leading-snug text-zinc-100 group-hover:text-indigo-400 transition-colors" id={`post-title-${post.id}`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 font-sans" id={`post-excerpt-${post.id}`}>
          {post.excerpt}
        </p>
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 mt-6 pt-4 text-xs text-zinc-500 font-medium relative z-10">
        <div className="flex items-center gap-1">
          <Calendar size={13} className="text-zinc-500" />
          <span>{formatDate(post.createdAt)}</span>
        </div>

        <div className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <MessageSquare size={13} className="text-zinc-500" />
          <span>{post.commentsCount} {post.commentsCount === 1 ? "comment" : "comments"}</span>
        </div>
      </div>
    </article>
  );
}
