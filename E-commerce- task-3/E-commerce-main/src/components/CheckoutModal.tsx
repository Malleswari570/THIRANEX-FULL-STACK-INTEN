import { useState } from "react";
import { X, Check, CreditCard, ShieldCheck, Landmark, CheckCircle, Smartphone } from "lucide-react";
import { CartItem, ShippingAddress } from "../types";
import { TRANSLATIONS } from "../data/translations";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "te";
  cartItems: CartItem[];
  appliedCoupon: string;
  discountValue: number;
  onPlaceOrder: (address: ShippingAddress, paymentMethod: string, orderId: string) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  language,
  cartItems,
  appliedCoupon,
  discountValue,
  onPlaceOrder,
}: CheckoutModalProps) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [paymentMethod, setPaymentMethod] = useState("Credit / Debit Card");
  
  // Credit Card state
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• ••••");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("MM/YY");
  const [cardCvv, setCardCvv] = useState("");

  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const formattedSubtotal = subtotal - discountValue;
  const shippingFee = formattedSubtotal >= 50 || formattedSubtotal === 0 ? 0 : 5.99;
  const tax = formattedSubtotal * 0.085;
  const total = formattedSubtotal + shippingFee + tax;

  const handleValidateShipping = () => {
    const errors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!address.fullName.trim()) errors.fullName = "Full name is required";
    if (!address.streetAddress.trim()) errors.streetAddress = "Street address is required";
    if (!address.city.trim()) errors.city = "City is required";
    if (!address.state.trim()) errors.state = "State is required";
    if (!address.zipCode.trim()) errors.zipCode = "Zip code is required";
    
    // Check Email format
    if (!address.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(address.email)) {
      errors.email = "Invalid email format";
    }

    // Check Phone format
    if (!address.phone.trim()) {
      errors.phone = "Mobile number is required";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setStep(2);
    }
  };

  const handleCompletePayment = () => {
    const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    onPlaceOrder(address, paymentMethod, generatedOrderId);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-950/45 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />

      {/* Checkout Box Container */}
      <div className="relative glass-panel bg-white/75 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full z-10 border border-white/60 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header (hidden on completion) */}
        {step < 3 && (
          <div className="px-6 py-5 border-b border-white/40 flex items-center justify-between bg-white/30">
            <h2 className="text-lg font-extrabold text-neutral-900 tracking-tight">{t.checkout}</h2>
            <button
              id="close-checkout-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/60 text-neutral-500 hover:text-neutral-900 border border-transparent hover:border-white/40 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step Indicators */}
        {step < 3 && (
          <div className="px-6 pt-6 flex items-center justify-center gap-1.5 text-xs text-neutral-400 font-medium">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? "text-orange-600 font-semibold" : ""}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                step > 1 ? "bg-orange-600 border-orange-600 text-white" : "border-orange-600"
              }`}>
                {step > 1 ? <Check className="w-3 h-3" /> : "1"}
              </span>
              <span>1. Shipping</span>
            </div>
            <div className="h-[1px] w-12 bg-gray-200" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? "text-orange-600 font-semibold" : ""}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                step >= 2 ? "border-orange-600 text-orange-600" : "border-gray-200"
              }`}>
                2
              </span>
              <span>2. Payment</span>
            </div>
          </div>
        )}

        {/* Body content based on step */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 border-b border-gray-100 pb-2 flex items-center gap-1.5">
                <span>{t.shippingDetails}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">{t.fullName}</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 outline-hidden"
                  />
                  {formErrors.fullName && <p className="text-[10px] text-red-500">{formErrors.fullName}</p>}
                </div>

                {/* Email address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">{t.email}</label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 outline-hidden"
                  />
                  {formErrors.email && <p className="text-[10px] text-red-500">{formErrors.email}</p>}
                </div>

                {/* Mobile number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">{t.phone}</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 outline-hidden"
                  />
                  {formErrors.phone && <p className="text-[10px] text-red-500">{formErrors.phone}</p>}
                </div>

                {/* Street address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-700">{t.address}</label>
                  <input
                    type="text"
                    required
                    value={address.streetAddress}
                    onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 outline-hidden"
                  />
                  {formErrors.streetAddress && <p className="text-[10px] text-red-500">{formErrors.streetAddress}</p>}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">{t.city}</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 outline-hidden"
                  />
                  {formErrors.city && <p className="text-[10px] text-red-500">{formErrors.city}</p>}
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">{t.state}</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 outline-hidden"
                  />
                  {formErrors.state && <p className="text-[10px] text-red-500">{formErrors.state}</p>}
                </div>

                {/* Zip */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">{t.zip}</label>
                  <input
                    type="text"
                    required
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 outline-hidden"
                  />
                  {formErrors.zipCode && <p className="text-[10px] text-red-500">{formErrors.zipCode}</p>}
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-4 flex justify-end">
                <button
                  id="checkout-next-btn"
                  onClick={handleValidateShipping}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Continue to Payment & Review
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-neutral-900 border-b border-gray-100 pb-2">
                {t.payment}
              </h3>

              {/* Selection cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "Credit / Debit Card", label: "Card", icon: CreditCard },
                  { id: "UPI (Paytm, GPay)", label: "UPI", icon: Smartphone },
                  { id: "Net Banking", label: "Bank", icon: Landmark }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id)}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                        paymentMethod === item.id
                          ? "bg-orange-50 border-orange-500 text-orange-600 font-bold"
                          : "bg-white border-gray-250 text-neutral-500 hover:bg-neutral-50"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Credit Card Widget */}
              {paymentMethod === "Credit / Debit Card" && (
                <div className="space-y-4">
                  {/* Neon virtual card preview */}
                  <div className="relative w-full h-[180px] bg-gradient-to-tr from-orange-600 via-rose-600 to-amber-500 rounded-2xl p-6 text-white shadow-xl overflow-hidden flex flex-col justify-between">
                    <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
                    
                    <div className="flex items-center justify-between z-10">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold tracking-widest text-orange-100 uppercase">Spire Card</span>
                        <div className="h-6.5 w-9 bg-yellow-400/20 rounded-md border border-yellow-500/25 mt-1" />
                      </div>
                      <CreditCard className="w-8 h-8 opacity-90" />
                    </div>

                    <div className="space-y-3 z-10">
                      {/* Card Number */}
                      <span className="text-base sm:text-lg font-mono tracking-widest text-center block">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </span>
                      
                      {/* Holder, Expiry */}
                      <div className="flex justify-between items-center text-[10px] font-mono whitespace-nowrap">
                        <div className="truncate max-w-[180px]">
                          <p className="text-[8px] opacity-75 leading-none">CARD HOLDER</p>
                          <p className="font-bold tracking-wide uppercase mt-0.5">{cardHolder || "NAME"}</p>
                        </div>
                        <div>
                          <p className="text-[8px] opacity-75 leading-none">EXPIRES</p>
                          <p className="font-bold mt-0.5">{cardExpiry || "MM/YY"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Card Details */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-neutral-700">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="1234 5678 1234 5678"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                          setCardNumber(val);
                        }}
                        className="w-full px-3 py-2 bg-neutral-50 border border-gray-200 rounded-xl text-xs outline-hidden"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-neutral-700">Card Holder</label>
                      <input
                        type="text"
                        maxLength={22}
                        placeholder="John Doe"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-gray-200 rounded-xl text-xs outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-700">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-gray-200 rounded-xl text-xs outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing breakdown summary */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discountValue > 0 && (
                  <div className="flex justify-between text-xs text-orange-600">
                    <span>Discount ({appliedCoupon}):</span>
                    <span className="font-semibold">-${discountValue.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Shipping:</span>
                  <span className="font-semibold">{shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Estimated Tax (8.5%):</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-900 border-t border-gray-200 pt-2 font-bold mt-1">
                  <span>Total Due:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between gap-3">
                <button
                  id="checkout-back-btn"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 border border-gray-200 hover:bg-neutral-50 text-neutral-600 rounded-xl text-xs font-semibold"
                >
                  Back to Shipping
                </button>
                <button
                  id="checkout-complete-btn"
                  onClick={handleCompletePayment}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md cursor-pointer"
                >
                  {t.placeOrder}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 text-center flex flex-col items-center justify-center space-y-6">
              <div className="w-18 h-18 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                  {t.successTitle}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto font-sans leading-relaxed">
                  {t.successDesc}
                </p>
              </div>

              {/* Order stats indicator info */}
              <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl space-y-2 text-xs text-neutral-700 min-w-[280px]">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-500">Order ID:</span>
                  <span className="font-bold font-mono text-neutral-900">
                    ORD-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-500">{t.total}:</span>
                  <span className="font-bold text-neutral-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-500">Status:</span>
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Confirmed
                  </span>
                </div>
              </div>

              <button
                id="checkout-success-btn"
                onClick={onClose}
                className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
              >
                {t.backToHome}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
