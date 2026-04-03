// ============================================================
// NEXUS GADGETS — FULL MOCK DATA (400 PRODUCTS, 8 CATEGORIES)
// ============================================================

const generateProducts = (category, prefix, brands, baseFeatures) => {
  return Array.from({ length: 50 }, (_, i) => {
    const id = i + 1;
    const brand = brands[i % brands.length];
    const price = Math.round((Math.random() * 80000 + 5000) / 100) * 100;
    const discount = [10, 15, 20, 25, 30, 35, 40][i % 7];
    const offerPrice = Math.round((price * (1 - discount / 100)) / 100) * 100;
    const rating = parseFloat((3.8 + Math.random() * 1.2).toFixed(1));
    const ratingCount = Math.floor(Math.random() * 8000 + 200);

    const badges = ['HOT', 'NEW', 'SALE', 'TOP', 'LIMITED', null, null];
    const images = [
      `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80`,
      `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`,
      `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80`,
      `https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80`,
      `https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80`,
      `https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80`,
      `https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80`,
      `https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80`,
    ];

    const names = [
      `${prefix} Pro ${id}`, `${prefix} Ultra X${id}`, `${prefix} Max ${id}`,
      `${prefix} Elite ${id}`, `${prefix} Neo ${id}S`, `${prefix} Air ${id}`,
      `${prefix} Titan ${id}`, `${prefix} Apex ${id}`, `${prefix} Nova ${id}X`,
      `${prefix} Pulse ${id}`,
    ];

    return {
      id:              `${category.toLowerCase().replace(/ /g, '-')}-${id}`,
      name:            names[i % names.length],
      category,
      brand,
      shortDescription: baseFeatures[i % baseFeatures.length],
      price,
      offerPrice,
      discount,
      rating,
      ratingCount,
      image:           images[i % images.length],
      badge:           badges[i % badges.length],
      isFeatured:      i < 8,
      isTrending:      [2,5,8,11,14,17,20].includes(i),
      colors:          ['#1a1a2e', '#2d1b69', '#0f3460'][i % 3],
      inStock:         i % 10 !== 9,
    };
  });
};

