'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const AUTH_COOKIE = 'session_token';

export async function login(username: string, password: string) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password) // In production, verify hash here!
      .single();

    if (user) {
      const cookieStore = await cookies();
      
      cookieStore.set(AUTH_COOKIE, user.username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      
      return { success: true };
    }
  } catch (error) {
    console.error('Login error:', error);
  }
  
  return { success: false, message: 'Hatalı kullanıcı adı veya şifre!' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect('/login');
}

export async function getSessionUser(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value || null;
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has(AUTH_COOKIE);
}
