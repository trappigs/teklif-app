import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-serif font-bold text-stone-100 mb-4">Bereketli Topraklar</h3>
          <p className="text-sm leading-relaxed mb-6">
            Geleceğinize yatırım yapın. Doğayla iç içe, güvenilir ve kârlı arsa yatırımlarının doğru adresi.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-brand transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-brand transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-brand transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold text-stone-100 mb-4">Hızlı Erişim</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-brand transition-colors">Ana Sayfa</a></li>
            <li><a href="/portfolio" className="hover:text-brand transition-colors">Arsa Portföyü</a></li>
            <li><a href="/proposal" className="hover:text-brand transition-colors">Teklif Oluştur</a></li>
            <li><a href="#" className="hover:text-brand transition-colors">Hakkımızda</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-bold text-stone-100 mb-4">İletişim</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin className="text-brand shrink-0" size={18} />
              <span>Plaza 34, Levent Mah. Büyükdere Cad.<br />İstanbul, Türkiye</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="text-brand shrink-0" size={18} />
              <span>+90 (212) 555 0123</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="text-brand shrink-0" size={18} />
              <span>bilgi@bereketlitopraklar.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs">
        &copy; {new Date().getFullYear()} Bereketli Topraklar. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
