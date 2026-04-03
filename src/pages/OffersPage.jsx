import FlashDeals from '../components/FlashDeals';
import SectionHeader from '../components/SectionHeader';

const OffersPage = () => (
  <main className="min-h-screen bg-dark-400 pt-24">
    <section className="section-padding pb-0">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Best Deals"
          title="All"
          highlight="Offers"
          subtitle="The hottest deals and biggest discounts — updated daily."
        />
      </div>
    </section>
    <FlashDeals />
  </main>
);

export default OffersPage;