// ─── MOBILE PHONES ───────────────────────────────────────────
export const mobilePhones = generateProducts(
  'Mobile Phones', 'Nova',
  ['Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'Realme', 'POCO', 'iQOO', 'Motorola'],
  [
    '6.7" AMOLED 144Hz · 108MP · 5000mAh',
    '6.1" Super Retina XDR · A16 · 12MP',
    '6.8" Fluid AMOLED · Snapdragon 8 Gen 3',
    '6.67" OLED · 50MP Leica · 4600mAh',
    '6.4" SuperAMOLED · 64MP · 33W Charge',
    '6.72" IPS LCD · 200MP · 120Hz',
    '6.56" AMOLED · 120Hz · 5000mAh',
    '6.5" P-OLED · 50MP · Dimensity 9300',
  ]
);

// ─── SMART WATCHES ───────────────────────────────────────────
export const smartWatches = generateProducts(
  'Smart Watches', 'Pulse',
  ['Apple', 'Samsung', 'Garmin', 'Noise', 'boAt', 'Amazfit', 'Fossil', 'Fitbit'],
  [
    'Always-On Display · GPS · Health Suite',
    'AMOLED 1.96" · 100+ Sport Modes',
    '1.45" Super AMOLED · Blood Oxygen Tracker',
    'Titanium Build · Sleep & Stress Monitor',
    'Rotary Crown · SpO2 · 14-day Battery',
    '1.3" OLED · BT Calls · IP68 Water Resist',
    '400mAh · PAI Health Assessment',
    'LTPO Display · 18-day Battery Life',
  ]
);

// ─── EARBUDS ─────────────────────────────────────────────────
export const earbuds = generateProducts(
  'Earbuds', 'SonicBuds',
  ['Sony', 'Samsung', 'JBL', 'boAt', 'Noise', 'Jabra', 'Nothing', 'Apple'],
  [
    '42dB ANC · LDAC · 30hr Battery',
    'TWS · 11mm Driver · 6hr Playtime',
    'Hi-Res Audio · EQ Customization',
    'Active Noise Cancelling · IPX4',
    'Adaptive ANC · Spatial Audio',
    '6-mic Clear Voice · ANC · IP57',
    'Custom Drivers · Transparent Mode',
    'H2 Chip · Personalized Spatial Audio',
  ]
);

// ─── LAPTOPS ─────────────────────────────────────────────────
export const laptops = generateProducts(
  'Laptops', 'TitanBook',
  ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Razer'],
  [
    'M3 Pro · 18GB RAM · 512GB SSD',
    '13th Gen i7 · RTX 4060 · 16GB',
    'Ryzen 9 7945HX · 32GB · 1TB NVMe',
    '4K OLED · Core Ultra 9 · 2TB',
    'Snapdragon X Elite · 32GB · 1TB',
    '14" WUXGA · i5-13th · 16GB',
    'RTX 4090 · i9-14900HX · 32GB',
    '18" QHD+ · 240Hz · 64GB DDR5',
  ]
);

// ─── ACCESSORIES ─────────────────────────────────────────────
export const accessories = generateProducts(
  'Accessories', 'HyperDock',
  ['Anker', 'Belkin', 'Logitech', 'Razer', 'SteelSeries', 'Satechi', 'UGREEN', 'ESR'],
  [
    'USB-C Hub 12-in-1 · 100W PD · 4K HDMI',
    'MagSafe 15W · Qi2 Certified',
    'Mechanical Switch · RGB Backlit',
    'Ergonomic Wireless · 4000 DPI',
    'Braided Cable 240W · 2m Length',
    'Laptop Stand · Aluminum Alloy',
    '20000mAh · 65W GaN · 3-Port',
    'Screen Protector · 9H Tempered',
  ]
);

// ─── GAMING GADGETS ──────────────────────────────────────────
export const gamingGadgets = generateProducts(
  'Gaming Gadgets', 'GameCore',
  ['Razer', 'SteelSeries', 'Logitech', 'HyperX', 'Corsair', 'ASUS ROG', 'MSI', 'Turtle Beach'],
  [
    'Wireless Controller · 40hr · Haptic',
    'Mechanical RGB Keyboard · TKL',
    '360Hz IPS Monitor · 0.5ms GTG',
    '7.1 Surround · ANC Headset',
    '16000 DPI Optical · 6-Zone RGB',
    'Capture Card 4K60 · HDR Pass',
    'Racing Wheel · Force Feedback',
    'Streaming Mic · Cardioid · USB-C',
  ]
);

// ─── SMART HOME DEVICES ──────────────────────────────────────
export const smartHome = generateProducts(
  'Smart Home', 'SmartNest',
  ['Philips Hue', 'Amazon', 'Google', 'Mi', 'TP-Link', 'Arlo', 'Ring', 'Nest'],
  [
    'Smart Bulb · 16M Colors · Matter',
    'Voice Assistant · 360° Sound',
    'Smart Plug · Energy Monitor · App',
    'Video Doorbell · 2K · Night Vision',
    'Robot Vacuum · LiDAR · 5200mAh',
    'Smart Lock · Fingerprint · Alexa',
    'Mesh Wi-Fi · 6E · 7200 Mbps',
    'Smart Thermostat · AI Scheduling',
  ]
);

// ─── CAMERAS / TECH DEVICES ──────────────────────────────────
export const cameras = generateProducts(
  'Cameras', 'VisionCam',
  ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'GoPro', 'DJI', 'Panasonic', 'Olympus'],
  [
    '61MP Full-Frame · 4K120 · IBIS',
    '45MP CMOS · Dual Pixel AF · 8K',
    '24.5MP · 120fps · Eye Tracking AF',
    'X-Trans 5 · 40MP · Film Simulation',
    'HERO12 · 5.3K60 · HyperSmooth 6',
    'DJI Action 4 · 4K120 · Horizon Lock',
    'L-Mount · 6K · Phase Hybrid AF',
    'MFT · 10-bit · 5-Axis Stabilization',
  ]
);

