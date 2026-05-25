import { proxyAuthorizedApiRequest } from '@/app/api/proxy-authorized';

type StudySessionRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: StudySessionRouteProps) {
  const { id } = await params;
  return proxyAuthorizedApiRequest(request, `/decks/${id}/study-sessions`, 'POST');
}
