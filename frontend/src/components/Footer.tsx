import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Github,
  Heart
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" }
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 overflow-hidden relative">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-green-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                SMART<span className="text-green-600">AGRO</span>
              </span>
            </Link>
            <p className="text-gray-500 leading-relaxed text-sm">
              {t('footer.about')}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all transform hover:-translate-y-1"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-bold mb-8 relative inline-block">
              {t('footer.quickLinks')}
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-green-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-500 hover:text-green-600 transition-colors text-sm font-medium flex items-center gap-2 group"><div className="w-1 h-1 bg-gray-300 rounded-full group-hover:w-2 group-hover:bg-green-600 transition-all"></div>{t('nav.home')}</Link></li>
              <li><Link to="/login" className="text-gray-500 hover:text-green-600 transition-colors text-sm font-medium flex items-center gap-2 group"><div className="w-1 h-1 bg-gray-300 rounded-full group-hover:w-2 group-hover:bg-green-600 transition-all"></div>{t('nav.login')}</Link></li>
              <li><Link to="/register" className="text-gray-500 hover:text-green-600 transition-colors text-sm font-medium flex items-center gap-2 group"><div className="w-1 h-1 bg-gray-300 rounded-full group-hover:w-2 group-hover:bg-green-600 transition-all"></div>{t('nav.register')}</Link></li>
              <li><Link to="/admin/login" className="text-gray-500 hover:text-green-600 transition-colors text-sm font-medium flex items-center gap-2 group"><div className="w-1 h-1 bg-gray-300 rounded-full group-hover:w-2 group-hover:bg-green-600 transition-all"></div>Admin Login</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gray-900 font-bold mb-8 relative inline-block">
              {t('footer.services')}
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-green-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li><Link to="/detect" className="text-gray-500 hover:text-green-600 transition-colors text-sm font-medium flex items-center gap-2 group"><div className="w-1 h-1 bg-gray-300 rounded-full group-hover:w-2 group-hover:bg-green-600 transition-all"></div>{t('nav.detect')}</Link></li>
              <li><Link to="/fertilizers" className="text-gray-500 hover:text-green-600 transition-colors text-sm font-medium flex items-center gap-2 group"><div className="w-1 h-1 bg-gray-300 rounded-full group-hover:w-2 group-hover:bg-green-600 transition-all"></div>{t('nav.fertilizer')}</Link></li>
              <li><Link to="/weather" className="text-gray-500 hover:text-green-600 transition-colors text-sm font-medium flex items-center gap-2 group"><div className="w-1 h-1 bg-gray-300 rounded-full group-hover:w-2 group-hover:bg-green-600 transition-all"></div>{t('nav.weather')}</Link></li>
              <li><Link to="/market" className="text-gray-500 hover:text-green-600 transition-colors text-sm font-medium flex items-center gap-2 group"><div className="w-1 h-1 bg-gray-300 rounded-full group-hover:w-2 group-hover:bg-green-600 transition-all"></div>{t('nav.market')}</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-gray-900 font-bold mb-8 relative inline-block">
              {t('footer.contact')}
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-green-500 rounded-full"></span>
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <div className="bg-gray-50 p-2 rounded-xl text-green-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-gray-500 text-sm leading-relaxed">{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-xl text-green-600">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-gray-500 text-sm font-medium">{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-xl text-green-600">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-gray-500 text-sm font-medium underline underline-offset-4 hover:text-green-600 transition-colors">{t('footer.email')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-gray-400 text-sm font-medium">
            © {currentYear} <span className="text-gray-900 font-bold">Smart Agro</span>. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium">
            Made with <Heart className="w-4 h-4 text-red-400 fill-current" /> for farmers worldwide
          </div>
        </div>
      </div>
    </footer>
  );
}
