import { useState, useEffect, useMemo } from "react";
import { SlidersHorizontal, ArrowUpDown, RefreshCcw, HelpCircle, Heart, Star, Sparkles, CheckCircle, Flame, ShoppingBag } from "lucide-react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProductCard from "./components/ProductCard";
import ProductDetailsModal from "./components/ProductDetailsModal";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import CheckoutModal from "./components/CheckoutModal";
import OrderHistory from "./components/OrderHistory";
import { PRODUCTS } from "./data/products";
import { Product, CartItem, Order, ShippingAddress } from "./types";
import { TRANSLATIONS } from "./data/translations";

export default function App() {
  // --- States ---
  const [language, setLanguage] = useState<"en" | "te">(() => {
    const saved = localStorage.getItem("bazaar_lang");
    return saved === "te" ? "te" : "en";
  });

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Products");
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("bazaar_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("bazaar_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("bazaar_orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountValue, setDiscountValue] = useState(0);

  // Sorting
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  // Toasts
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" | "error" }[]>([]);

  const t = TRANSLATIONS[language];

  // --- Effects for LocalStorage ---
  useEffect(() => {
    localStorage.setItem("bazaar_lang", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("bazaar_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("bazaar_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    localStorage.setItem("bazaar_orders", JSON.stringify(orders));
  }, [orders]);

  // --- Toast Trigger helper ---
  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = `toast-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  // --- Cart Helpers ---
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existIndex].quantity + quantity;
        if (newQty > product.stock) {
          showToast(language === "en" ? "Insufficient stock available" : "తగినంత నిల్వ లేదు", "error");
          return prev;
        }
        updated[existIndex].quantity = newQty;
        showToast(language === "en" ? `Updated ${product.name} quantity in Cart` : `${product.name} పరిమాణాన్ని అప్‌డేట్ చేసాము`, "success");
        return updated;
      } else {
        showToast(language === "en" ? `Added ${product.name} to Cart` : `${product.name} ని కార్ట్‌కి చేర్చాము`, "success");
        return [...prev, { product, quantity }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            showToast(language === "en" ? "Cannot exceed item stock balance" : "ఐటమ్ స్టాక్ పరిమితి దాటకూడదు", "error");
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast(language === "en" ? "Removed item from Cart" : "కార్ట్ నుండి వస్తువును తొలగించాము", "info");
  };

  // --- Wishlist Helpers ---
  const handleToggleWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(language === "en" ? "Removed from Wishlist" : "కోరికల జాబితా నుండి తొలగించాము", "info");
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(language === "en" ? "Saved to Wishlist" : "కోరికల జాబితాకు జోడించబడింది", "success");
        return [...prev, product];
      }
    });
  };

  const handleMoveToCart = (product: Product) => {
    handleAddToCart(product, 1);
    setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
  };

  // --- Checkout Trigger ---
  const handleCheckoutTrigger = (coupon: string, discount: number) => {
    setAppliedCoupon(coupon);
    setDiscountValue(discount);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // --- Place Order ---
  const handlePlaceOrder = (address: ShippingAddress, paymentMethod: string, orderId: string) => {
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString(language === "te" ? "te-IN" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      items: cartItems,
      totalAmount: cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) - discountValue + (cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) - discountValue >= 50 ? 0 : 5.99) + (cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) - discountValue) * 0.085,
      shippingAddress: address,
      paymentMethod,
      status: "Processing"
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]); // clear cart
    setAppliedCoupon("");
    setDiscountValue(0);
    showToast(language === "en" ? "Order registered successfully!" : "ఆర్డర్ విజయవంతంగా పూర్తయింది!", "success");
  };

  // --- Filtered and Sorted products ---
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Search query match (in English products list)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category match
    if (activeCategory !== "All Products") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-mesh relative overflow-x-hidden flex flex-col font-sans selection:bg-orange-550 selection:text-white">
      {/* Background Decorative Mesh Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] rounded-full bg-violet-300/30 blur-3xl animate-pulse duration-[10s]" />
        <div className="absolute top-[35%] right-[-15%] w-[650px] h-[650px] rounded-full bg-fuchsia-300/25 blur-3xl animate-pulse duration-[14s]" />
        <div className="absolute bottom-[8%] left-[8%] w-[500px] h-[500px] rounded-full bg-emerald-300/15 blur-3xl animate-pulse duration-[12s]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[550px] h-[550px] rounded-full bg-sky-300/25 blur-3xl animate-pulse duration-[16s]" />
      </div>

      {/* Global Toast Notifier */}
      <div className="fixed bottom-5 left-5 z-55 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-2 pointer-events-auto animate-in slide-in-from-left duration-250 backdrop-blur-xl ${
              toast.type === "success"
                ? "bg-neutral-900/90 text-white border border-neutral-800"
                : toast.type === "error"
                ? "bg-rose-600/95 text-white border border-rose-700"
                : "bg-white/90 text-neutral-800 border border-white/60"
            }`}
          >
            {toast.type === "success" && <CheckCircle className="w-4.5 h-4.5 text-orange-400" />}
            <span className="text-xs font-bold leading-normal">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header element */}
      <div className="relative z-40">
        <Header
          language={language}
          setLanguage={setLanguage}
          search={search}
          setSearch={setSearch}
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          openCart={() => setIsCartOpen(true)}
          wishlistCount={wishlistItems.length}
          openWishlist={() => setIsWishlistOpen(true)}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          openOrderHistory={() => setIsOrderHistoryOpen(true)}
          orderCount={orders.length}
        />
      </div>

      {/* Main Body */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
        
        {/* Hero Area */}
        {activeCategory === "All Products" && !search && (
          <HeroSection
            language={language}
            onShopNow={(category) => {
              if (category) {
                setActiveCategory(category);
              } else {
                setActiveCategory("All Products");
              }
              const gridOffset = document.getElementById("product-grid");
              if (gridOffset) {
                gridOffset.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
        )}

        {/* Promo Small banners Grid */}
        {activeCategory === "All Products" && !search && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl flex items-center gap-3 glass-card bg-orange-50/40 border-orange-200/40">
              <div className="p-3 bg-orange-150/60 rounded-xl text-orange-700 shrink-0">
                <Flame className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block leading-tight">Lightning Sale</span>
                <span className="text-xs font-extrabold text-neutral-800">Extra $10 off with WELCOME10</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl flex items-center gap-3 glass-card bg-emerald-50/40 border-emerald-200/40">
              <div className="p-3 bg-emerald-150/60 rounded-xl text-emerald-700 shrink-0">
                <Sparkles className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block leading-tight">Trending items</span>
                <span className="text-xs font-extrabold text-neutral-800">Featured products in demand</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl flex items-center gap-3 glass-card bg-amber-50/40 border-amber-200/40">
              <div className="p-3 bg-amber-150/60 rounded-xl text-amber-700 shrink-0">
                <Star className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block leading-tight">Trusted Quality</span>
                <span className="text-xs font-extrabold text-neutral-800">Verified 4.5+ star high ratings</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl flex items-center gap-3 glass-card bg-purple-50/40 border-purple-200/40">
              <div className="p-3 bg-purple-150/60 rounded-xl text-purple-700 shrink-0">
                <Heart className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block leading-tight">Perfect Gifting</span>
                <span className="text-xs font-extrabold text-neutral-800">Premium boxes & bags wraps</span>
              </div>
            </div>
          </div>
        )}

        {/* Catalog Grid Area wrapper */}
        <div id="product-grid" className="space-y-6">
          {/* Controls Bar: Category heading, Item count, Sorting Options */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/30 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
                <span>{activeCategory === "All Products" ? t.allCategories : activeCategory}</span>
                <span className="text-xs font-bold text-neutral-600 bg-white/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/50">
                  {filteredProducts.length} {t.items}
                </span>
              </h2>
              {search && (
                <p className="text-xs text-neutral-600 mt-2 font-medium font-sans">
                  Showing matches for &ldquo;<span className="font-semibold text-neutral-900">{search}</span>&rdquo;
                </p>
              )}
            </div>

            {/* Sorting bar */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort:</span>
              </div>
              <select
                id="bazaar-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-1.5 bg-white/70 backdrop-blur-md border border-white/50 rounded-xl text-xs font-semibold text-neutral-800 outline-hidden focus:border-orange-300 transition-all duration-200 cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated Only</option>
              </select>
            </div>
          </div>

          {/* Master product grid layout */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white border border-gray-100 rounded-3xl space-y-4 shadow-3xs">
              <div className="w-16 h-16 rounded-full bg-neutral-105 flex items-center justify-center text-gray-400 mx-auto">
                <SlidersHorizontal className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-900">No Premium Items Match</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto font-sans">
                  Try clearing some active category filters or updating search fields to locate more stock options.
                </p>
              </div>
              <button
                id="reset-grid-filters"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All Products");
                  setSortBy("featured");
                }}
                className="px-5 py-2 hover:bg-neutral-900 flex items-center gap-2 border border-gray-200 bg-neutral-50 hover:text-white rounded-xl text-xs font-semibold mx-auto transition-all cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  language={language}
                  onAddToCart={(prod) => handleAddToCart(prod)}
                  onToggleWishlist={handleToggleWishlist}
                  isProductInWishlist={wishlistItems.some((item) => item.id === p.id)}
                  onViewDetails={setSelectedProduct}
                  inCartQuantity={cartItems.find((item) => item.product.id === p.id)?.quantity || 0}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Trust & Policy Info Cards Footer */}
      <footer className="bg-neutral-900 text-white mt-20 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-400" />
              <span>{t.appName}</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              {t.tagline}. High fidelity premium materials with bilingual support for modern shopping enthusiasts.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-black text-gray-400">Shopping Info</h4>
            <ul className="space-y-1.5 text-xs text-gray-300 font-sans">
              <li>Track Active Orders</li>
              <li>Free Shipping Minimum: $50</li>
              <li>Returns & Exchanges</li>
              <li>Gifting Cards Options</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-black text-gray-400">About Handcrafts</h4>
            <ul className="space-y-1.5 text-xs text-gray-300 font-sans">
              <li>American Walnut desks</li>
              <li>Full Grain Leather Jackets</li>
              <li>Ceramic Dripper sets</li>
              <li>100% Cotton Fleeces</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-black text-gray-400">Support Helper</h4>
            <div className="p-3 bg-neutral-800 rounded-2xl space-y-2 border border-neutral-700/60">
              <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                Need customized help? Chat triggers and order logs are preserved locally inside your client space cache.
              </p>
              <div className="flex items-center gap-1 text-[10px] text-orange-400 font-bold">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Simulated Secure Workspace</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 py-6 text-center text-xs text-gray-550 max-w-7xl mx-auto px-4">
          <p>© 2026 {t.appName} &bull; Simulated Shopping Bazaar &bull; Engineered to be Mobile Responsive.</p>
        </div>
      </footer>

      {/* --- Overlay Modals & Drawers --- */}

      {/* Detailed Modal view */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        language={language}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isProductInWishlist={selectedProduct ? wishlistItems.some((item) => item.id === selectedProduct.id) : false}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        language={language}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutTrigger}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        language={language}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveToCart}
      />

      {/* Checkout Drawer/Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        language={language}
        cartItems={cartItems}
        appliedCoupon={appliedCoupon}
        discountValue={discountValue}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Order History Drawer */}
      <OrderHistory
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        language={language}
        orders={orders}
      />
    </div>
  );
}
