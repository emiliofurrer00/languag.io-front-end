import { proxyAuthorizedApiRequest } from '@/app/api/proxy-authorized';

type FriendshipStatusRouteProps = {
  params: Promise<{
    otherUserId: string;
  }>;
};

export async function GET(request: Request, { params }: FriendshipStatusRouteProps) {
  const { otherUserId } = await params;

  return proxyAuthorizedApiRequest(request, `/Friends/status/${otherUserId}`, 'GET');
}
