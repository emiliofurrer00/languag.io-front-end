import { proxyAuthorizedApiRequest } from '../../../proxy-authorized';

type AiSagaGenerationRouteProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(request: Request, { params }: AiSagaGenerationRouteProps) {
  const { jobId } = await params;
  return proxyAuthorizedApiRequest(request, `/ai/saga-generations/${jobId}`, 'GET');
}
