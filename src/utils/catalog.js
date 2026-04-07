import {
  Camera,
  Gamepad2,
  Headphones,
  Home,
  Laptop,
  Package2,
  Plug,
  Smartphone,
  Watch,
} from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80';

const sectionVisualMap = {
  'mobile phones': {
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80',
    description: 'Flagship and everyday phones curated for performance, design, and long-term value.',
  },
  'smart watches': {
    icon: Watch,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
    description: 'Connected wearables for fitness, notifications, and premium daily convenience.',
  },
  earbuds: {
    icon: Headphones,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80',
    description: 'Wireless audio products tuned for calls, music, travel, and clean desk setups.',
  },
  laptops: {
    icon: Laptop,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=80',
    description: 'Portable machines for creators, office workflows, coding, and performance-heavy tasks.',
  },
  accessories: {
    icon: Plug,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&q=80',
    description: 'Charging, connectivity, and desk essentials that complete the primary device experience.',
  },
  'gaming gadgets': {
    icon: Gamepad2,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&q=80',
    description: 'Low-latency accessories and gaming hardware chosen for immersion and reliability.',
  },
  'smart home': {
    icon: Home,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900&q=80',
    description: 'Home automation products that make lighting, safety, and control feel effortless.',
  },
  cameras: {
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=900&q=80',
    description: 'Capture-focused devices for creators, hobbyists, and professionals who care about detail.',
  },
};

export const slugifySectionName = (value = '') => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

export const getSectionVisual = (sectionName) => {
  const match = sectionVisualMap[sectionName?.toLowerCase()] || {};
  return {
    icon: match.icon || Package2,
    image: match.image || DEFAULT_IMAGE,
    description: match.description || 'Explore the latest additions in this curated product section.',
    slug: slugifySectionName(sectionName),
  };
};

export const enrichSections = (sections, products = []) => sections.map((section) => {
  const visuals = getSectionVisual(section.name);
  const count = products.filter((product) => product.sectionId === section.id).length;
  return {
    ...section,
    ...visuals,
    count,
  };
});
