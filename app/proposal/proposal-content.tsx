'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Land, ProposalItem, Settings } from '@/types';
import { saveProposal } from '@/app/actions';
import { logout, getSessionUser } from '@/app/auth/actions';
import { Printer, ArrowLeft, Check, FileText, Plus, Trash2, Calculator, Search, ShieldCheck, FileCheck, Map, Footprints, Gem, Share2, Copy, X, User, Briefcase, Phone, RefreshCcw, BadgePercent } from 'lucide-react';

interface ProposalContentProps {
  availableLands: Land[];
  defaultSettings: Settings;
}

export default function ProposalContent({ availableLands, defaultSettings }: ProposalContentProps) {
  const searchParams = useSearchParams();
  const initialLandId = searchParams.get('landId');

  const [username, setUsername] = useState<string>('');
  const [proposalItems, setProposalItems] = useState<ProposalItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  
  const [senderName, setSenderName] = useState(defaultSettings.senderName);
  const [senderTitle, setSenderTitle] = useState(defaultSettings.senderTitle);
  const [senderPhone, setSenderPhone] = useState(defaultSettings.senderPhone);
  const [senderImage, setSenderImage] = useState(defaultSettings.senderImage || '');

  const [validUntil, setValidUntil] = useState('');
  const [globalNotes, setGlobalNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [selectedLandId, setSelectedLandId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalSaved, setProposalSaved] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getSessionUser();
      if(user) setUsername(user);
    };
    fetchUser();

    if (initialLandId) {
      const land = availableLands.find(l => l.id === parseInt(initialLandId));
      if (land) {
        addItemToProposal(land);
      }
    }
    const date = new Date();
    date.setDate(date.getDate() + 3);
    setValidUntil(date.toISOString().split('T')[0]);
  }, [initialLandId, availableLands]);

  const addItemToProposal = (land: Land) => {
    const cleanArea = land.size.replace(/\s*m[²2]\s*/gi, '');
    const basePrice = land.price;
    const opt1Price = Math.round(basePrice * 1.10);
    const opt1Down = Math.round(opt1Price / 2);
    const opt2Price = Math.round(basePrice * 1.21);
    const opt2Down = Math.round(opt2Price / 2);

    setProposalItems([...proposalItems, {
      land,
      offerPrice: basePrice,
      cashPrice: basePrice,
      ada: land.ada || '',
      parsel: land.parsel || '',
      area: cleanArea,
      option1: { price: opt1Price, downPayment: opt1Down, installmentCount: 12 },
      option2: { price: opt2Price, downPayment: opt2Down, installmentCount: 24 }
    }]);
    setSelectedLandId('');
    setSearchTerm(''); 
  };

  const removeItem = (index: number) => {
    const newItems = [...proposalItems];
    newItems.splice(index, 1);
    setProposalItems(newItems);
  };

  const clearOptions = (index: number) => {
    const newItems = [...proposalItems];
    newItems[index].option1 = { price: 0, downPayment: 0, installmentCount: 12 };
    newItems[index].option2 = { price: 0, downPayment: 0, installmentCount: 24 };
    setProposalItems(newItems);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...proposalItems];
    const item = newItems[index];

    if (field === 'cashPrice') {
      const newCashPrice = Number(value);
      item.cashPrice = newCashPrice;
      item.option1.price = Math.round(newCashPrice * 1.10);
      item.option1.downPayment = Math.round(item.option1.price / 2);
      item.option2.price = Math.round(newCashPrice * 1.21);
      item.option2.downPayment = Math.round(item.option2.price / 2);
    } 
    else if (field.startsWith('option1.')) {
      const subField = field.split('.')[1] as keyof typeof item.option1;
      item.option1[subField] = value;
    } else if (field.startsWith('option2.')) {
      const subField = field.split('.')[1] as keyof typeof item.option2;
      item.option2[subField] = value;
    } else {
      // @ts-ignore
      item[field] = value;
    }
    setProposalItems(newItems);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    if (proposalSaved) {
      setIsModalOpen(true);
      return;
    }
    setIsSaving(true);
    try {
      const id = await saveProposal({
        customerName,
        senderName,
        senderTitle,
        senderPhone,
        senderImage,
        validUntil,
        createdBy: username,
        items: proposalItems,
        globalNotes
      });
      setShareLink(`${window.location.origin}/proposal/${id}`);
      setIsModalOpen(true);
      setProposalSaved(true);
    } catch (error) {
      alert('Teklif kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  const calculateMonthly = (price: number, down: number, count: number) => {
    if (!price || !count || count <= 1) return 0;
    return (price - (down || 0)) / count;
  };

  const calculateTotal = () => {
    return proposalItems.reduce((acc, item) => acc + (item.cashPrice || 0), 0);
  };

  const handleShowPreview = () => {
    if (!customerName.trim()) { alert('Lütfen müşteri adını giriniz.'); return; }
    if (proposalItems.length === 0) { alert('Lütfen teklife en az bir arsa ekleyiniz.'); return; }
    const hasInvalidItem = proposalItems.some(item => !item.cashPrice || item.cashPrice <= 0);
    if (hasInvalidItem) { alert('Lütfen eklediğiniz tüm arsalar için geçerli bir fiyat giriniz.'); return; }
    setShowPreview(true);
  };

  const filteredLands = availableLands.filter(land => {
    const searchLower = searchTerm.toLocaleLowerCase('tr-TR');
    const locParts = land.location.split(',').map(s => s.trim());
    const formattedLoc = locParts.length >= 3 ? `${locParts[2]} - ${locParts[1]} - ${locParts[0]}` : land.location;
    return land.title.toLocaleLowerCase('tr-TR').includes(searchLower) || formattedLoc.toLocaleLowerCase('tr-TR').includes(searchLower) || land.price.toString().includes(searchLower);
  });

  if (showPreview) {
    return (
      <div className="min-h-screen bg-stone-100 py-8 md:py-12 print:py-0 print:bg-white text-black">
        {isModalOpen && shareLink && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 print:hidden">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border border-stone-100 animate-in fade-in zoom-in duration-200">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors"><X size={24} /></button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-brand-light text-brand rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} /></div>
                <h3 className="text-2xl font-bold text-stone-800">Teklif Hazır!</h3>
                <p className="text-stone-500 mt-2 text-sm">Aşağıdaki linki kopyalayarak müşterinizle paylaşabilirsiniz.</p>
              </div>
              <div className="flex gap-2 mb-6">
                <input type="text" readOnly value={shareLink} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600 outline-none truncate" />
                <button onClick={() => { navigator.clipboard.writeText(shareLink); alert('Link kopyalandı!'); }} className="bg-brand text-white p-3 rounded-lg hover:bg-brand-hover"><Copy size={20} /></button>
              </div>
              <div className="flex flex-col gap-3">
                <a href={`https://wa.me/?text=Sizin%20için%20hazırladığımız%20teklifi%20inceleyebilirsiniz:%20${shareLink}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white py-4 rounded-xl font-bold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm">WhatsApp ile Gönder</a>
                <button onClick={() => setIsModalOpen(false)} className="bg-stone-100 text-stone-600 py-3 rounded-xl font-bold hover:bg-stone-200 transition-colors text-sm">Kapat</button>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 mb-8 flex flex-col md:flex-row justify-between items-center print:hidden max-w-4xl gap-4">
          <button onClick={() => setShowPreview(false)} className="flex items-center gap-2 text-stone-700 hover:text-brand font-bold"><ArrowLeft size={20} /> Düzenlemeye Dön</button>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={handleSave} 
              disabled={isSaving} 
              className="flex-1 md:flex-none bg-brand-dark hover:bg-brand text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
            >
              {isSaving ? '...' : proposalSaved ? <><Check size={20} /> Link Alındı</> : <><Share2 size={20} /> Link Oluştur</>}
            </button>
            <button onClick={handlePrint} className="flex-1 md:flex-none bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"><Printer size={20} /> Yazdır / PDF</button>
          </div>
        </div>

        <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full print:max-w-none min-h-[297mm] p-6 md:p-12 relative overflow-hidden text-black text-[13px] md:text-[15px]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/30 rounded-bl-full -z-0 opacity-50" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-50 rounded-tr-full -z-0 opacity-50" />

          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 relative z-10 border-b-2 border-brand/10 pb-6 gap-4 md:gap-0">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                   <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark flex flex-wrap items-center gap-x-2 leading-tight">
                    <span className="text-brand text-3xl md:text-4xl">Bereketli</span>Topraklar
                  </h1>
                  <p className="text-stone-600 text-xs md:text-sm tracking-wider uppercase font-medium mt-1">Gayrimenkul Yatırım & Danışmanlık</p>
                </div>
              </div>
            </div>
            <div className="text-left md:text-right w-full md:w-auto">
              <h2 className="text-3xl md:text-4xl font-light text-black tracking-tighter">PORTFÖY TEKLİFİ</h2>
              <p className="text-brand font-bold mt-1 text-base md:text-lg">#TASLAK</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10 mb-10 border-b border-stone-100 pb-10">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Sayın Müşterimiz</h3>
                <p className="text-2xl font-bold text-black border-l-4 border-brand pl-3">{customerName || 'Müşterimiz'}</p>
              </div>
              <div className="flex gap-10">
                 <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Tarih</h3>
                    <p className="text-stone-800 font-bold">{new Date().toLocaleDateString('tr-TR')}</p>
                 </div>
                 <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Geçerlilik</h3>
                    <p className="text-stone-800 font-bold">{new Date(validUntil).toLocaleDateString('tr-TR')}</p>
                 </div>
              </div>
            </div>
            <div className="text-left md:text-right">
               <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Hazırlayan</h3>
               <p className="text-stone-900 font-bold text-lg">{senderName || 'Bereketli Topraklar A.Ş.'}</p>
               <p className="text-stone-700 text-sm">{senderTitle}</p>
               <p className="text-stone-700 text-sm">{senderPhone}</p>
            </div>
          </div>

          <div className="space-y-16 relative z-10">
            {proposalItems.map((item, index) => {
              const cleanDescription = item.land.description.replace(/\d+([.,]\d+)?\s*m[²2]\s*büyüklüğünde,\s*/gi, '');
              return (
                <div key={index} className="break-inside-avoid">
                  <div className="flex flex-col md:flex-row gap-8 mb-8 border-b md:border-b-0 pb-8 md:pb-0 border-stone-100 last:border-0 last:pb-0">
                      <div className="w-full md:w-1/3 h-64 md:h-56 rounded-2xl overflow-hidden border border-stone-200 shrink-0 shadow-sm bg-brand-dark relative flex items-center justify-center p-8">
                        <img 
                          src="/logo.webp" 
                          alt="Logo Placeholder" 
                          className="w-32 h-32 object-contain brightness-0 invert"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        {item.land?.imageUrl ? (
                          <img 
                            src={item.land.imageUrl} 
                            className="absolute inset-0 w-full h-full object-cover z-10"
                            alt={item.land.title}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : null}
                      </div>
                      <div className="w-full md:w-2/3 flex flex-col">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-2 md:gap-0">
                          <h3 className="text-xl font-bold text-brand-dark">{index + 1}. {item.land.title}</h3>
                          <span className="bg-brand-light text-brand-dark text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">{item.land.location}</span>
                        </div>
                        <p className="text-stone-800 text-sm mb-5 leading-relaxed">{cleanDescription}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm border-t border-stone-100 pt-4 mb-5">
                          <div className="bg-stone-50 p-2 rounded-lg"><span className="text-stone-500 text-[10px] block uppercase font-bold">Alan</span> <span className="font-bold text-stone-900 text-base">{item.area} m²</span></div>
                          <div className="bg-stone-50 p-2 rounded-lg"><span className="text-stone-500 text-[10px] block uppercase font-bold">Ada / Parsel</span> <span className="font-bold text-stone-900 text-base">{item.ada} / {item.parsel}</span></div>
                        </div>
                        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                          <table className="w-full text-left table-fixed">
                            <thead className="bg-stone-50 text-stone-500 uppercase text-[8px] md:text-[10px] font-bold tracking-widest border-b border-stone-200">
                              <tr>
                                <th className="py-2.5 px-2 md:px-4 w-[25%]">Plan</th>
                                <th className="py-2.5 px-2 md:px-4 text-right w-[25%]">Fiyat</th>
                                <th className="py-2.5 px-2 md:px-4 text-right w-[25%]">Peşinat</th>
                                <th className="py-2.5 px-2 md:px-4 text-right w-[25%]">Taksit</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-[10px] md:text-sm">
                              <tr className="bg-brand-light/5">
                                <td className="py-3 px-2 md:px-4 font-bold text-brand-dark">PEŞİN</td>
                                <td className="py-3 px-2 md:px-4 text-right font-bold whitespace-nowrap text-brand-dark">{(item.cashPrice || 0).toLocaleString('tr-TR')} ₺</td>
                                <td className="py-3 px-2 md:px-4 text-right text-stone-400">-</td>
                                <td className="py-3 px-2 md:px-4 text-right font-bold whitespace-nowrap text-brand-dark">Nakit</td>
                              </tr>
                              {item.option1.price > 0 && (
                                <tr>
                                  <td className="py-3 px-2 md:px-4 font-bold text-stone-700 uppercase">{item.option1.installmentCount} AY VADE</td>
                                  <td className="py-3 px-2 md:px-4 text-right whitespace-nowrap">{item.option1.price.toLocaleString('tr-TR')} ₺</td>
                                  <td className="py-3 px-2 md:px-4 text-right whitespace-nowrap">{item.option1.downPayment.toLocaleString('tr-TR')} ₺</td>
                                  <td className="py-3 px-2 md:px-4 text-right font-bold text-brand whitespace-nowrap">{item.option1.installmentCount}x {calculateMonthly(item.option1.price, item.option1.downPayment, item.option1.installmentCount).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</td>
                                </tr>
                              )}
                              {item.option2.price > 0 && (
                                <tr>
                                  <td className="py-3 px-2 md:px-4 font-bold text-stone-700 uppercase">{item.option2.installmentCount} AY VADE</td>
                                  <td className="py-3 px-2 md:px-4 text-right whitespace-nowrap">{item.option2.price.toLocaleString('tr-TR')} ₺</td>
                                  <td className="py-3 px-2 md:px-4 text-right whitespace-nowrap">{item.option2.downPayment.toLocaleString('tr-TR')} ₺</td>
                                  <td className="py-3 px-2 md:px-4 text-right font-bold text-emerald-700 whitespace-nowrap">{item.option2.installmentCount}x {calculateMonthly(item.option2.price, item.option2.downPayment, item.option2.installmentCount).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</td>
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

          <div className="mt-16 break-inside-avoid">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-stone-200 flex-grow"></div>
              <h3 className="text-brand-dark font-serif font-bold text-lg tracking-widest uppercase text-center">GÜVENCE & AYRICALIKLAR</h3>
              <div className="h-px bg-stone-200 flex-grow"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
               <div className="bg-stone-50 p-4 md:p-6 rounded-2xl border border-stone-100 flex flex-col items-center text-center relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
                 <div className="mb-2 md:mb-3 p-2 md:p-3 bg-white rounded-full shadow-sm text-brand"><FileCheck size={20} className="md:w-6 md:h-6" /></div>
                 <h4 className="font-bold text-stone-900 text-[11px] md:text-sm mb-1 md:mb-2 uppercase tracking-wide">Tamamı İmarlı</h4>
                 <p className="text-[10px] text-stone-500 leading-relaxed hidden md:block">Resmi imar planı onaylı, inşaat iznine hazır güvenli parseller.</p>
               </div>
               <div className="bg-stone-50 p-4 md:p-6 rounded-2xl border border-stone-100 flex flex-col items-center text-center relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
                 <div className="mb-2 md:mb-3 p-2 md:p-3 bg-white rounded-full shadow-sm text-brand"><ShieldCheck size={20} className="md:w-6 md:h-6" /></div>
                 <h4 className="font-bold text-stone-900 text-[11px] md:text-sm mb-1 md:mb-2 uppercase tracking-wide">Müstakil Tapu</h4>
                 <p className="text-[10px] text-stone-500 leading-relaxed hidden md:block">Hisseli değil, adınıza kayıtlı tek tapu. Sorunsuz ve hızlı devir.</p>
               </div>
               <div className="bg-stone-50 p-4 md:p-6 rounded-2xl border border-stone-100 flex flex-col items-center text-center relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
                 <div className="mb-2 md:mb-3 p-2 md:p-3 bg-white rounded-full shadow-sm text-brand"><Map size={20} className="md:w-6 md:h-6" /></div>
                 <h4 className="font-bold text-stone-900 text-[11px] md:text-sm mb-1 md:mb-2 uppercase tracking-wide">Altyapı Hazır</h4>
                 <p className="text-[10px] text-stone-500 leading-relaxed hidden md:block">Elektrik, su ve kanalizasyon altyapısı tamamlanmış bölgeler.</p>
               </div>
               <div className="bg-stone-50 p-4 md:p-6 rounded-2xl border border-stone-100 flex flex-col items-center text-center relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
                 <div className="mb-2 md:mb-3 p-2 md:p-3 bg-white rounded-full shadow-sm text-brand"><Footprints size={20} className="md:w-6 md:h-6" /></div>
                 <h4 className="font-bold text-stone-900 text-[11px] md:text-sm mb-1 md:mb-2 uppercase tracking-wide">Yolları Açılmış</h4>
                 <p className="text-[10px] text-stone-500 leading-relaxed hidden md:block">Her parselin resmi kadastral yolu açılmış ve ulaşımı rahattır.</p>
               </div>
               <div className="bg-brand-dark p-5 md:p-6 rounded-2xl border border-brand-dark flex flex-col md:flex-row items-center text-center md:text-left relative overflow-hidden group col-span-2 md:col-span-2">
                 <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-full text-amber-400 backdrop-blur-sm shrink-0"><Gem size={24} /></div>
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wide">Kendi Mülkümüz</h4>
                      <p className="text-[10px] md:text-xs text-brand-light/80 leading-relaxed">Aracı veya komisyoncu değiliz. Satışa sunduğumuz tüm araziler şirketimizin öz malıdır. Güvendiğimiz yerleri sunuyoruz.</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="mt-16 flex flex-col md:flex-row justify-between items-end gap-8 relative z-10 break-inside-avoid">
             <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm min-w-[300px] w-full md:w-auto">
                <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center text-stone-400 border-2 border-white shadow-inner shrink-0 overflow-hidden">
                   {senderImage ? <img src={senderImage} alt={senderName} className="w-full h-full object-cover" /> : <User size={40} />}
                </div>
                <div>
                   <h4 className="text-stone-900 font-bold text-lg leading-tight">{senderName}</h4>
                   <p className="text-brand font-medium text-[10px] uppercase tracking-wider mt-1">{senderTitle}</p>
                   <div className="flex items-center gap-2 text-stone-600 mt-3 text-sm font-medium">
                      <Phone size={14} className="text-brand" />
                      <span>{senderPhone}</span>
                   </div>
                </div>
             </div>
             <div className="text-right flex-grow">
                <span className="text-xl font-light text-stone-700 uppercase tracking-tight">Toplam Portföy Değeri:</span>
                <p className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">{calculateTotal().toLocaleString('tr-TR')} ₺</p>
                <div className="mt-6">
                   <div className="h-12 w-48 border-b border-dashed border-stone-300 ml-auto mb-2"></div>
                   <span className="text-[10px] font-bold text-brand-dark uppercase tracking-widest">Yetkili İmza / Kaşe</span>
                </div>
             </div>
          </div>

          <div className="mt-12 pt-8 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500 relative z-10 break-inside-avoid">
             <div>Bu belge bilgilendirme amaçlıdır. {new Date().toLocaleDateString('tr-TR')}</div>
             <div className="text-stone-400 italic">Bereketli Topraklar Gayrimenkul</div>
          </div>
        </div>
      </div>
    );
  }

  // Form View...
  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-serif font-bold text-brand-dark mb-8 flex items-center gap-3">
          <img src="/logo.webp" alt="Logo" className="w-10 h-10 object-contain" />
          Çoklu Teklif Oluşturucu
        </h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
               <h3 className="font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                 <User size={18} className="text-brand" /> Hazırlayan Bilgileri
               </h3>
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-stone-600 mb-1 uppercase">İsim Soyisim</label>
                   <input type="text" value={senderName} readOnly className="w-full p-2 border border-stone-200 rounded bg-stone-50 text-sm text-stone-500 font-medium cursor-not-allowed" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-stone-600 mb-1 uppercase">Unvan</label>
                   <input type="text" value={senderTitle} readOnly className="w-full p-2 border border-stone-200 rounded bg-stone-50 text-sm text-stone-500 font-medium cursor-not-allowed" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-stone-600 mb-1 uppercase">Telefon</label>
                   <input type="text" value={senderPhone} readOnly className="w-full p-2 border border-stone-200 rounded bg-stone-50 text-sm text-stone-500 font-medium cursor-not-allowed" />
                 </div>
                 <p className="text-[10px] text-stone-400 italic">* Bu bilgileri Profil ayarlarınızdan güncelleyebilirsiniz.</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
               <h3 className="font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2">Müşteri & Tarih</h3>
               <div className="space-y-4">
                 <div><label className="block text-xs font-bold text-stone-600 mb-1 uppercase">Müşteri Adı</label><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-brand outline-none text-sm text-stone-900 font-medium" /></div>
                 <div><label className="block text-xs font-bold text-stone-600 mb-1 uppercase">Geçerlilik Tarihi</label><input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-brand outline-none text-sm text-stone-900 font-medium" /></div>
                 <div><label className="block text-xs font-bold text-stone-600 mb-1 uppercase">Genel Notlar</label><textarea rows={3} value={globalNotes} onChange={(e) => setGlobalNotes(e.target.value)} className="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-brand outline-none text-sm text-stone-900"></textarea></div>
               </div>
            </div>
            <div className="bg-brand-dark text-stone-100 p-6 rounded-xl shadow-lg">
               <div className="text-center"><p className="text-brand-light text-sm mb-1 uppercase tracking-wider">Toplam Tutar</p><p className="text-3xl font-serif font-bold">{calculateTotal().toLocaleString('tr-TR')} ₺</p></div>
               <button onClick={handleShowPreview} className="w-full mt-6 bg-white text-brand-dark hover:bg-brand-light font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"><Check size={18} /> Önizlemeyi Görüntüle</button>
            </div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 relative z-40">
               <label className="block text-xs font-bold text-stone-600 mb-2">Hızlı Arsa Ekle</label>
               <div className="relative">
                 <Search className="absolute left-3 top-3.5 text-stone-400" size={20} />
                 <input type="text" placeholder="İlçe, Mahalle veya Fiyat ile arsa arayın..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-10 p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-stone-900 placeholder-stone-400 font-medium transition-all shadow-sm" />
                 {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-600"><Plus size={20} className="rotate-45" /></button>}
                 {searchTerm && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-100 max-h-80 overflow-y-auto overflow-x-hidden z-50">
                     {filteredLands.length === 0 ? <div className="p-4 text-center text-stone-500 text-sm">Sonuç bulunamadı.</div> : (
                       <ul>
                         {filteredLands.map(l => {
                           const locParts = l.location.split(',').map(s => s.trim());
                           const formattedLoc = locParts.length >= 3 ? `${locParts[2]} / ${locParts[1]} / ${locParts[0]}` : l.location;
                           return (
                             <li key={l.id} onClick={() => addItemToProposal(l)} className="p-4 hover:bg-brand-light cursor-pointer border-b border-stone-50 last:border-0 transition-colors group">
                               <div className="flex justify-between items-center">
                                 <div>
                                   <div className="font-bold text-stone-800 group-hover:text-brand-dark flex items-center gap-2">
                                     {formattedLoc}
                                     {l.installment && <BadgePercent size={14} className="text-brand" />}
                                   </div>
                                   <div className="text-xs text-stone-500">{l.title}</div>
                                 </div>
                                 <div className="text-brand-dark font-bold bg-brand-light px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap">
                                   {l.price.toLocaleString()} ₺
                                 </div>
                               </div>
                             </li>
                           );
                         })}
                       </ul>
                     )}
                   </div>
                 )}
               </div>
            </div>
            {proposalItems.length === 0 ? (<div className="text-center py-12 text-stone-400 bg-stone-100 rounded-xl border-2 border-dashed border-stone-300"><FileText size={48} className="mx-auto mb-3 opacity-50" /><p className="text-stone-600 font-medium">Henüz teklife arsa eklenmedi.</p></div>) : (
              <div className="space-y-4">
                {proposalItems.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 relative group">
                    <button onClick={() => removeItem(index)} className="absolute top-4 right-4 text-stone-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                    <button onClick={() => clearOptions(index)} className="absolute top-4 right-12 text-stone-300 hover:text-orange-500 transition-colors mr-2" title="Seçenekleri Sıfırla"><RefreshCcw size={20} /></button>
                    <div className="flex gap-4 mb-6">
                       <img src={item.land.imageUrl} className="w-20 h-20 object-cover rounded-lg" alt="" />
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-bold text-stone-900 text-lg">{item.land.title}</h4>
                           {item.land.installment ? (
                             <span className="bg-brand-light text-brand-dark text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                               <BadgePercent size={12} /> Taksitli
                             </span>
                           ) : (
                             <span className="bg-stone-100 text-stone-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                               Sadece Peşin
                             </span>
                           )}
                         </div>
                         <p className="text-stone-600 text-sm font-medium">{item.land.location} | {item.land.size}</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div><label className="block text-xs font-bold text-stone-600 mb-1">Peşin Fiyat (TL)</label><input type="number" value={item.cashPrice || ''} onChange={(e) => updateItem(index, 'cashPrice', parseFloat(e.target.value))} className="w-full p-2 border border-stone-300 rounded outline-none font-bold text-brand-dark bg-stone-50" /></div>
                      <div><label className="block text-xs font-bold text-stone-600 mb-1">Alan (m²)</label><input type="text" value={item.area} onChange={(e) => updateItem(index, 'area', e.target.value)} className="w-full p-2 border border-stone-300 rounded outline-none text-stone-900 bg-white" /></div>
                      <div><label className="block text-xs font-bold text-stone-600 mb-1">Ada</label><input type="text" value={item.ada} onChange={(e) => updateItem(index, 'ada', e.target.value)} className="w-full p-2 border border-stone-300 rounded outline-none text-stone-900 bg-white" /></div>
                      <div><label className="block text-xs font-bold text-stone-600 mb-1">Parsel</label><input type="text" value={item.parsel} onChange={(e) => updateItem(index, 'parsel', e.target.value)} className="w-full p-2 border border-stone-300 rounded outline-none text-stone-900 bg-white" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50 p-4 rounded-lg border border-stone-100">
                      <div>
                        <h5 className="font-bold text-brand-dark text-sm mb-3 border-b border-brand/10 pb-1">Seçenek 1 (Vadeli)</h5>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="col-span-2"><label className="block text-[10px] font-bold text-stone-500 mb-1">Satış Fiyatı (TL)</label><input type="number" value={item.option1.price || ''} onChange={(e) => updateItem(index, 'option1.price', parseFloat(e.target.value))} className="w-full p-2 border border-stone-200 rounded text-sm outline-none font-bold text-brand" /></div>
                          <div><label className="block text-[10px] font-bold text-stone-500 mb-1">Peşinat (TL)</label><input type="number" value={item.option1.downPayment || ''} onChange={(e) => updateItem(index, 'option1.downPayment', parseFloat(e.target.value))} className="w-full p-2 border border-stone-200 rounded text-sm outline-none font-bold text-stone-900 placeholder-stone-300" /></div>
                          <div><label className="block text-[10px] font-bold text-stone-500 mb-1">Taksit</label><input type="number" min="1" value={item.option1.installmentCount || ''} onChange={(e) => updateItem(index, 'option1.installmentCount', parseInt(e.target.value))} className="w-full p-2 border border-stone-200 rounded text-sm outline-none font-bold text-stone-900 placeholder-stone-300" /></div>
                        </div>
                        {item.option1.installmentCount > 1 && (<div className="mt-2 text-xs text-brand-dark flex items-center gap-1"><Calculator size={12} /><strong>{calculateMonthly(item.option1.price, item.option1.downPayment, item.option1.installmentCount).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺/ay</strong></div>)}
                      </div>
                      <div>
                        <h5 className="font-bold text-emerald-800 text-sm mb-3 border-b border-emerald-100 pb-1">Seçenek 2 (Vadeli)</h5>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="col-span-2"><label className="block text-[10px] font-bold text-stone-500 mb-1">Satış Fiyatı (TL)</label><input type="number" value={item.option2.price || ''} onChange={(e) => updateItem(index, 'option2.price', parseFloat(e.target.value))} className="w-full p-2 border border-stone-200 rounded text-sm outline-none font-bold text-emerald-900 placeholder-stone-300" /></div>
                          <div><label className="block text-[10px] font-bold text-stone-500 mb-1">Peşinat (TL)</label><input type="number" value={item.option2.downPayment || ''} onChange={(e) => updateItem(index, 'option2.downPayment', parseFloat(e.target.value))} className="w-full p-2 border border-stone-200 rounded text-sm outline-none font-bold text-stone-900 placeholder-stone-300" /></div>
                          <div><label className="block text-[10px] font-bold text-stone-500 mb-1">Taksit</label><input type="number" min="1" value={item.option2.installmentCount || ''} onChange={(e) => updateItem(index, 'option2.installmentCount', parseInt(e.target.value))} className="w-full p-2 border border-stone-200 rounded text-sm outline-none font-bold text-stone-900 placeholder-stone-300" /></div>
                        </div>
                        {item.option2.installmentCount > 1 && (<div className="mt-2 text-xs text-emerald-700 flex items-center gap-1"><Calculator size={12} /><strong>{calculateMonthly(item.option2.price, item.option2.downPayment, item.option2.installmentCount).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺/ay</strong></div>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
