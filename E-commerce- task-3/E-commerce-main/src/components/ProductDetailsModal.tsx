import { useState, useEffect } from "react";
import { X, Star, Heart, ShoppingCart, ShieldCheck, Truck, RefreshCw, Layers } from "lucide-react";
import { Product } from "../types";
import { TRANSLATIONS } from "../data/translations";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  language: "en" | "te";
  onAddToCart: (prod: Product, quantity: number) => void;
  onToggleWishlist: (prod: Product) => void;
  isProductInWishlist: boolean;
}

export default function ProductDetailsModal({
  product,
  onClose,
  language,
  onAddToCart,
  onToggleWishlist,
  isProductInWishlist,
}: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);
  const t = TRANSLATIONS[language];

  // Reset quantity when shifting products
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
      {/* Dark Backdrop */}
      <div className="fixed inset-0 bg-neutral-950/45 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />

      {/* Modal Content Card */}
      <div className="relative glass-panel bg-white/75 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10 border border-white/60 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          id="close-details-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/60 hover:bg-white text-neutral-600 hover:text-neutral-900 border border-transparent hover:border-white/40 z-25 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Grid Panel */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-white/30 flex items-center justify-center p-6 md:p-12 border-b md:border-b-0 md:border-r border-white/40">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full max-h-[380px] object-cover rounded-2xl shadow-md duration-300"
            />
            {product.tag && (
              <span className="absolute top-6 left-6 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-lg shadow-3xs">
                {product.tag === "Best Seller" ? t.bestSeller : product.tag === "Discount" ? t.discount : t.newArrival}
              </span>
            )}
          </div>

          {/* Details Panel */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category Breadcrumb */}
              <span className="inline-flex px-3 py-1 rounded-full bg-orange-150/45 border border-orange-200/40 text-orange-655 text-xs font-bold shadow-3xs">
                {product.category}
              </span>

              {/* Title & Actions */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-current"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-bold ml-1.5 text-neutral-800">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-neutral-500 font-semibold">
                    ({product.reviewCount} {t.reviews})
                  </span>
                </div>
              </div>

              {/* Price Tag with Discounts */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-green-600 font-bold bg-green-50/70 border border-green-200/30 px-2.5 py-1 rounded-md">
                  {product.stock > 0 ? t.inStock : t.outOfStock}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-600 leading-relaxed font-semibold">
                {product.description}
              </p>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="flex flex-col items-center p-2.5 bg-white/45 backdrop-blur-md rounded-xl text-center border border-white/50 shadow-3xs">
                  <Truck className="w-5 h-5 text-neutral-700 mb-1" />
                  <span className="text-[10px] font-bold text-neutral-800">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center p-2.5 bg-white/45 backdrop-blur-md rounded-xl text-center border border-white/50 shadow-3xs">
                  <ShieldCheck className="w-5 h-5 text-neutral-700 mb-1" />
                  <span className="text-[10px] font-bold text-neutral-800">1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center p-2.5 bg-white/45 backdrop-blur-md rounded-xl text-center border border-white/50 shadow-3xs">
                  <RefreshCw className="w-5 h-5 text-neutral-700 mb-1" />
                  <span className="text-[10px] font-bold text-neutral-800">Easy Returns</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-orange-550" />
                  <span>{t.featuresTitle}</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-600 list-disc list-inside">
                  {product.features.map((feat, index) => (
                    <li key={index} className="font-semibold">
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quantity and Cart Controls */}
            <div className="pt-6 border-t border-white/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Quantity incrementer */}
              <div className="flex items-center justify-between border border-white/60 rounded-xl overflow-hidden w-full sm:w-auto h-12 flex-shrink-0 bg-white/40">
                <button
                  id="det-qty-dec"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-white/60 text-neutral-700 font-bold transition-all text-lg cursor-pointer select-none"
                >
                  -
                </button>
                <span className="px-6 text-sm font-bold text-neutral-900">{quantity}</span>
                <button
                  id="det-qty-inc"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-2 hover:bg-white/60 text-neutral-700 font-bold transition-all text-lg cursor-pointer select-none"
                >
                  +
                </button>
              </div>

              {/* Main functional triggers */}
              <div className="flex items-center gap-3 w-full">
                <button
                  id="det-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 h-12 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:bg-gray-250 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4.5 h-4.5 text-orange-400" />
                  <span>{t.addToCart}</span>
                </button>

                <button
                  id="det-wishlist-toggle-btn"
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3.5 h-12 w-12 rounded-xl flex items-center justify-center transition-all border ${
                    isProductInWishlist
                      ? "bg-red-50 text-red-500 border-red-200"
                      : "bg-white/50 border-white/60 text-neutral-600 hover:text-red-500 hover:bg-white"
                  }`}
                  title={t.wishlist}
                >
                  <Heart className={`w-5 h-5 ${isProductInWishlist ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
