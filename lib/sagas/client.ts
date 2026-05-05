import { apiFetch } from '@/lib/api';
import { buildSagaCategoryValue } from './display';
import { CreateSagaInput, CreateSagaResult, SagaProgress } from './types';

export async function createSaga(input: CreateSagaInput) {
  return apiFetch<CreateSagaResult>('/api/sagas', {
    method: 'POST',
    body: JSON.stringify({
      title: input.title,
      description: input.description,
      category: buildSagaCategoryValue(input.emoji, input.tagline ?? ''),
      color: input.color,
      visibility: input.visibility,
      chapters: input.chapters,
    }),
    useApiBaseUrl: false,
  });
}

export async function completeSagaLesson(sagaId: string, lessonId: string) {
  return apiFetch<SagaProgress>(`/api/sagas/${sagaId}/lessons/${lessonId}/complete`, {
    method: 'POST',
    useApiBaseUrl: false,
  });
}

