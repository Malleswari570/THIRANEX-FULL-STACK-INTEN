import { useState, useEffect } from "react";
import { Search, PlusCircle, BookOpen, Compass, FileText, ArrowRight, Sparkles, LogOut, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Post, User, AuthResponse } from "./types";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import PostCard from "./components/PostCard";
import PostDetail from "./components/PostDetail";
import PostEditor from "./components/PostEditor";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation and Modal states
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFilteringMyPosts, setIsFilteringMyPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Restore session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem("blog_token");
      if (!token) {
        setCurrentUser(null);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setCurrentUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem("blog_token");
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setCurrentUser(null);
      }
    };

    checkUserSession();
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    setError(null);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to retrieve stories");
      }
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load stories.");
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("blog_token");
    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.error("Logout API call failed:", e);
      }
    }
    localStorage.removeItem("blog_token");
    setCurrentUser(null);
    setIsFilteringMyPosts(false);
    // If user was viewing/editing personal screens, go home
    if (isEditing) {
      setIsEditing(false);
      setPostToEdit(null);
    }
  };

  const handleAuthSuccess = (authData: AuthResponse) => {
    localStorage.setItem("blog_token", authData.token);
    setCurrentUser(authData.user);
    fetchPosts(); // refresh metadata/comments counts if any
  };

  const handleNewPost = () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setPostToEdit(null);
    setIsEditing(true);
    setCurrentPostId(null);
  };

  const handleEditPost = (post: Post) => {
    setPostToEdit(post);
    setIsEditing(true);
    setCurrentPostId(null);
  };

  const handleSaveSuccess = (savedPost: Post) => {
    setIsEditing(false);
    setPostToEdit(null);
    fetchPosts();
    // Redirect directly to viewing the saved post!
    setCurrentPostId(savedPost.id);
  };

  const handleDeleteSuccess = () => {
    setCurrentPostId(null);
    fetchPosts();
  };

  // Filter posts based on search query and "My Stories" tab
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUserFilter = !isFilteringMyPosts || post.authorId === currentUser?.id;

    return matchesSearch && matchesUserFilter;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white" id="blog-app-root">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onNewPost={handleNewPost}
        onGoHome={() => {
          setCurrentPostId(null);
          setIsEditing(false);
          setPostToEdit(null);
        }}
        onFilterMyPosts={(val) => {
          setIsFilteringMyPosts(val);
          setCurrentPostId(null);
          setIsEditing(false);
          setPostToEdit(null);
        }}
        isFilteringMyPosts={isFilteringMyPosts}
      />

      {/* Main Container */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {/* 1. Post Editing State */}
          {isEditing ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <PostEditor
                postToEdit={postToEdit}
                onCancel={() => {
                  setIsEditing(false);
                  setPostToEdit(null);
                  if (postToEdit) {
                    // Return to detail view if cancelling an edit
                    setCurrentPostId(postToEdit.id);
                  }
                }}
                onSaveSuccess={handleSaveSuccess}
              />
            </motion.div>
          ) : currentPostId ? (
            /* 2. Post Detailed View State */
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <PostDetail
                postId={currentPostId}
                currentUser={currentUser}
                onBack={() => setCurrentPostId(null)}
                onEdit={handleEditPost}
                onDeleteSuccess={handleDeleteSuccess}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            </motion.div>
          ) : (
            /* 3. Feed & Explore State (Home View) */
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-5xl mx-auto px-6 py-12"
            >
              {/* Premium Publication Header */}
              <header className="mb-12 text-center max-w-2xl mx-auto space-y-6" id="feed-hero-section">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono tracking-widest uppercase font-bold">
                  <Sparkles size={11} className="text-indigo-400 animate-pulse" />
                  <span>Curated Perspectives</span>
                </div>
                
                <h1 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
                  {isFilteringMyPosts ? "My Creative Space" : "The Journal"}
                </h1>
                
                <p className="text-zinc-400 font-sans text-sm sm:text-base leading-relaxed">
                  {isFilteringMyPosts
                    ? "Review and curate your published articles, monitor comments, and continue composing your personal collection of stories."
                    : "A minimalist canvas for collective thought, deep-dive articles, and beautiful web typography. Join the discussion."}
                </p>

                {/* Unified Search Bar */}
                <div className="relative max-w-md mx-auto mt-8" id="search-bar-wrapper">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search stories by title, author, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden shadow-2xl transition-all"
                    id="search-input-field"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      id="search-clear-btn"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </header>

              {/* Feed Content Loader */}
              {loadingPosts ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="animate-spin text-indigo-400" size={28} />
                  <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">Indexing Library...</span>
                </div>
              ) : error ? (
                <div className="rounded-3xl border border-red-900/30 bg-red-950/10 p-8 text-center max-w-lg mx-auto" id="feed-error-container">
                  <p className="text-sm text-red-400 font-medium">{error}</p>
                  <button
                    onClick={fetchPosts}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Try Reconnecting
                  </button>
                </div>
              ) : filteredPosts.length === 0 ? (
                /* Empty Feed State */
                <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/20 p-12 text-center max-w-lg mx-auto" id="feed-empty-container">
                  <BookOpen size={36} className="mx-auto text-zinc-600 mb-4" />
                  <h3 className="font-sans text-lg font-bold text-zinc-200 mb-1">No stories found</h3>
                  <p className="text-sm text-zinc-500 mb-6 font-sans">
                    {searchQuery
                      ? "We couldn't find any articles matching your search query. Try typing something else."
                      : isFilteringMyPosts
                      ? "You haven't written any stories yet! Grab a virtual cup of tea and publish your first article."
                      : "The library is empty. Be the first to share an inspiring story!"}
                  </p>
                  <button
                    onClick={isFilteringMyPosts ? handleNewPost : handleNewPost}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs uppercase tracking-wider py-2.5 px-6 transition-colors shadow-lg shadow-indigo-500/15 cursor-pointer"
                    id="empty-state-btn"
                  >
                    <PlusCircle size={14} />
                    <span>Write First Story</span>
                  </button>
                </div>
              ) : (
                /* Dynamic Bento/Grid of Posts */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="posts-grid-layout">
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={() => {
                        setCurrentPostId(post.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Authentic Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12 text-center text-xs text-zinc-500 font-medium font-sans mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-bold text-zinc-300">THE JOURNAL</span>
            <span className="text-zinc-800">|</span>
            <span>Est. 2026</span>
          </div>
          <p className="text-zinc-600">
            A full-stack editorial publishing platform designed with negative space and responsive clarity.
          </p>
        </div>
      </footer>

      {/* Interactive Auth Trigger Modal */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
