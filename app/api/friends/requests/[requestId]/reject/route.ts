import { proxyAuthorizedApiRequest } from '@/app/api/proxy-authorized';

type FriendRequestRouteProps = {
  params: Promise<{
    requestId: string;
  }>;
};

export async function POST(request: Request, { params }: FriendRequestRouteProps) {
  const { requestId } = await params;

  return proxyAuthorizedApiRequest(request, `/Friends/requests/${requestId}/reject`, 'POST', {
    includeBody: false,
  });
}
