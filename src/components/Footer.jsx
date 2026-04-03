import { Link } from 'react-router-dom';
import { Zap, Twitter, Instagram, Youtube, Github, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-dark-300 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-neon-blue
                            flex items-center justify-center shadow-neon-blue">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text-blue">NEXUS</span>
          </Link>
          <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
            Your premium destination for the world's most innovative tech gadgets.
            Curated quality, futuristic design, exceptional service.
          </p>
          <div className="flex gap-3">
            {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
              <a key={i} href="#"
                 className="w-9 h-9 rounded-xl glass border border-white/10
                            flex items-center justify-center text-white/50
                            hover:text-white hover:border-brand-500/40 hover:shadow-neon-blue
                            transition-all duration-300">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Categories</h4>
          <ul className="space-y-3">
            {['Mobile Phones','Smart Watches','Earbuds','Laptops','Gaming','Smart Home'].map(c => (
              <li key={c}>
                <Link to="/products" className="text-white/40 text-sm hover:text-white transition-colors">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Customer</h4>
          <ul className="space-y-3">
            {['My Orders','Track Order','Returns','Warranty','Reviews','Help Center'].map(c => (
              <li key={c}>
                <a href="#" className="text-white/40 text-sm hover:text-white transition-colors">{c}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-white/40 text-sm">
              <Mail className="w-4 h-4 text-brand-400 flex-none" />
              support@nexusgadgets.com
            </li>
            <li className="flex items-center gap-2 text-white/40 text-sm">
              <Phone className="w-4 h-4 text-brand-400 flex-none" />
              +91 9876 543 210
            </li>
            <li className="flex items-start gap-2 text-white/40 text-sm">
              <MapPin className="w-4 h-4 text-brand-400 flex-none mt-0.5" />
              Chennai, Tamil Nadu, India
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row
                      items-center justify-between gap-4">
        <p className="text-white/30 text-sm">
          © 2025 NEXUS Gadgets. All rights reserved. Built with ❤️ in Tamil Nadu.
        </p>
        <div className="flex gap-6 text-white/30 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
