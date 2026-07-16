import React, { useState } from "react";
import { ArrowLeft, Save, Loader2, Sparkles } from "lucide-react";
import { Post } from "../types";

interface PostEditorProps {
  postToEdit?: Post | null;
  onCancel: () => void;
  onSaveSuccess: (savedPost: Post) => void;
}

export default function PostEditor({ postToEdit, onCancel, onSaveSuccess }: PostEditorProps) {
  const [title, setTitle] = useState(postToEdit?.title || "");
  const [content, setContent] = useState(postToEdit?.content || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Please fill out both the title and content of your story.");
      return;
    }

    if (title.trim().length < 5) {
      setError("Please write a descriptive title (at least 5 characters).");
      return;
    }

    if (content.trim().length < 20) {
      setError("Please elaborate on your story (at least 20 characters).");
      return;
    }

    setLoading(true);
    try {
      const isEdit = !!postToEdit;
      const endpoint = isEdit ? `/api/posts/${postToEdit.id}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";
      const token = localStorage.getItem("blog_token");

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish post");
      }

      onSaveSuccess(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving your story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8" id="post-editor-container">
      {/* Top Controls Row */}
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors text-sm font-medium cursor-pointer"
          id="editor-back-btn"
        >
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs uppercase tracking-wider py-2 px-5 shadow-lg shadow-indigo-500/10 transition-colors cursor-pointer disabled:opacity-70"
          id="editor-publish-btn"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={13} />
          ) : (
            <Save size={13} />
          )}
          <span>{postToEdit ? "Save Changes" : "Publish Story"}</span>
        </button>
      </div>

      {/* Editor Body */}
      <form onSubmit={handleSubmit} className="space-y-6" id="editor-form">
        {error && (
          <div className="rounded-2xl bg-red-950/20 p-4 text-sm text-red-400 border border-red-900/30 font-sans" id="editor-error-alert">
            {error}
          </div>
        )}

        {/* Big Sans Title Input */}
        <div>
          <input
            type="text"
            required
            autoFocus
            placeholder="Title of your story..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent font-sans text-3xl sm:text-4xl font-bold leading-tight text-zinc-100 placeholder-zinc-700 border-none outline-hidden p-0 focus:ring-0"
            id="editor-input-title"
          />
          <div className="h-px bg-zinc-800 w-full mt-4" />
        </div>

        {/* Content TextArea */}
        <div className="relative">
          <textarea
            required
            rows={15}
            placeholder="Tell your story... You can separate paragraphs with blank lines. For subheaders, start lines with '### ' or '## '."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent font-sans text-base sm:text-[16px] leading-relaxed text-zinc-300 placeholder-zinc-500 border-none outline-hidden p-0 focus:ring-0 resize-none min-h-[300px]"
            id="editor-textarea-content"
          />
        </div>

        {/* Formatting Guidance Panel */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 flex gap-3 items-start" id="editor-guide-panel">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5 border border-indigo-500/20">
            <Sparkles size={14} />
          </div>
          <div className="text-xs text-zinc-400 leading-relaxed font-sans">
            <span className="font-semibold text-zinc-300 block mb-1">Editor Formatting Guide</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 list-disc list-inside">
              <li>Use <code className="font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-700 font-semibold">## Heading</code> for major sections</li>
              <li>Use <code className="font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-700 font-semibold">### Subheader</code> for small subheaders</li>
              <li>Separate standard paragraphs with two line breaks</li>
              <li>Start lines with <code className="font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-700 font-semibold">- </code> or <code className="font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-700 font-semibold">* </code> for lists</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
