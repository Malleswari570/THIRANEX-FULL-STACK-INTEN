import React, { useState } from "react";
import { PenSquare, LogOut, User as UserIcon, Feather, Compass, FileText } from "lucide-react";
import { User } from "../types";

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNewPost: () => void;
  onGoHome: () => void;
  onFilterMyPosts: (onlyMyPosts: boolean) => void;
  isFilteringMyPosts: boolean;
}

export default function Navbar({
  currentUser,
  onOpenAuth,
  onLogout,
  onNewPost,
  onGoHome,
  onFilterMyPosts,
  isFilteringMyPosts
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-45 w-full border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md" id="app-navbar">
      <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <button
          onClick={() => {
            onGoHome();
            onFilterMyPosts(false);
          }}
          className="flex items-center gap-2 group cursor-pointer"
          id="nav-logo-btn"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-md shadow-indigo-500/20">
            <Feather size={16} className="transform -rotate-12" />
          </div>
          <span className="font-sans text-lg font-bold tracking-wider text-zinc-100 uppercase" id="nav-brand-title">
            THE JOURNAL
          </span>
        </button>

        {/* Navigation Actions */}
        <div className="flex items-center gap-6">
          {/* Feed Links */}
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <button
              onClick={() => {
                onGoHome();
                onFilterMyPosts(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                !isFilteringMyPosts
                  ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                  : "text-zinc-400 border-transparent hover:text-zinc-200"
              }`}
              id="nav-btn-explore"
            >
              <Compass size={15} />
              Explore
            </button>

            {currentUser && (
              <button
                onClick={() => onFilterMyPosts(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isFilteringMyPosts
                    ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                    : "text-zinc-400 border-transparent hover:text-zinc-200"
                }`}
                id="nav-btn-my-stories"
              >
                <FileText size={15} />
                My Stories
              </button>
            )}
          </div>

          {/* Action Button: Compose Post */}
          <button
            onClick={currentUser ? onNewPost : onOpenAuth}
            className="flex items-center gap-1.5 rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/10 cursor-pointer"
            id="nav-write-post-btn"
          >
            <PenSquare size={14} />
            <span>Write</span>
          </button>

          {/* User Profile dropdown or trigger */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm hover:ring-2 hover:ring-indigo-500/30 transition-all cursor-pointer uppercase"
                id="nav-profile-trigger"
                title={currentUser.username}
              >
                {currentUser.username.charAt(0)}
              </button>

              {dropdownOpen && (
                <>
                  {/* Overlay for clicking outside */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />

                  {/* Dropdown Card */}
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl z-20" id="nav-dropdown">
                    <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Signed in as</p>
                      <p className="font-semibold text-zinc-200 truncate" id="nav-dropdown-username">@{currentUser.username}</p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onFilterMyPosts(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors text-left cursor-pointer"
                      id="nav-dropdown-my-posts"
                    >
                      <UserIcon size={15} className="text-zinc-400" />
                      My Stories
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left cursor-pointer"
                      id="nav-dropdown-logout"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
              id="nav-login-trigger"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
