import { proxyAuthorizedApiRequest } from '@/app/api/proxy-authorized';

type FriendRouteProps = {
  params: Promise<{
    friendUserId: string;
  }>;
};

export async function DELETE(request: Request, { params }: FriendRouteProps) {
  const { friendUserId } = await params;

  return proxyAuthorizedApiRequest(request, `/Friends/${friendUserId}`, 'DELETE');
}
