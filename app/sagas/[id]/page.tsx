import SagaDetailView from '@/components/sagas/SagaDetailView';
import { getSagaDetails } from '@/lib/sagas/server';
import { notFound } from 'next/navigation';

type SagaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SagaDetailPage({ params }: SagaDetailPageProps) {
  const { id } = await params;
  let saga;

  try {
    saga = await getSagaDetails(id);
  } catch {
    notFound();
  }

  return <SagaDetailView saga={saga} />;
}
