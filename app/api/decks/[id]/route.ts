import { proxyAuthorizedDeckWrite } from '../proxy';

type DeckRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: DeckRouteProps) {
  const { id } = await params;
  return proxyAuthorizedDeckWrite(request, `/decks/${id}`, 'PUT');
}
