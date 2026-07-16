export interface TranslationSet {
  appName: string;
  tagline: string;
  searchPlaceholder: string;
  cart: string;
  wishlist: string;
  categories: string;
  bestSeller: string;
  newArrival: string;
  discount: string;
  addToCart: string;
  added: string;
  items: string;
  emptyCart: string;
  total: string;
  subtotal: string;
  shipping: string;
  tax: string;
  checkout: string;
  ratings: string;
  reviews: string;
  stock: string;
  inStock: string;
  outOfStock: string;
  buyNow: string;
  orders: string;
  shippingDetails: string;
  payment: string;
  placeOrder: string;
  successTitle: string;
  successDesc: string;
  backToHome: string;
  viewDetails: string;
  filterAll: string;
  orderHistory: string;
  orderNumber: string;
  status: string;
  processing: string;
  shipped: string;
  delivered: string;
  noOrders: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  featuresTitle: string;
  allCategories: string;
  freeShippingAlert: string;
}

export const TRANSLATIONS: Record<"en" | "te", TranslationSet> = {
  en: {
    appName: "Spire Bazaar",
    tagline: "Your Ultimate Modern Shopping Destination",
    searchPlaceholder: "Search for premium products...",
    cart: "Shopping Cart",
    wishlist: "My Wishlist",
    categories: "Categories",
    bestSeller: "Best Seller",
    newArrival: "New Arrival",
    discount: "Discount",
    addToCart: "Add to Cart",
    added: "Added to Cart",
    items: "items",
    emptyCart: "Your cart is empty",
    total: "Total Amount",
    subtotal: "Subtotal",
    shipping: "Shipping Fee",
    tax: "Estimated Tax",
    checkout: "Proceed to Checkout",
    ratings: "Rating",
    reviews: "reviews",
    stock: "Stock Available",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    buyNow: "Buy Now",
    orders: "Track Orders",
    shippingDetails: "Shipping Address Details",
    payment: "Simulated Payment Method",
    placeOrder: "Confirm & Place Order",
    successTitle: "Order Confirmed!",
    successDesc: "Thank you for shopping at Spire Bazaar. Your order has been registered and is being processed.",
    backToHome: "Return to Shopping",
    viewDetails: "Quick View",
    filterAll: "All Categories",
    orderHistory: "Order History",
    orderNumber: "Order ID",
    status: "Status",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    noOrders: "No orders found. Start shopping to create history!",
    fullName: "Full Name",
    email: "Email Address",
    phone: "Mobile Number",
    address: "Street Address",
    city: "City",
    state: "State",
    zip: "Zip Code",
    featuresTitle: "Key Specifications & Features",
    allCategories: "All Products",
    freeShippingAlert: "🎉 Free shipping on all orders above $50.00!"
  },
  te: {
    appName: "స్పైర్ బజార్",
    tagline: "మీ ఆధునిక షాపింగ్ గమ్యస్థానం",
    searchPlaceholder: "ప్రీమియం వస్తువుల కోసం వెతకండి...",
    cart: "షాపింగ్ కార్ట్",
    wishlist: "నా కోరికల జాబితా",
    categories: "రకాలు",
    bestSeller: "బెస్ట్ సెల్లర్",
    newArrival: "కొత్త వస్తువు",
    discount: "ప్రత్యేక తగ్గింపు",
    addToCart: "కార్ట్‌కి చేర్చు",
    added: "చేర్చబడింది",
    items: "వస్తువులు",
    emptyCart: "మీ కార్ట్ ఖాళీగా ఉంది",
    total: "మొత్తం ధర",
    subtotal: "సబ్‌టోటల్",
    shipping: "షిప్పింగ్ ఛార్జీ",
    tax: "పన్ను",
    checkout: "చెక్అవుట్‌కి వెళ్ళండి",
    ratings: "రేటింగ్",
    reviews: "సమీక్షలు",
    stock: "అందుబాటులో ఉన్న నిల్వ",
    inStock: "లభ్యత ఉంది",
    outOfStock: "లభ్యత లేదు",
    buyNow: "వెంటనే కొనండి",
    orders: "ఆర్డర్లను ట్రాక్ చేయండి",
    shippingDetails: "షిప్పింగ్ చిరునామా వివరాలు",
    payment: "పేమెంట్ విధానం (సిమ్యులేటెడ్)",
    placeOrder: "ఆర్డర్ ఖరారు చేయండి",
    successTitle: "ఆర్డర్ విజయవంతంగా పూర్తయింది!",
    successDesc: "స్పైర్ బజార్‌లో షాపింగ్ చేసినందుకు ధన్యవాదాలు. మీ ఆర్డర్ నమోదు చేయబడింది మరియు ప్రాసెస్ చేయబడుతోంది.",
    backToHome: "తిరిగి షాపింగ్‌కి వెళ్ళండి",
    viewDetails: "వివరాలు చూడు",
    filterAll: "అన్ని రకాలు",
    orderHistory: "గత ఆర్డర్లు",
    orderNumber: "ఆర్డర్ నంబర్",
    status: "స్థితి",
    processing: "ప్రాసెసింగ్ లో ఉంది",
    shipped: "షిప్పింగ్ చేయబడింది",
    delivered: "డెలివరీ చేయబడింది",
    noOrders: "ఎలాంటి ఆర్డర్లు లేవు. మీ షాపింగ్ ఇప్పుడే ప్రారంభించండి!",
    fullName: "పూర్తి పేరు",
    email: "ఈమెయిల్ చిరునామా",
    phone: "మొబైల్ నంబర్",
    address: "ఇంటి నంబర్ & వీధి",
    city: "నగరం",
    state: "రాష్ట్రం",
    zip: "పిన్ కోడ్",
    featuresTitle: "ఉత్పత్తి ముఖ్యమైన ఫీచర్లు",
    allCategories: "అన్ని వస్తువులు",
    freeShippingAlert: "🎉 $50.00 పైన కొనుగోలుపై ఉచిత షిప్పింగ్ లభిస్తుంది!"
  }
};
