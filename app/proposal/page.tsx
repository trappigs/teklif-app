import { Suspense } from 'react';
import { getLands, getSettings } from '@/app/actions';
import { getSessionUser } from '@/app/auth/actions';
import { redirect } from 'next/navigation';
import ProposalContent from './proposal-content';

export const dynamic = 'force-dynamic';

export default async function ProposalPage() {
  const username = await getSessionUser();
  
  if (!username) {
    redirect('/login');
  }

  const [lands, settings] = await Promise.all([
    getLands(),
    getSettings(username)
  ]);
  
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Veriler yükleniyor...</div>}>
      <ProposalContent 
        availableLands={lands} 
        defaultSettings={settings} 
      />
    </Suspense>
  );
}