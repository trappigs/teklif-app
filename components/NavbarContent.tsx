'use client';

import Link from 'next/link';
import { Leaf, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '@/app/auth/actions';

interface NavbarContentProps {
  isLoggedIn: boolean;
}

export default function NavbarContent({ isLoggedIn }: NavbarContentProps) {
  return (
    <nav className="bg-brand-dark text-stone-50 shadow-lg sticky top-0 z-[100]">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <img src="/logo.webp" alt="Logo" className="h-12 w-auto object-contain" />
        </Link>
        
        {/* Menu Links - Only for Logged In Users */}
        {isLoggedIn && (
          <div className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-wider">
            <Link href="/" className="hover:text-brand transition-colors duration-300">Ana Sayfa</Link>
            <Link href="/portfolio" className="hover:text-brand transition-colors duration-300">Portföy</Link>
            <Link href="/proposal" className="hover:text-brand transition-colors duration-300">Teklif Hazırla</Link>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/admin" className="hidden md:flex items-center gap-2 text-sm font-bold text-stone-300 hover:text-white transition-colors">
                <LayoutDashboard size={18} /> Admin
              </Link>
              <button 
                onClick={() => logout()} 
                className="flex items-center gap-2 border border-stone-600 text-stone-300 px-4 py-2 rounded-full hover:bg-stone-800 hover:text-white transition-all duration-300 text-xs font-bold"
              >
                <LogOut size={16} /> Çıkış
              </button>
            </>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-2 rounded-full transition-all duration-300 text-sm font-bold shadow-md"
            >
              <LogIn size={18} /> Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
