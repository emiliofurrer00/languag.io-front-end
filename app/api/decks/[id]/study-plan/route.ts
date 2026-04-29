import { proxyAuthorizedApiRequest } from '../../../proxy-authorized';

type StudyPlanRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: StudyPlanRouteProps) {
  const { id } = await params;
  return proxyAuthorizedApiRequest(request, `/decks/${id}/study-plan`, 'GET', {
    forwardQuery: true,
  });
}
