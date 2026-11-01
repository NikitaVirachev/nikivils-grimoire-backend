import { randomInt } from 'node:crypto';

const adjectives = [
  'Silent',
  'Silver',
  'Ancient',
  'Golden',
  'Hidden',
  'Crimson',
  'Wandering',
  'Misty',
  'Midnight',
  'Emerald',
];

const nouns = ['Raven', 'Fox', 'Owl', 'Wolf', 'Badger', 'Hawk', 'Lynx', 'Otter', 'Moth', 'Stag'];

export const generateAnonymousName = (): string => {
  const adjective = adjectives[randomInt(adjectives.length)];

  const noun = nouns[randomInt(nouns.length)];

  return `${adjective} ${noun}`;
};
