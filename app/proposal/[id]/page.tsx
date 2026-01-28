import { getProposal } from '@/app/actions';
import { notFound } from 'next/navigation';
import { Printer, Check, FileCheck, ShieldCheck, Map, Footprints, Gem, Calculator, User, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SharedProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proposal = await getProposal(id);

  if (!proposal) {
    notFound();
  }

  const calculateMonthly = (price: number, down: number, count: number) => {
    if (count <= 1) return 0;
    return (price - down) / count;
  };

  const calculateTotal = () => {
    return proposal.items.reduce((acc, item) => acc + item.cashPrice, 0);
  };

  return (
    <div className="min-h-screen bg-stone-100 py-8 print:py-0 print:bg-white flex justify-center">
      {/* Proposal Document */}
      <div className="max-w-[210mm] w-full bg-white shadow-2xl print:shadow-none min-h-[297mm] p-6 md:p-12 relative overflow-hidden text-black text-[14px]">
         {/* Background Decor */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/30 rounded-bl-full -z-0 opacity-50" />
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-50 rounded-tr-full -z-0 opacity-50" />

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 relative z-10 border-b-2 border-brand/10 pb-6 gap-4 md:gap-0">
          <div>
            <h1 className="text-3xl font-serif font-bold text-brand-dark flex items-center gap-2">
              <span className="text-brand text-4xl">Bereketli</span>Topraklar
            </h1>
            <p className="text-stone-600 text-sm mt-1 tracking-wider uppercase">Gayrimenkul Yatırım & Danışmanlık</p>
          </div>
          <div className="text-left md:text-right">
            <h2 className="text-4xl font-light text-black">PORTFÖY TEKLİFİ</h2>
            <p className="text-brand font-bold mt-1">#{proposal.id}</p>
          </div>
        </header>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10 mb-10">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Sayın</h3>
              <p className="text-xl font-bold text-black">{proposal.customerName || 'Müşterimiz'}</p>
            </div>
            <div className="flex gap-8">
               <div>
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Tarih</h3>
                  <p className="text-stone-800">{new Date(proposal.createdAt).toLocaleDateString('tr-TR')}</p>
               </div>
               <div>
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Geçerlilik</h3>
                  <p className="text-stone-800">{new Date(proposal.validUntil).toLocaleDateString('tr-TR')}</p>
               </div>
            </div>
          </div>
          <div className="text-left md:text-right">
             <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Hazırlayan</h3>
             <p className="text-stone-900 font-bold">{proposal.senderName || 'Bereketli Topraklar A.Ş.'}</p>
             <p className="text-stone-700 text-sm">{proposal.senderTitle}</p>
             <p className="text-stone-700 text-sm">{proposal.senderPhone}</p>
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-12 relative z-10">
          {proposal.items.map((item, index) => {
            const cleanDescription = item.land.description.replace(/\d+([.,]\d+)?\s*m[²2]\s*büyüklüğünde,\s*/gi, '');

            return (
              <div key={index} className="break-inside-avoid">
                <div className="flex flex-col md:flex-row gap-6 mb-8 md:mb-4 border-b md:border-b-0 pb-8 md:pb-0 border-stone-100 last:border-0 last:pb-0">
                    <div className="w-full md:w-1/3 h-64 md:h-48 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                      <img 
                        src={item.land.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop'} 
                        className="w-full h-full object-cover" 
                        alt={item.land.title}
                      />
                    </div>
                    <div className="w-full md:w-2/3">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-2 md:gap-0">
                        <h3 className="text-xl font-bold text-brand-dark">{index + 1}. {item.land.title}</h3>
                        <span className="bg-brand-light text-brand-dark text-xs px-2 py-1 rounded font-bold">{item.land.location}</span>
                      </div>
                      <p className="text-stone-800 text-sm mb-4 line-clamp-2">{cleanDescription}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm border-t border-stone-100 pt-3 mb-4">
                        <div><span className="text-stone-500">Alan:</span> <span className="font-bold text-stone-900">{item.area} m²</span></div>
                        <div><span className="text-stone-500">Ada/Parsel:</span> <span className="font-bold text-stone-900">{item.ada}/{item.parsel}</span></div>
                      </div>

                      {/* Financial Plan Table */}
                      <div className="bg-white rounded-2xl border-2 border-stone-100 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                          <thead className="bg-stone-50 text-stone-500 uppercase text-[8px] md:text-[10px] font-bold tracking-widest">
                            <tr>
                              <th className="py-3 px-2 md:px-4">Plan</th>
                              <th className="py-3 px-2 md:px-4 text-right">Satış Fiyatı</th>
                              <th className="py-3 px-2 md:px-4 text-right">Peşinat</th>
                              <th className="py-3 px-2 md:px-4 text-right">Taksit</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 text-[11px] md:text-sm">
                            {/* Cash Option */}
                            <tr className="bg-brand-light/10">
                              <td className="py-3 md:py-4 px-2 md:px-4 font-bold text-brand-dark">PEŞİN</td>
                              <td className="py-3 md:py-4 px-2 md:px-4 text-right font-bold whitespace-nowrap">{item.cashPrice.toLocaleString('tr-TR')} ₺</td>
                              <td className="py-3 md:py-4 px-2 md:px-4 text-right text-stone-400">-</td>
                              <td className="py-3 md:py-4 px-2 md:px-4 text-right text-brand-dark font-bold whitespace-nowrap">Tek Ödeme</td>
                            </tr>
                            {/* Option 1 */}
                            <tr>
                              <td className="py-3 md:py-4 px-2 md:px-4 font-bold text-stone-700 whitespace-nowrap text-[10px] md:text-sm">12 AY VADE</td>
                              <td className="py-3 md:py-4 px-2 md:px-4 text-right font-medium whitespace-nowrap">{item.option1.price.toLocaleString('tr-TR')} ₺</td>
                              <td className="py-3 md:py-4 px-2 md:px-4 text-right whitespace-nowrap">{item.option1.downPayment.toLocaleString('tr-TR')} ₺</td>
                              <td className="py-3 md:py-4 px-2 md:px-4 text-right font-bold text-brand whitespace-nowrap">{item.option1.installmentCount}x {calculateMonthly(item.option1.price, item.option1.downPayment, item.option1.installmentCount).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</td>
                            </tr>
                            {/* Option 2 */}
                            {(item.option2.price > 0 || item.option2.downPayment > 0) && (
                              <tr>
                                <td className="py-3 md:py-4 px-2 md:px-4 font-bold text-stone-700 whitespace-nowrap text-[10px] md:text-sm">24 AY VADE</td>
                                <td className="py-3 md:py-4 px-2 md:px-4 text-right font-medium whitespace-nowrap">{item.option2.price.toLocaleString('tr-TR')} ₺</td>
                                <td className="py-3 md:py-4 px-2 md:px-4 text-right whitespace-nowrap">{item.option2.downPayment.toLocaleString('tr-TR')} ₺</td>
                                <td className="py-3 md:py-4 px-2 md:px-4 text-right font-bold text-emerald-700 whitespace-nowrap">{item.option2.installmentCount}x {calculateMonthly(item.option2.price, item.option2.downPayment, item.option2.installmentCount).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Propositions Section - Optimized for Mobile (2x2 Grid) */}
        <div className="mt-12 break-inside-avoid">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-stone-200 flex-grow"></div>
            <h3 className="text-brand-dark font-serif font-bold text-lg tracking-widest uppercase">GÜVENCE & AYRICALIKLAR</h3>
            <div className="h-px bg-stone-200 flex-grow"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
             <div className="bg-stone-50 p-4 md:p-6 rounded-xl border border-stone-100 flex flex-col items-center text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
               <div className="mb-2 md:mb-3 p-2 md:p-3 bg-white rounded-full shadow-sm text-brand"><FileCheck size={20} className="md:w-6 md:h-6" /></div>
               <h4 className="font-bold text-stone-900 text-[10px] md:text-xs mb-1 md:mb-2 uppercase tracking-wide">Tamamı İmarlı</h4>
               <p className="text-[9px] md:text-[10px] text-stone-500 leading-relaxed hidden md:block">Resmi imar planı onaylı, inşaat iznine hazır güvenli parseller.</p>
             </div>

             <div className="bg-stone-50 p-4 md:p-6 rounded-xl border border-stone-100 flex flex-col items-center text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
               <div className="mb-2 md:mb-3 p-2 md:p-3 bg-white rounded-full shadow-sm text-brand"><ShieldCheck size={20} className="md:w-6 md:h-6" /></div>
               <h4 className="font-bold text-stone-900 text-[10px] md:text-xs mb-1 md:mb-2 uppercase tracking-wide">Müstakil Tapu</h4>
               <p className="text-[9px] md:text-[10px] text-stone-500 leading-relaxed hidden md:block">Hisseli değil, adınıza kayıtlı tek tapu. Sorunsuz ve hızlı devir.</p>
             </div>

             <div className="bg-stone-50 p-4 md:p-6 rounded-xl border border-stone-100 flex flex-col items-center text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
               <div className="mb-2 md:mb-3 p-2 md:p-3 bg-white rounded-full shadow-sm text-brand"><Map size={20} className="md:w-6 md:h-6" /></div>
               <h4 className="font-bold text-stone-900 text-[10px] md:text-xs mb-1 md:mb-2 uppercase tracking-wide">Altyapı Hazır</h4>
               <p className="text-[9px] md:text-[10px] text-stone-500 leading-relaxed hidden md:block">Elektrik, su ve kanalizasyon altyapısı tamamlanmış bölgeler.</p>
             </div>

             <div className="bg-stone-50 p-4 md:p-6 rounded-xl border border-stone-100 flex flex-col items-center text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
               <div className="mb-2 md:mb-3 p-2 md:p-3 bg-white rounded-full shadow-sm text-brand"><Footprints size={20} className="md:w-6 md:h-6" /></div>
               <h4 className="font-bold text-stone-900 text-[10px] md:text-xs mb-1 md:mb-2 uppercase tracking-wide">Yolları Açılmış</h4>
               <p className="text-[9px] md:text-[10px] text-stone-500 leading-relaxed hidden md:block">Her parselin resmi kadastral yolu açılmış ve ulaşımı rahattır.</p>
             </div>

             <div className="bg-brand-dark p-4 md:p-6 rounded-xl border border-brand-dark flex flex-col items-center text-center relative overflow-hidden group col-span-2 md:col-span-2">
               <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
               <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-white/10 rounded-full text-amber-400 backdrop-blur-sm shrink-0"><Gem size={24} /></div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wide">Kendi Mülkümüz</h4>
                    <p className="text-[10px] text-brand-light/80 leading-relaxed">Aracı veya komisyoncu değiliz. Satışa sunduğumuz tüm araziler şirketimizin öz malıdır. Güvendiğimiz yerleri sunuyoruz.</p>
                  </div>
               </div>
             </div>
          </div>
        </div>
        
        {/* Footer Area with Consultant Card */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-end gap-8 relative z-10 break-inside-avoid">
           <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm min-w-[320px] w-full md:w-auto">
              <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center text-stone-400 border-2 border-white shadow-inner shrink-0 overflow-hidden">
                 {proposal.senderImage ? <img src={proposal.senderImage} alt={proposal.senderName} className="w-full h-full object-cover" /> : <User size={40} />}
              </div>
              <div>
                 <h4 className="text-stone-900 font-bold text-lg leading-tight">{proposal.senderName || 'Bereketli Topraklar'}</h4>
                 <p className="text-brand font-medium text-xs uppercase tracking-wider mt-1">{proposal.senderTitle || 'Yatırım Danışmanı'}</p>
                 <div className="flex items-center gap-2 text-stone-600 mt-3 text-sm">
                    <Phone size={14} className="text-brand" />
                    <span>{proposal.senderPhone}</span>
                 </div>
              </div>
           </div>

           <div className="text-right flex-grow">
              <span className="text-xl font-light text-stone-700">Toplam Portföy Değeri:</span>
              <p className="text-3xl font-serif font-bold text-brand-dark">{calculateTotal().toLocaleString('tr-TR')} ₺</p>
              <div className="mt-6">
                 <div className="h-12 w-48 border-b border-dashed border-stone-300 ml-auto mb-2"></div>
                 <span className="text-[10px] font-bold text-brand-dark uppercase tracking-widest">Yetkili İmza / Kaşe</span>
              </div>
           </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500 relative z-10 break-inside-avoid">
           <div>Bu belge bilgilendirme amaçlıdır. {new Date(proposal.createdAt).toLocaleDateString('tr-TR')}</div>
           <div className="text-stone-400 italic">Bereketli Topraklar Gayrimenkul</div>
        </div>
      </div>
    </div>
  );
}
