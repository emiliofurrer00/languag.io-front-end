import { getNeoColorClass, NEO_COLOR_CLASSES, NeoColor } from '@/lib/theme/neo-colors';
import { Saga, SagaDisplayMeta, SagaLesson } from './types';

const FALLBACK_EMOJIS: Record<NeoColor, string> = {
  teal: '🧠',
  blue: '🌍',
  coral: '🌶️',
  magenta: '🎨',
  yellow: '⚡',
};

function firstGrapheme(value: string) {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    const segment = segmenter.segment(value)[Symbol.iterator]().next().value;
    return segment?.segment ?? '';
  }

  return Array.from(value)[0] ?? '';
}

function looksLikeEmoji(value: string) {
  return Boolean(value) && !/^[a-z0-9]$/i.test(value);
}

export function normalizeSagaColor(color: string | null | undefined): NeoColor {
  if (color && color in NEO_COLOR_CLASSES) {
    return color as NeoColor;
  }

  return 'teal';
}

export function getSagaDisplayMeta(saga: Pick<Saga, 'category' | 'color'>): SagaDisplayMeta {
  const color = normalizeSagaColor(saga.color);
  const rawCategory = saga.category?.trim() ?? '';
  const possibleEmoji = firstGrapheme(rawCategory);
  const hasEmoji = looksLikeEmoji(possibleEmoji);
  const tagline = hasEmoji ? rawCategory.slice(possibleEmoji.length).trim() : rawCategory;

  return {
    emoji: hasEmoji ? possibleEmoji : FALLBACK_EMOJIS[color],
    tagline: tagline || 'Ordered deck journey',
    color,
  };
}

export function buildSagaCategoryValue(emoji: string, tagline: string) {
  return `${emoji.trim()} ${tagline.trim() || 'Saga'}`.trim().slice(0, 80);
}

export function getSagaColorClass(color: string | null | undefined) {
  return getNeoColorClass(color, 'teal');
}

export function getLessonTitle(lesson: SagaLesson) {
  return lesson.title?.trim() || lesson.deckTitle || 'Untitled lesson';
}

export function getLessonXp(lesson: Pick<SagaLesson, 'cardCount'>) {
  return Math.max(80, Math.round((lesson.cardCount || 0) * 5));
}

export function getSagaLessonCount(saga: Pick<Saga, 'chapters'>) {
  return saga.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
}

export function getSagaTotalXp(saga: Pick<Saga, 'chapters'>) {
  return saga.chapters.reduce(
    (total, chapter) =>
      total + chapter.lessons.reduce((lessonTotal, lesson) => lessonTotal + getLessonXp(lesson), 0),
    0
  );
}

export function getSagaEarnedXp(saga: Saga) {
  let lessonIndex = 0;
  let total = 0;

  for (const chapter of saga.chapters) {
    for (const lesson of chapter.lessons) {
      if (lessonIndex < saga.progress.completedLessonCount) {
        total += getLessonXp(lesson);
      }

      lessonIndex += 1;
    }
  }

  return total;
}

