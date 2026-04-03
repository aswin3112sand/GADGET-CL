import HeroSection from '../components/HeroSection';
import FeaturedCategories from '../components/FeaturedCategories';
import BestSellers from '../components/BestSellers';
import FlashDeals from '../components/FlashDeals';
import CategoryShowcase from '../components/CategoryShowcase';
import WhyChooseUs from '../components/WhyChooseUs';
import Reviews from '../components/Reviews';
import CTASection from '../components/CTASection';
import { categoryConfig } from '../utils/categoryConfig';
import { getCategoryProducts } from '../data/mockData';

const catProducts = getCategoryProducts();

const HomePage = ({ addToCart }) => (
  <main>
    <HeroSection />
    <FeaturedCategories />
    <BestSellers addToCart={addToCart} />

    {categoryConfig.slice(0, 4).map(config => (
      <CategoryShowcase
        key={config.id}
        config={config}
        products={catProducts[config.name] || []}
        addToCart={addToCart}
      />
    ))}

    <FlashDeals />

    {categoryConfig.slice(4).map(config => (
      <CategoryShowcase
        key={config.id}
        config={config}
        products={catProducts[config.name] || []}
        addToCart={addToCart}
      />
    ))}

    <WhyChooseUs />
    <Reviews />
    <CTASection />
  </main>
);

export default HomePage;
