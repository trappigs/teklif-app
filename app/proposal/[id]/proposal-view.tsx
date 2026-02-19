'use client';

import { Proposal } from '@/types';
import { Check, FileCheck, ShieldCheck, Map, Footprints, Gem, User, Phone } from 'lucide-react';

interface ProposalViewProps {
    proposal: Proposal;
}

export default function ProposalView({ proposal }: ProposalViewProps) {
    const calculateMonthly = (price: number, down: number, count: number) => {
        if (!price || !count || count <= 1) return 0;
        return (price - (down || 0)) / count;
    };

    const calculateTotal = () => {
        return proposal.items?.reduce((acc, item) => acc + (item.cashPrice || 0), 0) || 0;
    };

    return (
        <div className="min-h-screen bg-stone-100 py-8 md:py-12 print:py-0 print:bg-white text-black flex justify-center print:block">
            {/* Proposal Document */}
            <div className="max-w-[210mm] w-full bg-white shadow-2xl print:shadow-none print:w-full min-h-[297mm] p-6 md:p-12 relative overflow-hidden text-black text-[14px] print:p-8">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/30 rounded-bl-full -z-0 opacity-50 print:opacity-30" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-50 rounded-tr-full -z-0 opacity-50 print:opacity-30" />

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 relative z-10 border-b-2 border-brand/10 pb-6 gap-4 md:gap-0 print:flex-row print:items-end">
                    <div>
                        <div className="flex flex-row items-center gap-4 mb-2">
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
                    <div className="text-left md:text-right w-full md:w-auto print:text-right">
                        <h2 className="text-3xl md:text-4xl font-light text-black tracking-tighter">PORTFÖY TEKLİFİ</h2>
                        <p className="text-brand font-bold mt-1 text-base md:text-lg">#{proposal.id}</p>
                    </div>
                </header>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10 mb-10 border-b border-stone-100 pb-10 print:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Sayın Müşterimiz</h3>
                            <p className="text-2xl font-bold text-black border-l-4 border-brand pl-3">{proposal.customerName || 'Müşterimiz'}</p>
                        </div>
                        <div className="flex gap-10">
                            <div>
                                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Tarih</h3>
                                <p className="text-stone-800 font-bold">{proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString('tr-TR') : '-'}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Geçerlilik</h3>
                                <p className="text-stone-800 font-bold">{proposal.validUntil ? new Date(proposal.validUntil).toLocaleDateString('tr-TR') : '-'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-left md:text-right print:text-right">
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Hazırlayan</h3>
                        <p className="text-stone-900 font-bold text-xl">{proposal.senderName || 'Bereketli Topraklar A.Ş.'}</p>
                        {proposal.senderTitle && <p className="text-stone-600 text-sm">{proposal.senderTitle}</p>}
                        {proposal.senderPhone && <p className="text-stone-600 text-sm">{proposal.senderPhone}</p>}
                    </div>
                </div>

                {/* Proposals List */}
                <div className="space-y-16 relative z-10 print:space-y-12">
                    {proposal.items?.map((item, index) => {
                        const cleanDescription = (item.land?.description || "").replace(/\d+([.,]\d+)?\s*m[²2]\s*büyüklüğünde,\s*/gi, '');

                        return (
                            <div key={index} className="print-no-break">
                                <div className="flex flex-col md:flex-row gap-8 mb-8 border-b md:border-b-0 pb-8 md:pb-0 border-stone-100 last:border-0 last:pb-0 print:flex-row">
                                    <div className="w-full md:w-1/3 h-64 md:h-56 rounded-2xl overflow-hidden border border-brand-dark/20 shrink-0 shadow-sm bg-brand-dark relative flex items-center justify-center p-8">
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
                                            <h3 className="text-xl font-bold text-brand-dark">{index + 1}. {item.land?.title}</h3>
                                            <span className="bg-brand-light text-brand-dark text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">{item.land?.location}</span>
                                        </div>
                                        <p className="text-stone-800 text-sm mb-5 leading-relaxed">{cleanDescription}</p>

                                        <div className="grid grid-cols-2 gap-4 text-sm border-t border-stone-100 pt-4 mb-5">
                                            <div className="bg-stone-50 p-2 rounded-lg"><span className="text-stone-500 text-[10px] block uppercase font-bold">Alan</span> <span className="font-bold text-stone-900 text-base">{item.area} m²</span></div>
                                            <div className="bg-stone-50 p-2 rounded-lg"><span className="text-stone-500 text-[10px] block uppercase font-bold">Ada / Parsel</span> <span className="font-bold text-stone-900 text-base">{item.ada} / {item.parsel}</span></div>
                                        </div>

                                        {/* Financial Plan Table */}
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
                                                    {/* Cash Option */}
                                                    <tr className="bg-brand-light/5">
                                                        <td className="py-3 px-2 md:px-4 font-bold text-brand-dark text-[9px] md:text-sm">PEŞİN</td>
                                                        <td className="py-3 px-2 md:px-4 text-right font-bold whitespace-nowrap text-brand-dark">{(item.cashPrice || 0).toLocaleString('tr-TR')} ₺</td>
                                                        <td className="py-3 px-2 md:px-4 text-right text-stone-400">-</td>
                                                        <td className="py-3 px-2 md:px-4 text-right font-bold whitespace-nowrap text-brand-dark text-[9px] md:text-sm">-</td>
                                                    </tr>
                                                    {/* Option 1 */}
                                                    {item.option1?.price > 0 && (
                                                        <tr>
                                                            <td className="py-3 px-2 md:px-4 font-bold text-stone-700 text-[9px] md:text-sm uppercase">{item.option1.installmentCount} AY VADE</td>
                                                            <td className="py-3 px-2 md:px-4 text-right whitespace-nowrap">{item.option1.price.toLocaleString('tr-TR')} ₺</td>
                                                            <td className="py-3 px-2 md:px-4 text-right whitespace-nowrap">{item.option1.downPayment.toLocaleString('tr-TR')} ₺</td>
                                                            <td className="py-3 px-2 md:px-4 text-right font-bold text-brand whitespace-nowrap">
                                                                {item.option1.installmentCount}x {calculateMonthly(item.option1.price, item.option1.downPayment, item.option1.installmentCount).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {/* Option 2 */}
                                                    {item.option2?.price > 0 && (
                                                        <tr>
                                                            <td className="py-3 px-2 md:px-4 font-bold text-stone-700 text-[9px] md:text-sm uppercase">{item.option2.installmentCount} AY VADE</td>
                                                            <td className="py-3 px-2 md:px-4 text-right whitespace-nowrap">{item.option2.price.toLocaleString('tr-TR')} ₺</td>
                                                            <td className="py-3 px-2 md:px-4 text-right whitespace-nowrap">{item.option2.downPayment.toLocaleString('tr-TR')} ₺</td>
                                                            <td className="py-3 px-2 md:px-4 text-right font-bold text-emerald-700 whitespace-nowrap">
                                                                {item.option2.installmentCount}x {calculateMonthly(item.option2.price, item.option2.downPayment, item.option2.installmentCount).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                                                            </td>
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

                {/* Benefits Section Removed */}

                {/* Footer Area with Consultant Card */}
                <div className="mt-12 flex flex-col md:flex-row justify-between items-end gap-8 relative z-10 break-inside-avoid">
                    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm min-w-[300px] w-full md:w-auto">
                        <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center text-stone-400 border-2 border-white shadow-inner shrink-0 overflow-hidden">
                            {proposal.senderImage ? <img src={proposal.senderImage} alt={proposal.senderName} className="w-full h-full object-cover" /> : <User size={40} />}
                        </div>
                        <div>
                            <h4 className="text-stone-900 font-bold text-lg leading-tight">{proposal.senderName || 'Bereketli Topraklar'}</h4>
                            <p className="text-brand font-medium text-[10px] uppercase tracking-wider mt-1">{proposal.senderTitle || 'Yatırım Danışmanı'}</p>
                            <div className="flex items-center gap-2 text-stone-600 mt-3 text-sm font-medium">
                                <Phone size={14} className="text-brand" />
                                <span>{proposal.senderPhone}</span>
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
                    <div>Bu belge bilgilendirme amaçlıdır. {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString('tr-TR') : ''}</div>
                    <div className="text-stone-400 italic">Bereketli Topraklar Gayrimenkul</div>
                </div>
            </div>
        </div>
    );
}