// ─── COMBINED ALL PRODUCTS ────────────────────────────────────
export const allProducts = [
  ...mobilePhones,
  ...smartWatches,
  ...earbuds,
  ...laptops,
  ...accessories,
  ...gamingGadgets,
  ...smartHome,
  ...cameras,
];

export const featuredProducts = allProducts.filter(p => p.isFeatured);
export const trendingProducts = allProducts.filter(p => p.isTrending);

export const getProductsByCategory = (category) =>
  allProducts.filter(p => p.category === category);

export const getProductById = (id) =>
  allProducts.find(p => p.id === id);

export const getCategoryProducts = () => ({
  'Mobile Phones':       mobilePhones,
  'Smart Watches':       smartWatches,
  'Earbuds':             earbuds,
  'Laptops':             laptops,
  'Accessories':         accessories,
  'Gaming Gadgets':      gamingGadgets,
  'Smart Home':          smartHome,
  'Cameras':             cameras,
});

// ─── REVIEWS ─────────────────────────────────────────────────
export const reviews = [
  { id: 1, name: 'Arjun Mehta',    avatar: 'AM', rating: 5, review: 'Absolutely premium experience! The Nova X Pro 5G is insanely fast and the display is cinema-grade. NEXUS packaging alone felt like unboxing a luxury product.', product: 'Nova Pro 5', verified: true,  date: '2 days ago' },
  { id: 2, name: 'Priya Sharma',   avatar: 'PS', rating: 5, review: 'SonicBuds Air Max is genuinely the best ANC experience I have had. Comparable to Sony XM5 but at a fraction of the cost. 10/10 would buy again.', product: 'SonicBuds Air Max', verified: true, date: '5 days ago' },
  { id: 3, name: 'Rahul Dev',      avatar: 'RD', rating: 4, review: 'TitanBook X14 laptop handles everything — video editing in DaVinci, gaming, coding. The OLED panel is gorgeous. Shipping was super fast too.', product: 'TitanBook X14', verified: true,  date: '1 week ago' },
  { id: 4, name: 'Kavya Nair',     avatar: 'KN', rating: 5, review: 'Pulse Ultra watch is like wearing a piece of the future. Health tracking is accurate, build quality is titanium-grade. NEXUS customer support is stellar.', product: 'Pulse Ultra', verified: true, date: '1 week ago' },
  { id: 5, name: 'Vikram Singh',   avatar: 'VS', rating: 5, review: 'GameCore RGB Controller has zero latency. Played 6 hours straight and battery was still at 60%. The haptic feedback is incredible.', product: 'GameCore RGB', verified: true,  date: '2 weeks ago' },
  { id: 6, name: 'Ananya Iyer',    avatar: 'AI', rating: 4, review: 'VisionCam 4K Pro captures colors like a dream. I am a wedding photographer and this has replaced my old DSLR entirely. Worth every rupee.', product: 'VisionCam Pro', verified: true, date: '3 weeks ago' },
  { id: 7, name: 'Rohit Kumar',    avatar: 'RK', rating: 5, review: 'SmartNest Hub turned my apartment into a smart home in under an hour. Everything connected perfectly. Alexa and Google both work seamlessly.', product: 'SmartNest Hub', verified: true,  date: '1 month ago' },
  { id: 8, name: 'Sneha Reddy',    avatar: 'SR', rating: 5, review: 'Ordered the HyperDock USB Hub and it arrived in 2 days. Works flawlessly with my MacBook. 4K output, 100W PD charging — absolutely love it.', product: 'HyperDock Pro', verified: true,  date: '1 month ago' },
];

export default allProducts;
