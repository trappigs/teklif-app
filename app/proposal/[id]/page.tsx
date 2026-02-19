import { getProposal } from '@/app/actions';
import { notFound } from 'next/navigation';
import ProposalView from './proposal-view';

export const dynamic = 'force-dynamic';

export default async function SharedProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let proposal;

  try {
    proposal = await getProposal(id);
  } catch (error) {
    console.error("Proposal fetch error:", error);
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <h2 className="text-xl font-bold text-stone-800 mb-2">Sistemsel Bir Hata Oluştu</h2>
          <p className="text-stone-500 mb-6">Teklif detayları şu an görüntülenemiyor. Lütfen daha sonra tekrar deneyiniz.</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    notFound();
  }

  return <ProposalView proposal={proposal} />;
}