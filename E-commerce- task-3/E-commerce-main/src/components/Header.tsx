import { Search, ShoppingBag, Heart, FileText, Globe } from "lucide-react";
import { CATEGORIES } from "../data/products";
import { TRANSLATIONS } from "../data/translations";

interface HeaderProps {
  language: "en" | "te";
  setLanguage: (lang: "en" | "te") => void;
  search: string;
  setSearch: (val: string) => void;
  cartCount: number;
  openCart: () => void;
  wishlistCount: number;
  openWishlist: () => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  openOrderHistory: () => void;
  orderCount: number;
}

export default function Header({
  language,
  setLanguage,
  search,
  setSearch,
  cartCount,
  openCart,
  wishlistCount,
  openWishlist,
  activeCategory,
  setActiveCategory,
  openOrderHistory,
  orderCount,
}: HeaderProps) {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/40 shadow-xs relative">
      {/* Alert bar */}
      <div className="bg-neutral-900/80 backdrop-blur-md text-white text-center py-1.5 px-4 text-xs font-semibold tracking-wide border-b border-white/10 uppercase">
        {t.freeShippingAlert}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveCategory("All Products")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text">
                {t.appName}
              </span>
              <p className="text-[9px] text-orange-600 font-bold leading-none tracking-widest hidden sm:block uppercase">
                Premium Shopping
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-full text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all text-neutral-800 shadow-xs"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Language Toggle */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLanguage(language === "en" ? "te" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/60 bg-white/40 text-xs font-bold text-neutral-800 hover:bg-white/70 transition-all select-none shadow-3xs hover:scale-102 active:scale-98"
              title="Change Language / భాషను మార్చండి"
            >
              <Globe className="w-3.5 h-3.5 text-orange-550" />
              <span>{language === "en" ? "తెలుగు" : "English"}</span>
            </button>

            {/* Order History */}
            <button
              id="orders-toggle-btn"
              onClick={openOrderHistory}
              className="p-2 text-neutral-700 hover:text-orange-600 relative bg-white/30 hover:bg-white/65 border border-white/40 rounded-full transition-all shadow-3xs"
              title={t.orderHistory}
            >
              <FileText className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              {orderCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {orderCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              id="wishlist-toggle-btn"
              onClick={openWishlist}
              className="p-2 text-neutral-700 hover:text-red-500 relative bg-white/30 hover:bg-white/65 border border-white/40 rounded-full transition-all shadow-3xs"
              title={t.wishlist}
            >
              <Heart className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="cart-toggle-btn"
              onClick={openCart}
              className="flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all shadow-md active:scale-95 cursor-pointer ml-1 text-xs sm:text-sm font-semibold tracking-wide"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-orange-400" />
              <span className="hidden sm:inline">
                {t.cart}
              </span>
              <span className="bg-orange-550 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-1">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Categories Bar & Mobile Search */}
        <div className="py-2.5 sm:py-3.5 border-t border-white/30 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between overflow-x-auto scrollbar-none">
          {/* Category Filter list */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearch(""); // clear search on category change
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all select-none shadow-3xs border ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white border-transparent"
                      : "bg-white/40 border-white/50 text-neutral-700 hover:bg-white/65 hover:text-neutral-900"
                  }`}
                >
                  {cat === "All Products" ? t.allCategories : cat}
                </button>
              );
            })}
          </div>

          {/* Mobile search input */}
          <div className="relative md:hidden w-full">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/50 border border-white/60 rounded-full text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-neutral-800"
            />
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
}
