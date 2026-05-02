import { proxyAuthorizedApiRequest } from '../../../proxy-authorized';

type AiDeckGenerationRouteProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(request: Request, { params }: AiDeckGenerationRouteProps) {
  const { jobId } = await params;
  return proxyAuthorizedApiRequest(request, `/ai/deck-generations/${jobId}`, 'GET');
}
