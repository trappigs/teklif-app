import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-stone-50 py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">İletişime Geçin</h1>
          <p className="text-xl text-stone-600">
            Hayalinizdeki arsa için sorularınızı yanıtlamaya hazırız.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Info Side */}
          <div className="bg-brand-dark text-stone-100 p-12 flex flex-col justify-between relative overflow-hidden">
             {/* Decor */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand/30 rounded-bl-full -z-0" />
             
             <div className="relative z-10 space-y-8">
               <h2 className="text-2xl font-serif font-bold mb-6">İletişim Bilgileri</h2>
               
               <div className="flex items-start gap-4">
                 <MapPin className="text-brand-light mt-1" />
                 <div>
                   <h3 className="font-bold text-white mb-1">Adres</h3>
                   <p className="text-stone-200 leading-relaxed">
                     Plaza 34, Levent Mah. Büyükdere Cad.<br />
                     No: 123, Kat: 5<br />
                     34394 Şişli/İstanbul
                   </p>
                 </div>
               </div>

               <div className="flex items-center gap-4">
                 <Phone className="text-brand-light" />
                 <div>
                   <h3 className="font-bold text-white mb-1">Telefon</h3>
                   <p className="text-stone-200">+90 (212) 555 0123</p>
                 </div>
               </div>

               <div className="flex items-center gap-4">
                 <Mail className="text-brand-light" />
                 <div>
                   <h3 className="font-bold text-white mb-1">E-Posta</h3>
                   <p className="text-stone-200">bilgi@bereketlitopraklar.com</p>
                 </div>
               </div>
             </div>

             <div className="relative z-10 mt-12">
               <div className="bg-brand/20 p-6 rounded-xl border border-brand/30">
                 <p className="italic">"Doğru zamanda, doğru yerde, doğru yatırım."</p>
               </div>
             </div>
          </div>

          {/* Form Side */}
          <div className="p-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Mesaj Gönderin</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Adınız</label>
                  <input type="text" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand outline-none text-stone-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Soyadınız</label>
                  <input type="text" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand outline-none text-stone-900" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">E-Posta Adresiniz</label>
                <input type="email" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand outline-none text-stone-900" />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Mesajınız</label>
                <textarea rows={4} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand outline-none text-stone-900"></textarea>
              </div>

              <button type="button" className="w-full bg-brand-dark hover:bg-brand text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg">
                Gönder <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
