'use client';

import { useState, useEffect } from 'react';
import { getLands } from '@/app/actions';
import { Land } from '@/types';
import { MapPin, ArrowRight, Search, BadgePercent, Check } from 'lucide-react';
import Link from 'next/link';

export default function PortfolioPage() {
  const [lands, setLands] = useState<Land[]>([]);
  const [search, setSearch] = useState('');
  const [showOnlyInstallment, setShowOnlyInstallment] = useState(false);
  const [limit, setLimit] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLands(true);
  }, [search, showOnlyInstallment]);

  const loadLands = async (reset = false) => {
    setLoading(true);
    const newLimit = reset ? 12 : limit + 12;
    const data = await getLands(search, newLimit + 1, showOnlyInstallment);
    
    const hasMoreData = data.length > newLimit;
    const finalData = hasMoreData ? data.slice(0, newLimit) : data;

    setLands(finalData);
    setLimit(newLimit);
    setHasMore(hasMoreData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-brand-dark mb-4">Portföyümüz</h1>
          <p className="text-stone-600 max-w-2xl mx-auto">Geleceğe güvenle bakmanızı sağlayacak, yatırıma uygun en değerli arazilerimiz.</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-8 flex flex-col md:flex-row gap-4 sticky top-24 z-40">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3.5 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="İl, İlçe veya Mahalle ara..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-10 p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand outline-none text-stone-900 font-medium bg-stone-50 focus:bg-white transition-colors" 
            />
          </div>
          <button 
            onClick={() => setShowOnlyInstallment(!showOnlyInstallment)}
            className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap border ${showOnlyInstallment ? 'bg-brand text-white border-brand shadow-md' : 'bg-white text-stone-600 border-stone-200 hover:border-brand hover:text-brand'}`}
          >
            {showOnlyInstallment ? <Check size={18} /> : <BadgePercent size={18} />}
            Taksitli Fırsatlar
          </button>
        </div>

        {/* Lands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lands.map(land => (
            <div key={land.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
              {land.installment && (
                <div className="absolute top-4 right-4 z-10 bg-brand-light text-brand-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm bg-opacity-90">
                  <BadgePercent size={14} /> Taksit İmkanı
                </div>
              )}
              <div className="h-56 overflow-hidden relative bg-brand-dark flex items-center justify-center">
                <img 
                  src="/logo.webp" 
                  alt="Logo Placeholder" 
                  className="w-24 h-24 object-contain brightness-0 invert"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                
                {land.imageUrl ? (
                  <img 
                    src={land.imageUrl} 
                    alt={land.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-10" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : null}
                
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 pt-12 z-20">
                  <div className="flex items-center text-white text-sm font-medium">
                    <MapPin size={16} className="mr-1" />
                    {land.location}
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-stone-900 mb-2 line-clamp-1 group-hover:text-brand transition-colors">{land.title}</h3>
                <p className="text-stone-600 text-sm line-clamp-2 mb-4 flex-grow">{land.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {land.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded font-medium border border-stone-200">{feature}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
                  <div>
                    <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-0.5">Fiyat</p>
                    <p className="text-2xl font-bold text-brand-dark">{land.price.toLocaleString('tr-TR')} ₺</p>
                  </div>
                  <Link href="/contact" className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brand-hover hover:scale-110 transition-all shadow-md">
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading & Empty States */}
        {loading && lands.length === 0 && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
            <p className="text-stone-500">Arsalar yükleniyor...</p>
          </div>
        )}

        {!loading && lands.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200">
            <Search size={48} className="mx-auto text-stone-300 mb-4" />
            <h3 className="text-xl font-bold text-stone-700 mb-2">Sonuç Bulunamadı</h3>
            <p className="text-stone-500">Arama kriterlerinize uygun arsa bulunamadı.</p>
            <button onClick={() => {setSearch(''); setShowOnlyInstallment(false);}} className="mt-6 text-brand font-bold hover:underline">Tümünü Göster</button>
          </div>
        )}

        {hasMore && !loading && lands.length > 0 && (
          <div className="text-center mt-12">
            <button onClick={() => loadLands()} className="bg-white border-2 border-stone-200 text-stone-600 px-8 py-3 rounded-xl font-bold hover:border-brand hover:text-brand transition-all shadow-sm">
              Daha Fazla Göster
            </button>
          </div>
        )}
      </div>
    </div>
  );
}