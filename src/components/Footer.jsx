import { Link } from 'react-router-dom';
import { Github, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-white/10 bg-[#100b08] text-[#f8f3eb]">
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:px-16">
      <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr,0.9fr,0.9fr,1fr]">
        <div>
          <Link to="/" className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-300/24 bg-white/8 text-sm font-semibold text-brand-300">
              G
            </div>
            <div>
              <div className="font-display text-2xl tracking-[0.16em]">Gadget69</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/38">
                Curated electronics atelier
              </div>
            </div>
          </Link>

          <p className="max-w-md text-sm leading-relaxed text-white/56">
            A quieter premium-tech storefront shaped around curation, presentation, and
            service that feels considered from the first scroll to the final delivery.
          </p>

          <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-300">
              Concierge support
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/56">
              Need product advice, gifting help, or after-purchase support? We keep the
              experience just as polished after checkout.
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            {[Twitter, Instagram, Youtube, Github].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/56 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300/30 hover:text-brand-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
            Categories
          </h4>
          <ul className="space-y-3">
            {['Mobile Phones', 'Smart Watches', 'Earbuds', 'Laptops', 'Gaming', 'Smart Home'].map((item) => (
              <li key={item}>
                <Link to="/products" className="text-sm text-white/48 transition-colors hover:text-white">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
            Customer
          </h4>
          <ul className="space-y-3">
            {['My Orders', 'Track Order', 'Returns', 'Warranty', 'Reviews', 'Help Center'].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-white/48 transition-colors hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
            Contact
          </h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm text-white/48">
              <Mail className="h-4 w-4 flex-none text-brand-300" />
              concierge@gadget69.in
            </li>
            <li className="flex items-center gap-2 text-sm text-white/48">
              <Phone className="h-4 w-4 flex-none text-brand-300" />
              +91 9876 543 210
            </li>
            <li className="flex items-start gap-2 text-sm text-white/48">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-brand-300" />
              Chennai, Tamil Nadu, India
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
        <p className="text-sm text-white/34">
          Copyright 2026 Gadget69. All rights reserved. Built with care in Tamil Nadu.
        </p>
        <div className="flex gap-6 text-sm text-white/34">
          <a href="#" className="transition-colors hover:text-white">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
