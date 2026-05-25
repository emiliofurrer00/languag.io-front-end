import { proxyAuthorizedApiRequest } from '@/app/api/proxy-authorized';

type DeckRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: DeckRouteProps) {
  const { id } = await params;
  return proxyAuthorizedApiRequest(request, `/decks/${id}`, 'PUT');
}
