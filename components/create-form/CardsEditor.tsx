import { useState } from 'react';
import { Check, HelpCircle, Layers, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import { NeoCard } from '../ui/NeoCard';
import { Label } from '../ui/Label';
import { CardChoice, CardType, DeckCard } from '@/lib/decks/types';
import { cn } from '@/lib/utils';

type CardsEditorProps = {
  cards: DeckCard[];
  setCards: (newCards: DeckCard[]) => void;
  handleCloseEditor: () => void;
  editingCardIndex: number | null;
};

function getDefaultCard(editingCardIndex: number | null, cards: DeckCard[]) {
  if (editingCardIndex === null) {
    return { type: 'flashcard' as CardType, frontText: '', backText: '', choices: [] };
  }
  return cards[editingCardIndex] || { type: 'flashcard', frontText: '', backText: '', choices: [] };
}

function getDefaultChoices(card: DeckCard): CardChoice[] {
  const existingChoices = [...(card.choices || [])]
    .sort((a, b) => a.order - b.order)
    .map((choice, index) => ({ ...choice, order: choice.order ?? index }));

  if (existingChoices.length >= 2) {
    const hasCorrectChoice = existingChoices.some((choice) => choice.isCorrect);
    return hasCorrectChoice
      ? existingChoices
      : existingChoices.map((choice, index) => ({ ...choice, isCorrect: index === 0 }));
  }

  return [
    { text: '', isCorrect: true, order: 0 },
    { text: '', isCorrect: false, order: 1 },
    { text: '', isCorrect: false, order: 2 },
    { text: '', isCorrect: false, order: 3 },
  ];
}

export default function CardsEditor({
  cards,
  setCards,
  handleCloseEditor,
  editingCardIndex,
}: CardsEditorProps) {
  const defaultData = getDefaultCard(editingCardIndex, cards);
  const isNewCard = editingCardIndex === null;

  const [cardType, setCardType] = useState<CardType>(defaultData.type ?? 'flashcard');
  const [frontText, setFrontText] = useState(defaultData.frontText);
  const [backText, setBackText] = useState(defaultData.backText);
  const [exampleSentence, setExampleSentence] = useState(defaultData.exampleSentence ?? '');
  const [choices, setChoices] = useState<CardChoice[]>(() => getDefaultChoices(defaultData));
  const trimmedFrontText = frontText.trim();
  const trimmedBackText = backText.trim();
  const filledChoices = choices
    .map((choice, index) => ({
      ...choice,
      text: choice.text.trim(),
      order: index,
    }))
    .filter((choice) => choice.text.length > 0);
  const correctFilledChoiceCount = filledChoices.filter((choice) => choice.isCorrect).length;
  const correctChoiceText = filledChoices.find((choice) => choice.isCorrect)?.text ?? '';
  const normalizedBackText =
    cardType === 'multi-choice' && !trimmedBackText ? correctChoiceText : trimmedBackText;
  const canSave =
    cardType === 'flashcard'
      ? trimmedFrontText.length > 0 && trimmedBackText.length > 0
      : trimmedFrontText.length > 0 &&
        filledChoices.length >= 2 &&
        correctFilledChoiceCount === 1 &&
        normalizedBackText.length > 0;

  function resetFields() {
    setFrontText('');
    setBackText('');
    setExampleSentence('');
    setChoices(getDefaultChoices({ frontText: '', backText: '', choices: [] }));
  }

  function markCorrectChoice(indexToMark: number) {
    setChoices((currentChoices) =>
      currentChoices.map((choice, index) => ({
        ...choice,
        isCorrect: index === indexToMark,
      }))
    );
  }

  function updateChoiceText(indexToUpdate: number, text: string) {
    setChoices((currentChoices) =>
      currentChoices.map((choice, index) =>
        index === indexToUpdate ? { ...choice, text } : choice
      )
    );
  }

  function addChoice() {
    setChoices((currentChoices) => [
      ...currentChoices,
      { text: '', isCorrect: false, order: currentChoices.length },
    ]);
  }

  function removeChoice(indexToRemove: number) {
    if (choices.length <= 2) {
      return;
    }

    const nextChoices = choices
      .filter((_, index) => index !== indexToRemove)
      .map((choice, index) => ({ ...choice, order: index }));

    if (!nextChoices.some((choice) => choice.isCorrect)) {
      nextChoices[0] = { ...nextChoices[0], isCorrect: true };
    }

    setChoices(nextChoices);
  }

  function handleSave() {
    if (!canSave) {
      return;
    }

    const nextCard: DeckCard =
      cardType === 'flashcard'
        ? {
            type: 'flashcard',
            frontText: trimmedFrontText,
            backText: trimmedBackText,
            exampleSentence: exampleSentence.trim() || null,
            choices: [],
          }
        : {
            type: 'multi-choice',
            frontText: trimmedFrontText,
            backText: normalizedBackText,
            exampleSentence: exampleSentence.trim() || null,
            choices: filledChoices,
          };

    if (isNewCard) {
      setCards([...cards, nextCard]);
    } else {
      const updatedCards = [...cards];
      updatedCards[editingCardIndex] = {
        ...updatedCards[editingCardIndex],
        ...nextCard,
      };
      setCards(updatedCards);
    }

    resetFields();
    handleCloseEditor();
  }

  return (
    <NeoCard size="sm" className="mt-4 p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h4 className="font-display text-lg font-bold">{isNewCard ? 'New Card' : 'Edit Card'}</h4>
        <button
          type="button"
          onClick={handleCloseEditor}
          aria-label="Close card editor"
          className="rounded-full p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {[
          {
            type: 'flashcard' as const,
            label: 'Flashcard',
            icon: Layers,
            activeClass: 'bg-neo-yellow',
          },
          {
            type: 'multi-choice' as const,
            label: 'Multiple Choice',
            icon: HelpCircle,
            activeClass: 'bg-neo-teal',
          },
        ].map(({ type, label, icon: Icon, activeClass }) => {
          const isActive = cardType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => setCardType(type)}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl border-[2px] p-3 font-display text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground',
                isActive
                  ? `border-foreground ${activeClass} shadow-[3px_3px_0_0_hsl(var(--foreground))]`
                  : 'border-muted-foreground/30 text-muted-foreground hover:border-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      {cardType === 'flashcard' ? (
        <div className="mb-5">
          <div className="grid gap-3 rounded-xl border-[3px] border-foreground bg-neo-yellow p-4 shadow-[4px_4px_0_0_hsl(var(--foreground))] sm:grid-cols-2">
            <div className="min-h-28 rounded-lg border-[2px] border-foreground bg-background/70 p-3">
              <span className="text-xs font-bold uppercase text-muted-foreground">Front</span>
              <p className="mt-2 line-clamp-3 font-display text-lg font-bold">
                {frontText || 'Front of card...'}
              </p>
            </div>
            <div className="min-h-28 rounded-lg border-[2px] border-foreground bg-neo-teal p-3">
              <span className="text-xs font-bold uppercase">Back</span>
              <p className="mt-2 line-clamp-3 font-display text-lg font-bold">
                {backText || 'Back of card...'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-5 rounded-xl border-[3px] border-foreground bg-neo-blue/20 p-4 shadow-[4px_4px_0_0_hsl(var(--foreground))]">
          <p className="mb-3 font-display text-lg font-bold">
            {frontText || 'Your question here...'}
          </p>
          <div className="space-y-2">
            {choices.map((choice, index) => (
              <div
                key={choice.id ?? index}
                className={cn(
                  'rounded-lg border-[2px] p-3 text-sm font-semibold',
                  choice.isCorrect
                    ? 'border-foreground bg-neo-teal shadow-[2px_2px_0_0_hsl(var(--foreground))]'
                    : 'border-muted-foreground/30 bg-background/70 text-muted-foreground'
                )}
              >
                {choice.text || `Option ${index + 1}...`}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Label className="font-display font-semibold" htmlFor="card-front-text">
          {cardType === 'flashcard' ? 'Front (Question/Term)' : 'Question'}
          <textarea
            id="card-front-text"
            value={frontText}
            className="mt-2 block w-full resize-none rounded-xl border-[2px] border-foreground bg-background px-3 py-2 font-body font-normal shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={
              cardType === 'flashcard' ? 'What appears on the front?' : 'Type your question...'
            }
            onChange={(e) => setFrontText(e.target.value)}
            rows={cardType === 'flashcard' ? 3 : 2}
            required
          />
        </Label>

        {cardType === 'multi-choice' ? (
          <div>
            <Label className="font-display font-semibold">Options</Label>
            <p className="mb-2 mt-1 text-xs text-muted-foreground">
              Select exactly one correct answer.
            </p>
            <div className="space-y-2">
              {choices.map((choice, index) => (
                <div key={choice.id ?? index} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => markCorrectChoice(index)}
                    aria-label={`Mark option ${index + 1} as correct`}
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[2px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground',
                      choice.isCorrect
                        ? 'border-foreground bg-neo-teal'
                        : 'border-muted-foreground/40 hover:border-foreground'
                    )}
                  >
                    {choice.isCorrect ? <Check className="h-4 w-4" /> : null}
                  </button>
                  <input
                    value={choice.text}
                    onChange={(e) => updateChoiceText(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="min-w-0 flex-1 rounded-xl border-[2px] border-foreground bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {choices.length > 2 ? (
                    <button
                      type="button"
                      onClick={() => removeChoice(index)}
                      aria-label={`Remove option ${index + 1}`}
                      className="rounded-lg p-2 transition-colors hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {choices.length < 6 ? (
              <button
                type="button"
                onClick={addChoice}
                className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border-[2px] border-dashed border-muted-foreground/40 p-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </button>
            ) : null}
          </div>
        ) : null}

        <Label className="font-display font-semibold" htmlFor="card-back-text">
          {cardType === 'flashcard' ? 'Back (Answer/Definition)' : 'Explanation (optional)'}
          <textarea
            id="card-back-text"
            value={backText}
            className="mt-2 block w-full resize-none rounded-xl border-[2px] border-foreground bg-background px-3 py-2 font-body font-normal shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={
              cardType === 'flashcard'
                ? 'What appears on the back?'
                : 'Why is this the correct answer?'
            }
            onChange={(e) => setBackText(e.target.value)}
            rows={cardType === 'flashcard' ? 3 : 2}
            required={cardType === 'flashcard'}
          />
        </Label>

        <Label className="font-display font-semibold" htmlFor="card-example-sentence">
          Example Sentence
          <textarea
            id="card-example-sentence"
            value={exampleSentence}
            className="mt-2 block w-full resize-none rounded-xl border-[2px] border-foreground bg-background px-3 py-2 font-body font-normal shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Add context for this card..."
            onChange={(e) => setExampleSentence(e.target.value)}
            rows={2}
          />
        </Label>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <NeoButton variant="outline" size="sm" onClick={resetFields}>
            <RotateCcw className="h-4 w-4" />
            Clear
          </NeoButton>
          <NeoButton variant="primary" size="sm" onClick={handleSave} disabled={!canSave}>
            <Check className="h-4 w-4" />
            {isNewCard ? 'Add Card' : 'Save Changes'}
          </NeoButton>
        </div>
      </div>
    </NeoCard>
  );
}
