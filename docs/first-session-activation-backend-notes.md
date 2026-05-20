# First-session activation backend notes

The frontend now guides a new learner through this loop:

1. Pick a tiny starter deck or generate five AI cards.
2. Study the five cards in the guided flow.
3. Submit a normal study session so feed progress, recommendations, and streak data can update.

Backend additions that would make this flow stronger:

## Pre-seeded starter decks

- Store starter decks as server-owned templates with stable ids, versioned cards, categories, locale, difficulty, and tags.
- Return a curated starter set from an endpoint such as `GET /activation/starter-decks`, personalized by onboarding goals when available.
- When a user picks a starter, either copy the template into their account or enroll them in the template without duplicating cards. Copying is simpler for editing; enrollment is better for shared updates and analytics.
- Keep starter decks private to the user after copy unless they explicitly publish.

## Activation state

- Add durable user fields such as `hasCompletedFirstSession`, `firstSessionCompletedAtUtc`, `activationDeckId`, and `activationSource` (`starter`, `ai`, `skip`).
- Make first-session creation idempotent with an activation session id so refreshes or double-clicks do not create duplicate starter decks.
- Consider a single endpoint like `POST /activation/starter-decks/{templateId}/start` that creates/enrolls the deck and returns exactly five study-ready cards with card ids.

## Streak and daily goal semantics

- Decide whether the first five-card session should start a streak even when the user's daily goal is higher than five cards.
- If the streak requires daily goal completion, return explicit feed metrics after `POST /study-sessions`: daily progress, goal, streak state, and whether the goal was met.
- A good activation strategy is to treat the first session as a streak seed, then enforce the configured daily goal from day two onward.

## AI generation fast path

- Add a fast preset for first-session generation: five flashcards, beginner difficulty, no multiple choice unless requested, and safe/private visibility.
- Use onboarding goals, target language, native language, and daily goal to generate better prompts server-side instead of relying on local storage.
- Return `createdDeckId`, `deckVersionId`, and the first five study cards directly when the generation completes.

## Feed and recommendations

- After the first study session, make the feed prioritize the new deck in continue-studying and study recommendations.
- If a user skips activation, feed should surface the starter deck shelf again until they complete a first session.
- Track activation funnel events: onboarding completed, starter selected, AI generation started/completed, first card answered, first session saved, and first feed visit.
