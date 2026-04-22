import { proxyAuthorizedApiRequest } from '@/app/api/proxy-authorized';

type NotificationRouteProps = {
  params: Promise<{
    notificationId: string;
  }>;
};

export async function POST(request: Request, { params }: NotificationRouteProps) {
  const { notificationId } = await params;

  return proxyAuthorizedApiRequest(request, `/Notifications/${notificationId}/read`, 'POST', {
    includeBody: false,
  });
}
