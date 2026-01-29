'use client';

import { useState, useEffect } from 'react';
import { getLands, addLand, updateLand, deleteLand, getProposals, getSettings, saveSettings } from '@/app/actions';
import { logout, getSessionUser } from '@/app/auth/actions'; // getSessionUser added
import { Land, Proposal, Settings } from '@/types';
import { Trash2, Edit, Plus, Save, X, Lock, LogOut, FileText, Map, ExternalLink, Search, UserCircle, Phone, Briefcase, Image as ImageIcon, Download, BadgePercent, Check } from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'lands' | 'proposals' | 'profile'>('lands');
  const [username, setUsername] = useState<string | null>(null);
  
  const [lands, setLands] = useState<Land[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [settings, setSettings] = useState<Settings>({ senderName: '', senderTitle: '', senderPhone: '', senderImage: '' });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  // Lazy Load & Search State
  const [landSearch, setLandSearch] = useState('');
  const [landLimit, setLandLimit] = useState(10);
  const [hasMoreLands, setHasMoreLands] = useState(true);
  
  // Installment Filter
  const [showOnlyInstallment, setShowOnlyInstallment] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentLand, setCurrentLand] = useState<Partial<Land>>({});

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (activeTab === 'lands') loadLands();
  }, [landSearch, landLimit, activeTab, showOnlyInstallment]);

  const init = async () => {
    const user = await getSessionUser();
    if (user) {
      setUsername(user);
      const settingsData = await getSettings(user);
      setSettings(settingsData);
      loadProposals(user);
    }
  };

  const loadLands = async () => {
    const data = await getLands(landSearch, landLimit + 1, showOnlyInstallment);
    if (data.length > landLimit) {
      setLands(data.slice(0, landLimit));
      setHasMoreLands(true);
    } else {
      setLands(data);
      setHasMoreLands(false);
    }
  };

  const loadProposals = async (user: string) => {
    const proposalsData = await getProposals(user); // Filter by user
    setProposals(proposalsData.reverse());
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleExport = () => {
    // Flatten proposals data for Excel
    const exportData = proposals.flatMap(p => 
      p.items.map(item => ({
        'Teklif ID': p.id,
        'Oluşturulma Tarihi': new Date(p.createdAt).toLocaleDateString('tr-TR'),
        'Geçerlilik Tarihi': new Date(p.validUntil).toLocaleDateString('tr-TR'),
        'Müşteri Adı': p.customerName,
        'Oluşturan Uzman': p.createdBy,
        'Hazırlayan İsim': p.senderName,
        'Arsa Başlık': item.land.title,
        'Konum': item.land.location,
        'Ada': item.ada,
        'Parsel': item.parsel,
        'Alan (m2)': item.area,
        'Peşin Fiyat (TL)': item.cashPrice,
        'Seçenek 1 Fiyat (TL)': item.option1.price,
        'Seçenek 1 Peşinat (TL)': item.option1.downPayment,
        'Seçenek 1 Taksit (Ay)': item.option1.installmentCount,
        'Seçenek 2 Fiyat (TL)': item.option2.price,
        'Seçenek 2 Peşinat (TL)': item.option2.downPayment,
        'Seçenek 2 Taksit (Ay)': item.option2.installmentCount,
        'Genel Notlar': p.globalNotes
      }))
    );

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teklifler");
    
    // Auto-width for columns
    const wscols = Object.keys(exportData[0] || {}).map(k => ({ wch: 20 }));
    ws['!cols'] = wscols;

    XLSX.writeFile(wb, `Teklifler_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setIsSavingSettings(true);
    try {
      await saveSettings(username, settings);
      alert('Profil bilgileriniz başarıyla güncellendi.');
    } catch (error) {
      alert('Ayarlar kaydedilirken bir hata oluştu.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu arsayı silmek istediğinize emin misiniz?')) {
      await deleteLand(id);
      loadLands();
    }
  };

  const handleEdit = (land: Land) => {
    setCurrentLand(land);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentLand({ title: '', location: '', size: '', price: 0, imageUrl: '', description: '', features: [], ada: '', parsel: '', installment: false });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!currentLand.title) return alert('Başlık zorunludur');
    if (currentLand.id) {
      await updateLand(currentLand as Land);
    } else {
      await addLand(currentLand as Omit<Land, 'id'>);
    }
    setIsEditing(false);
    loadLands();
  };

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="flex items-center gap-3">
               <img src="/logo.webp" alt="Logo" className="w-10 h-10 object-contain" />
               <h1 className="text-3xl font-serif font-bold text-brand-dark">Yönetim Paneli</h1>
             </div>
             <div className="flex bg-white rounded-lg p-1 border border-stone-200 shadow-sm overflow-x-auto">
               <button onClick={() => setActiveTab('lands')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${activeTab === 'lands' ? 'bg-brand text-white shadow-md' : 'text-stone-500 hover:text-brand-dark'}`}><Map size={16} /> Arsalar</button>
               <button onClick={() => setActiveTab('proposals')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${activeTab === 'proposals' ? 'bg-brand text-white shadow-md' : 'text-stone-500 hover:text-brand-dark'}`}><FileText size={16} /> Tekliflerim</button>
               <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${activeTab === 'profile' ? 'bg-brand text-white shadow-md' : 'text-stone-500 hover:text-brand-dark'}`}><UserCircle size={16} /> Profil</button>
             </div>
          </div>
          
          <div className="flex gap-3">
            {activeTab === 'lands' && (
              <button onClick={handleAddNew} className="bg-brand text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-hover transition-colors shadow-sm">
                <Plus size={20} /> Yeni Arsa
              </button>
            )}
            {activeTab === 'proposals' && (
              <button onClick={handleExport} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
                <Download size={20} /> Excel'e Aktar
              </button>
            )}
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100">
               <LogOut size={16} /> Çıkış
            </button>
          </div>
        </div>

        {/* --- LANDS TAB --- */}
        {activeTab === 'lands' && (
          <>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 text-stone-400" size={20} />
                <input type="text" placeholder="Arsa adına veya konumuna göre ara..." value={landSearch} onChange={(e) => { setLandSearch(e.target.value); setLandLimit(10); }} className="w-full pl-10 p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand outline-none text-stone-900 bg-white shadow-sm font-medium" />
              </div>
              <button 
                onClick={() => setShowOnlyInstallment(!showOnlyInstallment)}
                className={`px-4 py-3 rounded-xl border font-bold flex items-center gap-2 transition-all whitespace-nowrap ${showOnlyInstallment ? 'bg-brand-light border-brand text-brand-dark' : 'bg-white border-stone-200 text-stone-500 hover:border-brand-light'}`}
              >
                {showOnlyInstallment ? <Check size={18} /> : <BadgePercent size={18} />}
                Sadece Taksitliler
              </button>
            </div>

            {isEditing && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold">{currentLand.id ? 'Arsayı Düzenle' : 'Yeni Arsa Ekle'}</h2>
                    <button onClick={() => setIsEditing(false)}><X size={24} className="text-stone-400 hover:text-red-500" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><label className="block text-xs font-bold text-stone-500 mb-1">Başlık</label><input className="w-full p-2 border rounded text-stone-900 font-medium" value={currentLand.title} onChange={e => setCurrentLand({...currentLand, title: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-stone-500 mb-1">Konum</label><input className="w-full p-2 border rounded text-stone-900 font-medium" value={currentLand.location} onChange={e => setCurrentLand({...currentLand, location: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-stone-500 mb-1">Büyüklük</label><input className="w-full p-2 border rounded text-stone-900 font-medium" value={currentLand.size} onChange={e => setCurrentLand({...currentLand, size: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-stone-500 mb-1">Fiyat (TL)</label><input type="number" className="w-full p-2 border rounded text-stone-900 font-medium" value={currentLand.price} onChange={e => setCurrentLand({...currentLand, price: Number(e.target.value)})} /></div>
                    <div className="col-span-2 flex items-center gap-3 bg-stone-50 p-3 rounded-lg border border-stone-200">
                      <input 
                        type="checkbox" 
                        id="installment" 
                        checked={currentLand.installment || false} 
                        onChange={e => setCurrentLand({...currentLand, installment: e.target.checked})} 
                        className="w-5 h-5 text-brand rounded focus:ring-brand border-gray-300"
                      />
                      <label htmlFor="installment" className="text-sm font-bold text-stone-700 cursor-pointer select-none">Bu arsa için Taksit İmkanı sunuluyor</label>
                    </div>
                    <div><label className="block text-xs font-bold text-stone-500 mb-1">Görsel URL</label><input className="w-full p-2 border rounded text-stone-900 font-medium" value={currentLand.imageUrl} onChange={e => setCurrentLand({...currentLand, imageUrl: e.target.value})} />
                      {currentLand.imageUrl && (<div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden border border-stone-200"><img src={currentLand.imageUrl} alt="Önizleme" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Gorsel+Yok'; }} /></div>)}
                    </div>
                    <div><label className="block text-xs font-bold text-stone-500 mb-1">Ada</label><input className="w-full p-2 border rounded text-stone-900 font-medium" value={currentLand.ada || ''} onChange={e => setCurrentLand({...currentLand, ada: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-stone-500 mb-1">Parsel</label><input className="w-full p-2 border rounded text-stone-900 font-medium" value={currentLand.parsel || ''} onChange={e => setCurrentLand({...currentLand, parsel: e.target.value})} /></div>
                    <div className="col-span-2"><label className="block text-xs font-bold text-stone-500 mb-1">Açıklama</label><textarea rows={3} className="w-full p-2 border rounded text-stone-900 font-medium" value={currentLand.description} onChange={e => setCurrentLand({...currentLand, description: e.target.value})} /></div>
                    <div className="col-span-2"><label className="block text-xs font-bold text-stone-500 mb-1">Özellikler (Virgülle ayırın)</label><input className="w-full p-2 border rounded text-stone-900 font-medium" value={currentLand.features?.join(', ')} onChange={e => setCurrentLand({...currentLand, features: e.target.value.split(',').map(s => s.trim())})} placeholder="Deniz Manzaralı, Yolu Açık, ..." /></div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3"><button onClick={() => setIsEditing(false)} className="px-4 py-2 text-stone-500 font-bold hover:bg-stone-100 rounded-lg">İptal</button><button onClick={handleSave} className="px-6 py-2 bg-brand text-white font-bold rounded-lg hover:bg-brand-hover flex items-center gap-2 transition-all shadow-sm"><Save size={18} /> Kaydet</button></div>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {lands.map(land => (
                <div key={land.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center justify-between hover:border-brand/30 transition-colors relative overflow-hidden">
                  {land.installment && (
                    <div className="absolute top-0 right-0 bg-brand-light text-brand-dark text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1">
                      <BadgePercent size={12} /> Taksitli
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <img src={land.imageUrl} className="w-16 h-16 object-cover rounded-lg bg-stone-200" alt="" />
                    <div>
                      <h3 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                        {land.title}
                      </h3>
                      <div className="text-sm text-stone-500 flex gap-3"><span>{land.location}</span><span>•</span><span>{land.size}</span><span>•</span><span className="font-bold text-brand">{land.price.toLocaleString()} ₺</span></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(land)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={20} /></button>
                    <button onClick={() => handleDelete(land.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
              {lands.length === 0 && (<div className="text-center py-12 text-stone-400">Portföyünüz boş veya arama kriterine uygun arsa yok.</div>)}
              {hasMoreLands && (<div className="mt-8 text-center"><button onClick={() => setLandLimit(prev => prev + 10)} className="bg-white border border-stone-200 text-stone-600 px-8 py-3 rounded-xl font-bold hover:bg-stone-50 hover:border-brand/30 transition-all shadow-sm">Daha Fazla Yükle</button></div>)}
            </div>
          </>
        )}

        {/* --- PROPOSALS TAB --- */}
        {activeTab === 'proposals' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[900px]">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Müşteri</th>
                    <th className="p-4">Oluşturan</th>
                    <th className="p-4">İçerik</th>
                    <th className="p-4">Toplam Tutar</th>
                    <th className="p-4">Durum</th>
                    <th className="p-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {proposals.map(proposal => {
                    const totalAmount = proposal.items.reduce((acc, item) => acc + item.cashPrice, 0);
                    const isExpired = new Date(proposal.validUntil) < new Date();
                    const firstLand = proposal.items[0]?.land.title || 'Bilinmeyen Arsa';
                    const otherCount = proposal.items.length - 1;

                    return (
                      <tr key={proposal.id} className="hover:bg-brand-light/10 transition-colors">
                        <td className="p-4 font-bold text-stone-800">{proposal.customerName}</td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-stone-700">{proposal.senderName || proposal.createdBy}</span>
                            <span className="text-[10px] text-stone-400 uppercase">{proposal.createdBy}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-stone-800 font-medium truncate max-w-[200px]" title={firstLand}>{firstLand}</span>
                            {otherCount > 0 && <span className="text-xs text-stone-500">ve +{otherCount} diğer</span>}
                          </div>
                        </td>
                        <td className="p-4 font-serif font-bold text-brand-dark">
                          {totalAmount.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="p-4">
                          {isExpired ? (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">Süresi Doldu</span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold border border-emerald-200">Aktif</span>
                          )}
                          <div className="text-[10px] text-stone-400 mt-1">
                            {new Date(proposal.validUntil).toLocaleDateString('tr-TR')}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Link 
                            href={`/proposal/${proposal.id}`} 
                            target="_blank"
                            className="inline-flex items-center gap-2 text-brand hover:text-brand-hover font-bold hover:underline"
                          >
                            Görüntüle <ExternalLink size={14} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {proposals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-stone-400">
                        Henüz oluşturulmuş bir teklif yok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- PROFILE TAB --- */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
              <div className="bg-brand-dark p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 rounded-bl-full -z-0" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 text-brand-light border-2 border-white/20 overflow-hidden">
                    {settings.senderImage ? <img src={settings.senderImage} alt="" className="w-full h-full object-cover" /> : <UserCircle size={48} />}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-1">Profil Ayarları</h2>
                  <p className="text-brand-light/80 text-sm">{username} hesabı için bilgiler</p>
                </div>
              </div>
              <form onSubmit={handleSaveSettings} className="p-8 space-y-6">
                <div className="grid gap-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">Profil Fotoğrafı URL</label>
                    <div className="relative"><ImageIcon className="absolute left-3 top-3.5 text-stone-400" size={20} /><input type="text" value={settings.senderImage || ''} onChange={(e) => setSettings({...settings, senderImage: e.target.value})} className="w-full pl-10 p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-stone-900 font-medium" placeholder="Görsel URL'si..." /></div>
                  </div>
                  <div><label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">İsim Soyisim</label><div className="relative"><UserCircle className="absolute left-3 top-3.5 text-stone-400" size={20} /><input type="text" value={settings.senderName} onChange={(e) => setSettings({...settings, senderName: e.target.value})} className="w-full pl-10 p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-stone-900 font-medium" required /></div></div>
                  <div><label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">Unvan</label><div className="relative"><Briefcase className="absolute left-3 top-3.5 text-stone-400" size={20} /><input type="text" value={settings.senderTitle} onChange={(e) => setSettings({...settings, senderTitle: e.target.value})} className="w-full pl-10 p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-stone-900 font-medium" required /></div></div>
                  <div><label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">Telefon Numarası</label><div className="relative"><Phone className="absolute left-3 top-3.5 text-stone-400" size={20} /><input type="text" value={settings.senderPhone} onChange={(e) => setSettings({...settings, senderPhone: e.target.value})} className="w-full pl-10 p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-stone-900 font-medium" required /></div></div>
                </div>
                <div className="pt-4"><button type="submit" disabled={isSavingSettings} className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">{isSavingSettings ? 'Kaydediliyor...' : <><Save size={20} /> Bilgileri Güncelle</>}</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
