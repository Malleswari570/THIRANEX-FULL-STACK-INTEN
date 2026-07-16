import { Product } from "../types";

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Classic Leather Jacket",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviewCount: 142,
    category: "Fashion & Apparel",
    description: "Premium handcrafted full-grain leather jacket. Designed with durability and timeless style in mind, it features asymmetric zipper closure, multiple secure pockets, and a soft quilted inner lining.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80",
    stock: 12,
    features: [
      "100% Genuine Full-Grain Leather",
      "Sturdy metal YKK zippers",
      "Quilted polyester inner lining",
      "Two zippered hand pockets and two interior chest pockets"
    ],
    tag: "Best Seller"
  },
  {
    id: "prod-2",
    name: "Wireless ANC QuietBuds Pro",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.9,
    reviewCount: 384,
    category: "Electronics & Gadgets",
    description: "Industry-leading active noise cancelling (ANC) wireless earbuds. Delivering immersive, studio-grade high-fidelity audio, a lightweight ergonomic secure fit, and up to 40 hours of combined playtime with the smart wireless charging box.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
    stock: 25,
    features: [
      "Hybrid Active Noise Cancellation (up to 40dB)",
      "High-Res Audio support with LDAC codec",
      "IPX5 sweat and water resistance",
      "Smart touch controls & voice assistant support"
    ],
    tag: "Discount"
  },
  {
    id: "prod-3",
    name: "Minimalist Wooden Desk Organizer",
    price: 34.99,
    rating: 4.6,
    reviewCount: 95,
    category: "Home & Living",
    description: "Crafted from sustainable premium solid American walnut wood. This minimalist desk organizer holds your phone, workspace pens, sticky notes, and accessories neatly, giving your workspace a natural, high-end, uncluttered feel.",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&auto=format&fit=crop&q=80",
    stock: 18,
    features: [
      "Solid American Walnut construction",
      "Integrated smartphone dock with cord slot",
      "Non-slip micro-suction silicone grip pads",
      "Premium beeswax natural finish-coating"
    ]
  },
  {
    id: "prod-4",
    name: "Aesthetic Ceramic Coffee dripper Set",
    price: 45.00,
    originalPrice: 55.00,
    rating: 4.7,
    reviewCount: 112,
    category: "Home & Living",
    description: "Elegant matte-finish ceramic pour-over dripper with a thermal-resistant borosilicate glass server. Perfect for slow mornings, this set extracts maximum flavor oils, making aromatic barista-grade drip coffee at home in style.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80",
    stock: 8,
    features: [
      "Double-walled thermal insulation",
      "Thick premium food-grade matte ceramic",
      "Includes 600ml scale Borosilicate glass pitcher",
      "Ribbed interior wall pattern to optimize water flow dynamics"
    ],
    tag: "New Arrival"
  },
  {
    id: "prod-5",
    name: "Smart Fitness Running Watch",
    price: 199.00,
    rating: 4.5,
    reviewCount: 220,
    category: "Electronics & Gadgets",
    description: "Track your health metrics, steps, heart-rate, Sleep cycles, and outdoor workouts in real-time. Features a high-definition always-on AMOLED touchscreen, custom GPS routes tracker, and an incredible 14-day battery backup.",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=80",
    stock: 30,
    features: [
      "Always-On AMOLED high-contrast touch screen",
      "Dynamic SpO2 and continuous Heart-rate tracking",
      "Built-in multi-system tracking GPS",
      "5ATM water resistant (perfect for swimming)"
    ],
    tag: "Best Seller"
  },
  {
    id: "prod-6",
    name: "Ultralight Carbon Fiber Road Bike Helmet",
    price: 115.00,
    rating: 4.8,
    reviewCount: 78,
    category: "Fashion & Apparel",
    description: "Aerodynamic premium safety helmet designed for cycling enthusiasts. Reinforced with super-strong structural carbon fiber, featuring 21 micro-engineered vents for ventilation, and a dial-fit size adjustment knob.",
    image: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=500&auto=format&fit=crop&q=80",
    stock: 5,
    features: [
      "In-Mold Carbon Fiber structure integration",
      "21 high-flow thermodynamic air vents",
      "Premium moisture-wicking cool washable skull padding",
      "MIPS safety protection layer included"
    ]
  },
  {
    id: "prod-7",
    name: "Retro Style Mechanical Keyboard",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.9,
    reviewCount: 167,
    category: "Electronics & Gadgets",
    description: "Type with satisfying tactile response on sound-dampened mechanical Gateron Brown key switches. Embellished with keycaps styled after retro typewriters, custom dynamic warm white LED backlight patterns, and dual-mode connectivity.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    stock: 14,
    features: [
      "Warm-tactile Gateron Brown key switches",
      "Premium dual-shot retro convex keycaps",
      "Connects to 3 devices via Bluetooth or USB-C",
      "Compatible with macOS, iOS, Windows, and Android"
    ],
    tag: "New Arrival"
  },
  {
    id: "prod-8",
    name: "Fine Leather Duffle Weekend Bag",
    price: 175.00,
    rating: 4.7,
    reviewCount: 104,
    category: "Fashion & Apparel",
    description: "Made to withstand years of business flights or road trips. Features an expansive high-capacity compartment, distinct dedicated shoe drawer, solid brass hardware studs, and an adjustable, padded, heavy-duty leather shoulder strap.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    stock: 9,
    features: [
      "Handcrafted water-resistant vegetable tanned leather",
      "Spacious separated interior with shoe/laundry sleeve",
      "Heavy duty brass zippers and metal load hooks",
      "Conforms precisely to airline cabin carry-on regulations"
    ],
    tag: "Best Seller"
  },
  {
    id: "prod-9",
    name: "Professional Hand-Held Milk Frother",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.4,
    reviewCount: 150,
    category: "Home & Living",
    description: "Froth milk into premium creamy micro-foam in less than 30 seconds. Powered by a high-torque high-efficiency quiet motor, it is perfect for whipping lattes, cappuccinos, or whisking healthy matcha tea inside your cup.",
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&auto=format&fit=crop&q=80",
    stock: 45,
    features: [
      "High-speed motor spinning up to 19,000 RPM",
      "Whisper-quiet brushless operation",
      "Ergonomic matte soft-touch silicone grip handle",
      "Includes a heavy elegant countertop metal stand"
    ],
    tag: "Discount"
  },
  {
    id: "prod-10",
    name: "Sustainable bamboo fiber picnic basket set",
    price: 59.99,
    rating: 4.6,
    reviewCount: 64,
    category: "Home & Living",
    description: "Sustainably sourced, handcrafted natural flat-woven bamboo trunk. Equipped with fine leather-buckled straps holding high-grade plates, steel cutlery, wine glasses, and a thermal-insulated meal cooling bag inside.",
    image: "https://images.unsplash.com/photo-1592178044195-bfdc0bb753ce?w=500&auto=format&fit=crop&q=80",
    stock: 6,
    features: [
      "Handwoven structural premium bamboo",
      "Complete reusable dinnerware for 4 people",
      "Built-in large leakproof cooling compartment bag",
      "Lined with organic, vintage white checkered cotton"
    ]
  },
  {
    id: "prod-11",
    name: "The Art of Creative Design",
    price: 28.00,
    rating: 4.9,
    reviewCount: 204,
    category: "Books & Stationery",
    description: "A comprehensive hardcover exploration of historic architectural and graphic design patterns. Written by leading modern design visionaries, containing 240+ pages of high-resolution full-color imagery, grids, and layout rules.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=80",
    stock: 15,
    features: [
      "Beautiful linen-wrapped textured hardcover",
      "240 high-density satin pages",
      "Indepth essays on Swiss design, grids, and typography",
      "Makes a magnificent modern bookshelf display item"
    ],
    tag: "Best Seller"
  },
  {
    id: "prod-12",
    name: "Premium Brass Fountain Pen",
    price: 65.00,
    originalPrice: 79.99,
    rating: 4.8,
    reviewCount: 110,
    category: "Books & Stationery",
    description: "Weighty, executive fountain pen precision-machined from solid untreated raw brass. Develops a gorgeous, uniquely individual weathered rustic patina over time based on how you hold and use it daily.",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80",
    stock: 20,
    features: [
      "Precision CNC milled from raw alloy brass",
      "Polished medium-width stainless steel German nib",
      "Compatible with standard ink cartridges or piston converters",
      "Heavy, solid, satisfying weighted balance in hand"
    ]
  },
  {
    id: "prod-13",
    name: "A4 Dotted Grid Hardcover Notebook",
    price: 18.50,
    rating: 4.7,
    reviewCount: 330,
    category: "Books & Stationery",
    description: "The dream notebook for software developers, artists, and planners. Heavyweight 120gsm inkproof paper with subtle gray dot grids, expandable pocket flap, elastic closure band, and premium lay-flat stitch binding.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=80",
    stock: 50,
    features: [
      "A4 Size with dense 192 bleedproof 120gsm pages",
      "5mm precise space dot grid lining",
      "Stitched thread laying 180° perfectly flat binding",
      "Dual silk ribbon bookmark placeholders"
    ]
  },
  {
    id: "prod-14",
    name: "Unisex Fleece Pullover Hoodie",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.5,
    reviewCount: 240,
    category: "Fashion & Apparel",
    description: "Indulge in absolute cloud-like warmth with this ultra-soft cotton fleece hoodie. Ethically knit from heavy organic yarns, standard drop-shoulder modern shape, featuring deep front kangaroo pocket and reinforced ribbing.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80",
    stock: 15,
    features: [
      "80% Organic Ring-spun Cotton, 20% recycled polyester",
      "Chunky premium 380gsm brushed fleece",
      "Double-lined spacious athletic hood with drawstrings",
      "Shrink-resistant reactive color dyeing processing"
    ],
    tag: "Discount"
  },
  {
    id: "prod-15",
    name: "Artisanal Organic Green Tea Blend",
    price: 15.99,
    rating: 4.6,
    reviewCount: 88,
    category: "Daily Essentials",
    description: "Rare single-origin whole loose leaf green tea hand-picked in the misty high mountains of Kyoto. Carefully shade-grown, gently fire-steamed to seal healthy antioxidants, producing a crisp, umami-sweet, refreshing brew.",
    image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=500&auto=format&fit=crop&q=80",
    stock: 100,
    features: [
      "100g loose leaf premium Uji Sencha tea",
      "Rich in natural Catechins, L-Theanine, and antioxidants",
      "Resealable aluminum barrier moisture foil pack",
      "Sourced exclusively from zero-pesticide family farms"
    ],
    tag: "New Arrival"
  },
  {
    id: "prod-16",
    name: "Eco-Friendly Stainless Steel Water Flask",
    price: 24.50,
    rating: 4.7,
    reviewCount: 418,
    category: "Daily Essentials",
    description: "Ditch plastic forever. Double-walled vacuum insulated flask keeping iced shakes cold for 24 hours or herbal tea steaming hot for 12 hours. Sleek fingerprint-proof powder coating with real bamboo accent cap lid.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80",
    stock: 60,
    features: [
      "Double-walled 18/8 food-grade kitchen stainless steel",
      "TempLock vacuum tech - 100% condensation-free",
      "Leakproof cap inlaid with sustainable bamboo",
      "BPA-free, Phthalate-free, non-toxic powder finish"
    ]
  }
];

export const CATEGORIES = [
  "All Products",
  "Fashion & Apparel",
  "Electronics & Gadgets",
  "Home & Living",
  "Books & Stationery",
  "Daily Essentials",
];
