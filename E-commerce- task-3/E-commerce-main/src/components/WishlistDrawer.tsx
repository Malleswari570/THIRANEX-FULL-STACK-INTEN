import { X, Trash2, ShoppingCart, Heart } from "lucide-react";
import { Product } from "../types";
import { TRANSLATIONS } from "../data/translations";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "te";
  wishlistItems: Product[];
  onRemoveFromWishlist: (prod: Product) => void;
  onMoveToCart: (prod: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  language,
  wishlistItems,
  onRemoveFromWishlist,
  onMoveToCart,
}: WishlistDrawerProps) {
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-950/45 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Slidable Content Card Panel */}
        <div className="w-screen max-w-md glass-panel bg-white/75 backdrop-blur-xl shadow-2xl flex flex-col h-full transform transition-all duration-350 animate-in slide-in-from-right relative border-l border-white/60">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/40 flex items-center justify-between bg-white/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-xs">
                <Heart className="w-4.5 h-4.5 fill-current" />
              </div>
              <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">{t.wishlist}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 bg-white/60 rounded-full border border-white/40 text-neutral-800">
                {wishlistItems.length}
              </span>
            </div>
            <button
              id="close-wishlist-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/60 text-neutral-500 hover:text-neutral-900 border border-transparent hover:border-white/40 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/40 border border-white/60 flex items-center justify-center text-rose-500 animate-pulse">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-neutral-800 tracking-tight">
                    {language === "en" ? "Your Wishlist is Empty" : "మీ కోరికల జాబితా ఖాళీగా ఉంది"}
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-[240px] mt-1 font-sans font-medium">
                    {language === "en" 
                      ? "Keep eye-catching items closer by tapping the heart icon on any product card!" 
                      : "ఏదైనా వస్తువు నచ్చినప్పుడు, దానిపై ఉన్న హార్ట్ ఐకాన్‌ను క్లిక్ చేసి ఇక్కడ దాచుకోండి!"}
                  </p>
                </div>
              </div>
            ) : (
              wishlistItems.map((prod) => (
                <div key={prod.id} className="flex gap-4 p-3.5 bg-white/45 backdrop-blur-md rounded-2xl border border-white/50 hover:bg-white/65 transition-colors group shadow-3xs">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-neutral-100 border border-white/40 flex-shrink-0 group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                        {prod.name}
                      </h4>
                      <span className="text-xs font-extrabold text-orange-655 font-mono">
                        ${prod.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 gap-2">
                      <button
                        id={`wishlist-movetocart-${prod.id}`}
                        onClick={() => onMoveToCart(prod)}
                        disabled={prod.stock <= 0}
                        className="flex-1 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-orange-400" />
                        <span>{t.addToCart}</span>
                      </button>

                      <button
                        id={`wishlist-remove-${prod.id}`}
                        onClick={() => onRemoveFromWishlist(prod)}
                        className="p-1.5 px-2 rounded-lg border border-white/60 bg-white/30 text-neutral-400 hover:text-red-500 hover:bg-white/60 transition-all cursor-pointer shadow-3xs"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
