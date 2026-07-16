import { useState } from "react";
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Percent } from "lucide-react";
import { CartItem } from "../types";
import { TRANSLATIONS } from "../data/translations";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "te";
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (appliedCoupon: string, discountValue: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  language,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountFlat, setDiscountFlat] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Calculate discount
  const discountFromPercent = (subtotal * discountPercent) / 100;
  const totalDiscount = Math.min(subtotal, discountFromPercent + discountFlat);
  
  const formattedSubtotal = subtotal - totalDiscount;
  const shippingFee = subtotal === 0 || formattedSubtotal >= 50 ? 0 : 5.99;
  const tax = formattedSubtotal * 0.085; // 8.5% simulated tax
  const total = Math.max(0, formattedSubtotal + shippingFee + tax);

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      setDiscountFlat(10);
      setDiscountPercent(0);
      setAppliedCoupon("WELCOME10 ($10 OFF)");
      setCouponCode("");
    } else if (code === "SHOP20") {
      setDiscountPercent(20);
      setDiscountFlat(0);
      setAppliedCoupon("SHOP20 (20% OFF)");
      setCouponCode("");
    } else if (code === "") {
      setCouponError("Please enter a coupon code");
    } else {
      setCouponError(language === "en" ? "Invalid Coupon Code" : "తప్పు కూపన్ కోడ్");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountFlat(0);
    setDiscountPercent(0);
    setAppliedCoupon("");
  };

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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-xs">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">{t.cart}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 bg-white/60 rounded-full border border-white/40 text-neutral-800">
                {cartItems.length}
              </span>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/60 text-neutral-500 hover:text-neutral-900 border border-transparent hover:border-white/40 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/40 border border-white/60 flex items-center justify-center text-orange-500 animate-pulse">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-neutral-800 tracking-tight">{t.emptyCart}</h3>
                  <p className="text-xs text-neutral-500 max-w-[240px] mt-1 font-sans font-medium">
                    {language === "en" 
                      ? "Search our products list and add some premium items to your box!" 
                      : "మా ఉత్పత్తులను శోధించి, మీ బాక్స్‌కు అద్భుతమైన వస్తువులను జోడించండి!"}
                  </p>
                </div>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-3.5 bg-white/45 backdrop-blur-md rounded-2xl border border-white/50 hover:bg-white/65 transition-colors group shadow-3xs">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-neutral-100 border border-white/40 flex-shrink-0 group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-neutral-900 truncate">
                        {item.product.name}
                      </h4>
                      <span className="text-xs font-bold text-orange-655 font-mono">
                        ${item.product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity Adjustment Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-white/60 rounded-lg overflow-hidden h-7 bg-white/50 backdrop-blur-md">
                        <button
                          id={`drawer-dec-${item.product.id}`}
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 hover:bg-white/60 text-neutral-700 font-bold transition-all text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-extrabold text-neutral-950">{item.quantity}</span>
                        <button
                          id={`drawer-inc-${item.product.id}`}
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 hover:bg-white/60 text-neutral-700 font-bold transition-all text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        id={`drawer-remove-${item.product.id}`}
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-all cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing calculations footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-white/40 p-6 bg-white/35 backdrop-blur-md space-y-4">
              
              {/* Coupon Form */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-orange-50/70 border border-orange-100/40 rounded-xl text-xs">
                    <span className="font-bold text-orange-700 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 shrink-0" />
                      Coupon Applied: {appliedCoupon}
                    </span>
                    <button
                      id="remove-coupon-btn"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] font-bold text-red-650 hover:text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Promo code (SHOP20, WELCOME10)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-white/50 border border-white/60 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-hidden focus:bg-white transition-all text-neutral-800"
                        />
                        <Percent className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                      <button
                        id="apply-coupon-btn"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-neutral-700 font-sans font-semibold">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-bold text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Discount</span>
                    <span className="font-extrabold">-${totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t.shipping}</span>
                  <span className="font-bold text-neutral-900 text-[10px] tracking-wide">
                    {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t.tax} (8.5%)</span>
                  <span className="font-bold text-neutral-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-900 font-extrabold border-t border-white/50 pt-2 mt-1">
                  <span>{t.total}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button Trigger */}
              <button
                id="drawer-checkout-btn"
                onClick={() => onCheckout(appliedCoupon, totalDiscount)}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-650 hover:to-rose-650 active:scale-98 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl shadow-orange-500/10 transition-all cursor-pointer"
              >
                <span>{t.checkout}</span>
                <ArrowRight className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
