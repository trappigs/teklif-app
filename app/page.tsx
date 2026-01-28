import Link from 'next/link';
import { getLands } from '@/app/actions';
import { ArrowRight, CheckCircle2, Trees, ShieldCheck, TrendingUp } from 'lucide-react';

export default async function Home() {
  const allLands = await getLands();
  const featuredLands = allLands.slice(0, 3); // Show first 3

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2670&auto=format&fit=crop" 
            alt="Nature Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight leading-tight">
            Toprağa Yatırım,<br />Geleceğe Güven
          </h1>
          <p className="text-xl md:text-2xl font-light mb-10 text-stone-100">
            Bereketli Topraklar ile hayallerinizdeki yaşam alanına veya en kârlı yatırıma sahip olun.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/portfolio" className="bg-brand hover:bg-brand-hover text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Fırsatları İncele <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-all">
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">Neden Biz?</h2>
            <div className="w-24 h-1 bg-brand mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-brand-light text-brand rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand group-hover:text-white transition-colors">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-stone-800">Güvenilir Tapu</h3>
              <p className="text-stone-600">
                Tüm portföyümüz resmi kurumlarca onaylanmış, sorunsuz ve hemen devredilebilir tapulardan oluşur.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-stone-800">Yüksek Değer Artışı</h3>
              <p className="text-stone-600">
                Gelişmekte olan bölgelerdeki en stratejik noktaları seçiyor, yatırımınızın değerlenmesini sağlıyoruz.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-brand-light text-brand rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand group-hover:text-white transition-colors">
                <Trees size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-stone-800">Doğayla İç İçe</h3>
              <p className="text-stone-600">
                Sadece beton değil, yaşam satıyoruz. Tüm arsalarımız eşsiz doğa manzaralarına ve temiz havaya sahiptir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Lands */}
      <section className="py-24 bg-stone-100">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-2">Öne Çıkan Fırsatlar</h2>
              <p className="text-stone-600">Sizin için seçtiğimiz en özel araziler.</p>
            </div>
            <Link href="/portfolio" className="hidden md:flex items-center gap-2 text-brand font-bold hover:text-brand-dark transition-colors">
              Tümünü Gör <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredLands.map((land) => (
              <div key={land.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <img src={land.imageUrl} alt={land.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-dark font-bold px-3 py-1 rounded-full text-sm">
                    {land.size}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-brand transition-colors">{land.title}</h3>
                  <div className="flex items-center text-stone-500 mb-4 text-sm">
                    <CheckCircle2 size={16} className="mr-1 text-brand" /> {land.location}
                  </div>
                  <div className="flex justify-between items-center border-t border-stone-100 pt-4">
                    <span className="text-2xl font-serif font-bold text-brand-dark">
                      {land.price.toLocaleString('tr-TR')} ₺
                    </span>
                    <Link href={`/portfolio`} className="text-sm font-bold text-stone-400 hover:text-brand uppercase tracking-wide">
                      İncele
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
             <Link href="/portfolio" className="inline-flex items-center gap-2 text-brand font-bold">
              Tüm Portföyü Gör <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}