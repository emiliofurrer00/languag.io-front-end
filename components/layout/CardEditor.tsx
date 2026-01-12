'use client';

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import Container from './GenericContainer';
import CreateCardButton from './CreateCard';

type CardData = {
  title: string;
  answer: string;
  category: string;
};

type CardEditorContextType = {
  cardData: CardData | null;
  setCardData: Dispatch<SetStateAction<CardData | null>>;
};

const CardEditorContext = createContext<CardEditorContextType | null>(null);

function EditorContainer({
  children,
  defaultCardData,
}: {
  children: React.ReactNode;
  defaultCardData: CardData | null;
}) {
  const [cardData, setCardData] = useState<CardData | null>(defaultCardData);
  return (
    <CardEditorContext.Provider value={{ cardData, setCardData }}>
      <Container className="p-8">
        <div className="flex flex-col gap-3">{children}</div>
      </Container>
    </CardEditorContext.Provider>
  );
}

function Title() {
  const context = useContext(CardEditorContext);

  if (!context) {
    throw new Error('CardEditor.Title must be used within CardEditor.Container');
  }

  const { cardData, setCardData } = context;

  function handleTitleChange(newTitle: string) {
    if (cardData) {
      setCardData({ ...cardData, title: newTitle });
    } else {
      setCardData({ title: newTitle, answer: '', category: '' });
    }
  }

  return (
    <div className="flex flex-col gap-2">
      Question
      <input
        value={cardData?.title || ''}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="border-t border-l border-r-2 border-b-2 rounded-[8] py-2 px-3"
        placeholder="e.g. What is the capital of France?"
      />
    </div>
  );
}

function Answer() {
  const context = useContext(CardEditorContext);

  if (!context) {
    throw new Error('CardEditor.Answer must be used within CardEditor.Container');
  }

  const { cardData, setCardData } = context;

  function handleAnswerChange(newAnswer: string) {
    if (cardData) {
      setCardData({ ...cardData, answer: newAnswer });
    }
  }
  return (
    <div className="flex flex-col gap-2">
      Answer
      <textarea
        value={cardData?.answer || ''}
        onChange={(e) => handleAnswerChange(e.target.value)}
        className="border-t border-l border-r-2 border-b-2 rounded-[8] py-2 px-3"
        placeholder="e.g. Paris"
      />
    </div>
  );
}

function Category() {
  const context = useContext(CardEditorContext);

  if (!context) {
    throw new Error('CardEditor.Category must be used within CardEditor.Container');
  }

  const { cardData, setCardData } = context;

  function handleCategoryChange(newCategory: string) {
    if (cardData) {
      setCardData({ ...cardData, category: newCategory });
    }
  }
  return (
    <div className="flex flex-col gap-2">
      Category
      <input
        value={cardData?.category || ''}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="border-t border-l border-r-2 border-b-2 rounded-[8] py-2 px-3"
        placeholder="e.g. Geography"
      />
    </div>
  );
}

function Actions() {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <CreateCardButton />
    </div>
  );
}

export { EditorContainer, Title, Answer, Category, Actions };
