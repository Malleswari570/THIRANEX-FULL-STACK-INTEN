import { X, FileText, Calendar, ShieldCheck, MapPin, Truck } from "lucide-react";
import { Order } from "../types";
import { TRANSLATIONS } from "../data/translations";

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "te";
  orders: Order[];
}

export default function OrderHistory({
  isOpen,
  onClose,
  language,
  orders,
}: OrderHistoryProps) {
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-950/45 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Slidable Content Card Panel */}
        <div className="w-screen max-w-lg glass-panel bg-white/75 backdrop-blur-xl shadow-2xl flex flex-col h-full transform transition-all duration-350 animate-in slide-in-from-right relative border-l border-white/60">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/40 flex items-center justify-between bg-white/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-xs">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">{t.orderHistory}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 bg-white/60 rounded-full border border-white/40 text-neutral-800">
                {orders.length}
              </span>
            </div>
            <button
              id="close-order-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/60 text-neutral-500 hover:text-neutral-900 border border-transparent hover:border-white/40 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/40 border border-white/60 flex items-center justify-center text-orange-500 animate-pulse">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-neutral-800 tracking-tight">{t.noOrders}</h3>
                  <p className="text-xs text-neutral-500 max-w-[240px] mt-1 font-sans font-medium">
                    {language === "en" 
                      ? "Complete some simulated checkout flows to populate your shopping logs." 
                      : "షాపింగ్ చేసి, వస్తువులను కొనుగోలు చేయడం ద్వారా ఇక్కడ మీ ఆర్డర్ చరిత్రను చూడవచ్చు."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="glass-card border border-white/50 bg-white/45 hover:bg-white/60 transition-colors p-4.5 space-y-3.5 shadow-3xs rounded-2xl">
                    
                    {/* ID / Status / Date */}
                    <div className="flex justify-between items-start flex-wrap gap-2 text-xs">
                      <div>
                        <span className="font-extrabold text-neutral-900">{t.orderNumber}:</span>{" "}
                        <span className="font-mono text-neutral-600 font-bold">{order.id}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest bg-orange-100/70 border border-orange-200/40 text-orange-850 shadow-3xs`}>
                        {order.status === "Processing" ? t.processing : order.status === "Shipped" ? t.shipped : t.delivered}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-sans font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{order.date}</span>
                    </div>

                    {/* Bought Products */}
                    <div className="space-y-2 border-t border-b border-white/30 py-3">
                      {order.items.map((it) => (
                        <div key={it.product.id} className="flex justify-between items-center text-xs text-neutral-800 font-sans font-semibold">
                          <span className="truncate max-w-[220px]">
                            {it.product.name} <span className="text-neutral-400 font-normal">x{it.quantity}</span>
                          </span>
                          <span className="font-mono font-bold">${(it.product.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping address recap */}
                    <div className="space-y-1.5 text-[10px] text-neutral-500 font-sans font-semibold">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span className="truncate">{order.shippingAddress.fullName} &bull; {order.shippingAddress.streetAddress}, {order.shippingAddress.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3 h-3 text-neutral-400" />
                        <span>Payment: {order.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Total spent */}
                    <div className="flex justify-between items-center text-xs font-extrabold text-neutral-900 pt-1">
                      <span>{t.total}</span>
                      <span className="text-sm font-extrabold text-orange-655">${order.totalAmount.toFixed(2)}</span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
