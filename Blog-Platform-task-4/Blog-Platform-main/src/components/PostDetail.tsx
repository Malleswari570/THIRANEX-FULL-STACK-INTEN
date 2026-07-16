import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit2, Trash2, Calendar, User, MessageSquare, Clock, Send, ShieldAlert, Loader2 } from "lucide-react";
import { Post, Comment, User as UserType } from "../types";

interface PostDetailProps {
  postId: string;
  currentUser: UserType | null;
  onBack: () => void;
  onEdit: (post: Post) => void;
  onDeleteSuccess: () => void;
  onOpenAuth: () => void;
}

export default function PostDetail({
  postId,
  currentUser,
  onBack,
  onEdit,
  onDeleteSuccess,
  onOpenAuth,
}: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Fetch post details & comments
  const fetchPostDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load post");
      }
      setPost(data.post);
      setComments(data.comments);
    } catch (err: any) {
      setError(err.message || "Something went wrong loading this story.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setSubmittingComment(true);
    try {
      const token = localStorage.getItem("blog_token");
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add comment");
      }

      setComments((prev) => [...prev, data]);
      setNewComment("");
      if (post) {
        setPost({ ...post, commentsCount: post.commentsCount + 1 });
      }
    } catch (err: any) {
      alert(err.message || "Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    setDeletingCommentId(commentId);
    try {
      const token = localStorage.getItem("blog_token");
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete comment");
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      if (post) {
        setPost({ ...post, commentsCount: Math.max(0, post.commentsCount - 1) });
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this story? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingPost(true);
    try {
      const token = localStorage.getItem("blog_token");
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      onDeleteSuccess();
    } catch (err: any) {
      alert(err.message || "Failed to delete story");
      setDeletingPost(false);
    }
  };

  // Human-friendly relative date formatting
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCommentDate = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (3600 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 3600 * 1000));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Standard word count multiplier
  const getReadingTime = (text: string) => {
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  };

  // Custom visual markdown formatter (supports subheaders and paragraph lists nicely)
  const renderParagraphs = (text: string) => {
    return text.split("\n\n").map((para, idx) => {
      const trimmedPara = para.trim();
      
      // Render subheaders: ### Title
      if (trimmedPara.startsWith("###")) {
        return (
          <h4 key={idx} className="font-sans text-xl font-bold text-zinc-100 mt-8 mb-4">
            {trimmedPara.replace(/^###\s*/, "")}
          </h4>
        );
      }
      
      // Render subheaders: ## Title
      if (trimmedPara.startsWith("##")) {
        return (
          <h3 key={idx} className="font-sans text-2xl font-bold text-zinc-100 mt-10 mb-5">
            {trimmedPara.replace(/^##\s*/, "")}
          </h3>
        );
      }

      // Render numbered lists
      if (/^\d+\.\s+/.test(trimmedPara)) {
        const items = trimmedPara.split("\n");
        return (
          <ol key={idx} className="list-decimal list-inside space-y-2 my-6 pl-4 text-zinc-300">
            {items.map((item, itemIdx) => (
              <li key={itemIdx} className="leading-relaxed">
                {item.replace(/^\d+\.\s+/, "")}
              </li>
            ))}
          </ol>
        );
      }

      // Render bullet points
      if (trimmedPara.startsWith("-") || trimmedPara.startsWith("*")) {
        const items = trimmedPara.split("\n");
        return (
          <ul key={idx} className="list-disc list-inside space-y-2 my-6 pl-4 text-zinc-300">
            {items.map((item, itemIdx) => (
              <li key={itemIdx} className="leading-relaxed">
                {item.replace(/^[-*]\s+/, "")}
              </li>
            ))}
          </ul>
        );
      }

      // Standard paragraphs
      return (
        <p key={idx} className="text-zinc-300 font-sans text-base sm:text-[16px] leading-relaxed mb-6 font-normal">
          {para}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
        <span className="text-sm font-mono tracking-wider text-zinc-500">Loading Story...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-xl mx-auto py-16 px-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-950/20 text-red-400 border border-red-900/30 mb-4">
          <ShieldAlert size={24} />
        </div>
        <h3 className="font-sans text-xl font-bold text-zinc-100 mb-2">Failed to load story</h3>
        <p className="text-zinc-400 text-sm mb-6">{error || "Story might have been removed or is unavailable."}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 py-2 px-5 text-xs font-semibold text-zinc-300 uppercase tracking-wider hover:bg-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to stories
        </button>
      </div>
    );
  }

  const isPostAuthor = currentUser?.id === post.authorId;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8" id={`post-detail-${post.id}`}>
      {/* Navigation & Actions Row */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors text-sm font-medium cursor-pointer"
          id="detail-back-btn"
        >
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </button>

        {isPostAuthor && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(post)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
              id="detail-edit-btn"
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDeletePost}
              disabled={deletingPost}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-900/30 bg-red-950/20 hover:bg-red-950/40 hover:border-red-800 text-xs font-semibold text-red-400 transition-all cursor-pointer disabled:opacity-50"
              id="detail-delete-btn"
            >
              {deletingPost ? (
                <Loader2 className="animate-spin" size={13} />
              ) : (
                <Trash2 size={13} />
              )}
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Post Section as a Bento Card */}
      <article className="border border-zinc-800 bg-zinc-900/30 rounded-3xl p-6 sm:p-10 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/2 rounded-full filter blur-3xl pointer-events-none" />

        {/* Category/Metadata Accent */}
        <div className="flex items-center gap-4 mb-4 text-xs font-mono tracking-widest text-zinc-500 uppercase">
          <div className="flex items-center gap-1">
            <User size={13} className="text-zinc-500" />
            <span className="font-semibold text-zinc-400">{post.authorName}</span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-center gap-1">
            <Clock size={13} className="text-zinc-500" />
            <span>{getReadingTime(post.content)}</span>
          </div>
        </div>

        {/* Big Display Title */}
        <h1 className="font-sans text-3xl sm:text-4xl font-bold leading-tight text-zinc-100 mb-6" id="detail-title">
          {post.title}
        </h1>

        {/* Date Row */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium mb-10 border-b border-zinc-800 pb-6">
          <Calendar size={13} />
          <span>Published on {formatDate(post.createdAt)}</span>
          {post.updatedAt !== post.createdAt && (
            <span className="text-zinc-500 italic font-sans ml-1.5">
              (Updated {formatDate(post.updatedAt)})
            </span>
          )}
        </div>

        {/* Rich Paragraph Contents */}
        <div className="prose max-w-none prose-invert" id="detail-content-body">
          {renderParagraphs(post.content)}
        </div>
      </article>

      {/* Comment Section Header */}
      <section className="space-y-8" id="comments-section">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
          <MessageSquare size={18} className="text-indigo-400" />
          <h3 className="font-sans text-xl font-bold text-zinc-100">
            Comments ({comments.length})
          </h3>
        </div>

        {/* New Comment Submission Box */}
        {currentUser ? (
          <form onSubmit={handleAddComment} className="flex gap-4 items-start" id="comment-form">
            <div className="flex-1">
              <textarea
                required
                rows={3}
                placeholder="Join the discussion... share your insights and perspective."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden transition-colors resize-none font-sans"
                id="comment-textarea"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs uppercase tracking-wider py-2.5 px-5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  id="comment-submit-btn"
                >
                  {submittingComment ? (
                    <Loader2 className="animate-spin" size={13} />
                  ) : (
                    <Send size={13} />
                  )}
                  <span>Post Comment</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 text-center" id="comment-guest-prompt">
            <p className="text-sm text-zinc-400 mb-3">
              Log in to join the conversation and publish comments.
            </p>
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-5 transition-colors cursor-pointer"
              id="comment-guest-login-btn"
            >
              Sign In to Comment
            </button>
          </div>
        )}

        {/* Existing Comments List */}
        <div className="space-y-4" id="comments-list">
          {comments.length === 0 ? (
            <p className="text-center py-8 text-zinc-500 text-sm italic font-sans">
              No comments yet. Be the first to spark the conversation!
            </p>
          ) : (
            comments.map((comment) => {
              const isCommentAuthor = currentUser?.id === comment.authorId;
              const isPostAuthorUser = currentUser?.id === post.authorId;
              const canDelete = isCommentAuthor || isPostAuthorUser;

              return (
                <div
                  key={comment.id}
                  className="group flex justify-between gap-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all"
                  id={`comment-item-${comment.id}`}
                >
                  <div className="space-y-1.5 flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 text-xs font-sans">
                      <span className="font-semibold text-zinc-300">@{comment.authorName}</span>
                      {comment.authorId === post.authorId && (
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
                          Author
                        </span>
                      )}
                      <span className="text-zinc-700">•</span>
                      <span className="text-zinc-500 font-mono">{formatCommentDate(comment.createdAt)}</span>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={deletingCommentId === comment.id}
                      className="text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-md hover:bg-zinc-800 self-start cursor-pointer"
                      id={`comment-delete-${comment.id}`}
                      title="Delete comment"
                    >
                      {deletingCommentId === comment.id ? (
                        <Loader2 className="animate-spin" size={13} />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
