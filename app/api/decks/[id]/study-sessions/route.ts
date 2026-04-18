import { proxyAuthorizedDeckWrite } from '../../proxy';

type StudySessionRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: StudySessionRouteProps) {
  const { id } = await params;
  return proxyAuthorizedDeckWrite(request, `/decks/${id}/study-sessions`, 'POST');
}
