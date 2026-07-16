import { Star, Eye, Heart, ShoppingCart } from "lucide-react";
import { Product } from "../types";
import { TRANSLATIONS } from "../data/translations";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  language: "en" | "te";
  onAddToCart: (prod: Product) => void;
  onToggleWishlist: (prod: Product) => void;
  isProductInWishlist: boolean;
  onViewDetails: (prod: Product) => void;
  inCartQuantity: number;
}

export default function ProductCard({
  product,
  language,
  onAddToCart,
  onToggleWishlist,
  isProductInWishlist,
  onViewDetails,
  inCartQuantity,
}: ProductCardProps) {
  const t = TRANSLATIONS[language];

  // Helper to determine badge text & color
  const getTagStyle = (tag?: string) => {
    if (!tag) return null;
    switch (tag.toLowerCase()) {
      case "best seller":
        return { text: t.bestSeller, bg: "bg-emerald-500 text-white" };
      case "discount":
        return { text: t.discount, bg: "bg-rose-500 text-white" };
      case "new arrival":
        return { text: t.newArrival, bg: "bg-orange-500 text-white" };
      default:
        return { text: tag, bg: "bg-neutral-600 text-white" };
    }
  };

  const tagStyle = getTagStyle(product.tag);

  return (
    <div className="group relative glass-card hover:bg-white/60 hover:scale-[1.02] border border-white/50 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-200/50 transition-all duration-300 flex flex-col h-full">
      {/* Product Image and badges */}
      <div className="relative aspect-square overflow-hidden bg-white/30 flex-shrink-0 border-b border-white/20">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Promo Badge */}
        {tagStyle && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md shadow-3xs ${tagStyle.bg}`}>
            {tagStyle.text}
          </span>
        )}

        {/* Action Overlays visible on hover or mobile */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-all border ${
              isProductInWishlist
                ? "bg-red-50 text-red-500 border-red-200"
                : "bg-white/80 text-neutral-700 hover:text-red-500 hover:bg-white border-white/40"
            }`}
            title={t.wishlist}
          >
            <Heart className={`w-4 h-4 ${isProductInWishlist ? "fill-current" : ""}`} />
          </button>

          <button
            id={`quick-view-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white text-neutral-700 hover:text-orange-600 shadow-md border border-white/40 transition-all"
            title={t.viewDetails}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category */}
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-orange-600">
            {product.category}
          </span>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(product)}
            className="text-sm sm:text-base font-extrabold text-neutral-900 line-clamp-2 hover:text-orange-600 cursor-pointer min-h-[40px] sm:min-h-[48px]"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-neutral-800 ml-1">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              ({product.reviewCount} {t.reviews})
            </span>
          </div>
        </div>

        {/* Pricing & Footer Actions */}
        <div className="pt-4 mt-3 border-t border-white/30 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-base sm:text-lg font-extrabold text-neutral-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            id={`card-add-btn-${product.id}`}
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              product.stock <= 0
                ? "bg-white/30 text-neutral-400 border border-white/40 cursor-not-allowed"
                : inCartQuantity > 0
                ? "bg-orange-50/70 border border-orange-200/40 text-orange-600 hover:bg-orange-100"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>
              {product.stock <= 0
                ? t.outOfStock
                : inCartQuantity > 0
                ? `${t.added} (${inCartQuantity})`
                : t.addToCart}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
