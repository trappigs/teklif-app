import Link from 'next/link';
import { getLands } from '@/app/actions';
import { MapPin, Ruler, ArrowRight } from 'lucide-react';

export default async function Portfolio() {
  const lands = await getLands();

  return (
    <div className="min-h-screen bg-stone-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">Arsa Portföyümüz</h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Yatırım değeri yüksek, imarlı ve sorunsuz tapulu arsa seçeneklerimizi inceleyin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lands.map((land) => (
            <div key={land.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-stone-100 flex flex-col h-full hover:border-brand transition-colors">
              <div className="relative h-64 shrink-0">
                <img src={land.imageUrl} alt={land.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-brand-dark/80 backdrop-blur text-white px-3 py-1 rounded text-sm font-bold">
                  {land.location}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-stone-800 line-clamp-1">{land.title}</h3>
                </div>
                
                <p className="text-stone-600 text-sm mb-6 line-clamp-3 flex-grow">
                  {land.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-stone-500">
                  <div className="flex items-center gap-2 bg-stone-50 p-2 rounded">
                    <Ruler size={16} className="text-brand" />
                    <span>{land.size}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-stone-50 p-2 rounded">
                    <MapPin size={16} className="text-brand" />
                    <span>Ada: {land.ada} / Par: {land.parsel}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-100">
                  <div className="text-2xl font-serif font-bold text-brand-dark">
                    {land.price.toLocaleString('tr-TR')} ₺
                  </div>
                  <Link 
                    href={`/proposal?landId=${land.id}`} 
                    className="bg-brand hover:bg-brand-hover text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                  >
                    Teklif Hazırla <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
