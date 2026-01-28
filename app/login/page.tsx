'use client';

import { useState } from 'react';
import { login } from '@/app/auth/actions';
import { useRouter } from 'next/navigation';
import { Lock, Leaf, ArrowRight, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);

    if (result.success) {
      router.push('/admin');
      router.refresh();
    } else {
      setError(result.message || 'Hata oluştu');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100">
        
        <div className="bg-brand-dark p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 rounded-bl-full -z-0" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 text-brand-light">
              <Leaf size={32} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white mb-1">Bereketli Topraklar</h1>
            <p className="text-brand-light/80 text-sm">Uzman Girişi</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-stone-400" size={20} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-stone-900 transition-all"
                  placeholder="uzman1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-stone-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-stone-900 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 font-medium text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
            >
              {loading ? 'Giriş Yapılıyor...' : <>Giriş Yap <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
        
        <div className="bg-stone-50 p-4 text-center border-t border-stone-100 text-xs text-stone-400">
          Sadece yetkili Bereketli Topraklar personeli içindir.
        </div>

      </div>
    </div>
  );
}