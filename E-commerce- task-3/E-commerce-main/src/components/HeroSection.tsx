import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { TRANSLATIONS } from "../data/translations";

interface HeroSectionProps {
  language: "en" | "te";
  onShopNow: (category?: string) => void;
}

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    enTitle: "Elevate Your Smart Lifestyle",
    teTitle: "మీ స్మార్ట్ జీవనశైలిని మెరుగుపరచండి",
    enDesc: "Discover handpicked premium electronics, wearables, and Gateron mechanical keyboards with up to 30% savings today.",
    teDesc: "30% వరకు ప్రత్యేక తగ్గింపులతో అత్యాధునిక ఎలక్ట్రానిక్స్, స్మార్ట్ వాచ్‌లు మరియు కీబోర్డులను ఇప్పుడే పొందండి.",
    category: "Electronics & Gadgets",
    badge: "Limited Offer",
    badgeTe: "పరిమిత ఆఫర్",
    buttonTextEn: "Discover Electronics",
    buttonTextTe: "గ్యాడ్జెట్లను చూడండి"
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80",
    enTitle: "Crafted Autumn Wear & Jackets",
    teTitle: "క్లాసిక్ దుస్తులు & అల్ట్రా లెదర్ జాకెట్స్",
    enDesc: "High fidelity genuine leather details, active cycling safety caps, and comfortable warm-knit athletic layers.",
    teDesc: "అసలైన లెదర్ జాకెట్లు, యాక్టివ్ సైక్లింగ్ హెల్మెట్లు మరియు అత్యంత సౌకర్యవంతమైన ఫ్యాషన్ దుస్తులు మీ కోసం.",
    category: "Fashion & Apparel",
    badge: "Pure Leather",
    badgeTe: "స్వచ్ఛమైన లెదర్",
    buttonTextEn: "Shop Apparel",
    buttonTextTe: "దుస్తులను ఎంచుకోండి"
  },
  {
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80",
    enTitle: "Aesthetic Living & Slow Coffee Rooms",
    teTitle: "అందమైన గృహోపకరణాలు & నెమ్మదైన ఉదయం కాఫీ",
    enDesc: "Handwoven picnic baskets, natural beeswax finished American walnut organizers, and matte ceramic dripping filters.",
    teDesc: "చేతితో అల్లిన వెదురు బుట్టలు, అమెరికన్ వాల్నట్ డెస్క్ ఆర్గనైజర్లు మరియు సిరామిక్ కాఫీ సెట్లతో మీ పరిసరాలను అలంకరించండి.",
    category: "Home & Living",
    badge: "Original Crafts",
    badgeTe: "మన్నికైన హస్తకళలు",
    buttonTextEn: "Explore Living Decor",
    buttonTextTe: "ఇంటి డెకర్ చూడండి"
  }
];

export default function HeroSection({ language, onShopNow }: HeroSectionProps) {
  const [index, setIndex] = useState(0);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const currentSlide = SLIDES[index];

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden glass-card border border-white/60 bg-white/20 shadow-xl">
      {/* Background Image carousel */}
      <div className="absolute inset-0 select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlide.image})` }}
          />
        </AnimatePresence>
        {/* Elegant overlay gradients for superior contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-950 to-transparent" />
      </div>

      {/* Content wrapper */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 text-white z-10 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Tagline / Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-400/20 to-rose-400/20 border border-orange-400/30 text-orange-350 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-spin duration-[4s]" />
              <span>{language === "en" ? currentSlide.badge : currentSlide.badgeTe}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white bg-gradient-to-r from-white via-neutral-100 to-white bg-clip-text">
              {language === "en" ? currentSlide.enTitle : currentSlide.teTitle}
            </h1>

            {/* Slide Description */}
            <p className="text-sm sm:text-base text-gray-200 max-w-lg leading-relaxed font-semibold">
              {language === "en" ? currentSlide.enDesc : currentSlide.teDesc}
            </p>

            {/* Call to action button */}
            <div className="pt-2 flex items-center gap-4">
              <button
                id={`hero-cta-btn-${index}`}
                onClick={() => onShopNow(currentSlide.category)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 active:scale-95 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer hover:shadow-orange-500/35"
              >
                <span>{language === "en" ? currentSlide.buttonTextEn : currentSlide.buttonTextTe}</span>
                <ArrowRight className="w-4 h-4 animate-bounce" />
              </button>
              <button
                id="hero-bazaar-btn"
                onClick={() => onShopNow()}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl border border-white/40 backdrop-blur-md transition-all cursor-pointer shadow-3xs hover:scale-102 active:scale-98 animate-pulse"
              >
                {t.backToHome}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <div className="absolute right-6 bottom-6 z-20 flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white border border-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white border border-white/10 transition-all cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Slide indicators */}
      <div className="absolute left-6 bottom-6 z-20 flex items-center gap-1.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              idx === index ? "w-6 bg-orange-500" : "w-1.5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
