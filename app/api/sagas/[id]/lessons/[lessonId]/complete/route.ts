import { proxyAuthorizedApiRequest } from '@/app/api/proxy-authorized';

type CompleteSagaLessonRouteContext = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export async function POST(request: Request, { params }: CompleteSagaLessonRouteContext) {
  const { id, lessonId } = await params;
  return proxyAuthorizedApiRequest(request, `/sagas/${id}/lessons/${lessonId}/complete`, 'POST', {
    includeBody: false,
  });
}

