import { redirect } from 'next/navigation';

export default function LegacyCreateSagaPage() {
  redirect('/sagas/create');
}

