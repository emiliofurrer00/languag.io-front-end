import { getNeoColorClass, NEO_COLOR_CLASSES, NeoColor } from '@/lib/theme/neo-colors';
import { Saga, SagaDisplayMeta, SagaLesson } from './types';

const FALLBACK_EMOJIS: Record<NeoColor, string> = {
  teal: '\u{1F9E0}',
  blue: '\u{1F30D}',
  coral: '\u{1F336}\u{FE0F}',
  magenta: '\u{1F3A8}',
  yellow: '\u{26A1}',
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

export function getSagaLessonCount(saga: Pick<Saga, 'chapters'>) {
  return saga.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
}
