import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User as UserIcon, Loader2, KeyRound } from "lucide-react";
import { AuthResponse } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (authData: AuthResponse) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isLogin) {
      if (!username || !email || !password || !confirmPassword) {
        setError("All fields are required");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
    } else {
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { emailOrUsername: email, password }
        : { username, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      onAuthSuccess(data);
      onClose();
      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        id="auth-backdrop"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl z-10"
        id="auth-modal-card"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-full hover:bg-zinc-800"
          id="auth-close-btn"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-zinc-100" id="auth-title">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            {isLogin
              ? "Sign in to join the conversation and publish stories."
              : "Register to write posts and connect with readers."}
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="rounded-2xl bg-red-950/20 p-3 text-sm text-red-400 border border-red-900/30">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <UserIcon size={16} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. claire_j"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden transition-colors"
                  id="auth-input-username"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
              {isLogin ? "Email or Username" : "Email Address"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Mail size={16} />
              </span>
              <input
                type={isLogin ? "text" : "email"}
                required
                placeholder={isLogin ? "username or email" : "your@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden transition-colors"
                id="auth-input-email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden transition-colors"
                id="auth-input-password"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <KeyRound size={16} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden transition-colors"
                  id="auth-input-confirm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-500 py-2.5 px-4 text-sm font-medium text-white hover:bg-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer mt-4 disabled:opacity-75"
            id="auth-submit-btn"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 border-t border-zinc-800 pt-4 text-center">
          <button
            onClick={toggleMode}
            className="text-zinc-400 hover:text-indigo-400 text-sm transition-colors cursor-pointer"
            id="auth-toggle-btn"
          >
            {isLogin ? (
              <>
                Don't have an account? <span className="font-semibold text-indigo-400">Register</span>
              </>
            ) : (
              <>
                Already have an account? <span className="font-semibold text-indigo-400">Sign In</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
