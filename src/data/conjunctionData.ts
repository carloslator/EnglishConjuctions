import { Badge, ConjunctionRule, Question } from '../types';

export const CONJUNCTION_RULES: ConjunctionRule[] = [
  {
    id: 'coordinating',
    name: 'Coordinating Conjunctions (FANBOYS)',
    category: 'coordinating',
    description: 'Connect words, phrases, or independent clauses of equal grammatical importance.',
    commonWords: ['For', 'And', 'Nor', 'But', 'Or', 'Yet', 'So'],
    examples: [
      'I wanted to go for a walk, BUT it started raining.',
      'She loves drawing, AND she plays the piano.',
      'Study hard, OR you might struggle on the test.'
    ],
    tips: 'Remember the acronym FANBOYS! When connecting two complete sentences, place a comma BEFORE the coordinating conjunction.'
  },
  {
    id: 'subordinating',
    name: 'Subordinating Conjunctions',
    category: 'subordinating',
    description: 'Join an independent main clause to a dependent clause that adds time, cause, condition, or contrast.',
    commonWords: ['Because', 'Although', 'Unless', 'Since', 'While', 'After', 'Before', 'Until', 'Provided that'],
    examples: [
      'BECAUSE she studied every day, Maya passed the grammar exam.',
      'We will play outside UNLESS it snows heavily.',
      'ALTHOUGH it was cold, the kids enjoyed the park.'
    ],
    tips: 'If the subordinating clause comes FIRST in the sentence, put a comma after it. If it comes second, usually no comma is needed!'
  },
  {
    id: 'correlative',
    name: 'Correlative Conjunctions',
    category: 'correlative',
    description: 'Work in matched pairs to connect balance sentence elements.',
    commonWords: ['Either...or', 'Neither...nor', 'Both...and', 'Not only...but also', 'Whether...or'],
    examples: [
      'EITHER bring your backpack, OR leave it in your locker.',
      'NEITHER Leo NOR Sam knew the answer.',
      'She is NOT ONLY smart BUT ALSO very kind.'
    ],
    tips: 'Make sure the elements following each part of the pair are parallel (e.g. both nouns, both verbs, or both clauses).'
  },
  {
    id: 'conjunctive_adverb',
    name: 'Conjunctive Adverbs',
    category: 'conjunctive_adverb',
    description: 'Transition words that show relation between two independent ideas (cause, contrast, sequence, emphasis).',
    commonWords: ['However', 'Therefore', 'Meanwhile', 'Furthermore', 'Consequently', 'Otherwise', 'In addition'],
    examples: [
      'The rain was heavy; HOWEVER, the soccer match continued.',
      'Alex completed all homework; THEREFORE, he unlocked video game time.',
      'Read the instructions carefully; OTHERWISE, you may get confused.'
    ],
    tips: 'When joining two independent clauses in one sentence, use a semicolon BEFORE the conjunctive adverb and a comma AFTER it.'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'fanboys_master',
    title: 'FANBOYS Specialist',
    description: 'Answer 10 Coordinating Conjunction questions correctly.',
    icon: 'Zap',
    category: 'mastery',
    progress: 0
  },
  {
    id: 'subordinate_pro',
    title: 'Clause Connector',
    description: 'Answer 10 Subordinating Conjunction questions correctly.',
    icon: 'GitCommit',
    category: 'mastery',
    progress: 0
  },
  {
    id: 'correlative_ace',
    title: 'Dynamic Duo',
    description: 'Master 8 Correlative Conjunction pairs correctly.',
    icon: 'Layers',
    category: 'mastery',
    progress: 0
  },
  {
    id: 'adverb_wizard',
    title: 'Transition Wizard',
    description: 'Correctly solve 8 Conjunctive Adverb problems.',
    icon: 'Wand2',
    category: 'mastery',
    progress: 0
  },
  {
    id: 'streak_3',
    title: 'Spark of Consistency',
    description: 'Maintain a 3-day learning streak.',
    icon: 'Flame',
    category: 'streak',
    progress: 0
  },
  {
    id: 'streak_7',
    title: 'Unstoppable Scholar',
    description: 'Maintain a 7-day learning streak.',
    icon: 'Award',
    category: 'streak',
    progress: 0
  },
  {
    id: 'perfect_100',
    title: 'Grammar Precision',
    description: 'Score 100% on any 5-question quiz session.',
    icon: 'Target',
    category: 'accuracy',
    progress: 0
  },
  {
    id: 'ai_apprentice',
    title: 'AI Co-Learner',
    description: 'Receive personalized AI feedback and complete an AI practice set.',
    icon: 'Sparkles',
    category: 'ai',
    progress: 0
  }
];

export const DEFAULT_QUESTIONS: Question[] = [
  // Coordinating
  {
    id: 'q1',
    category: 'coordinating',
    difficulty: 'beginner',
    type: 'fill_blank',
    prompt: 'Liam wanted to buy ice cream, ___ he realized he forgot his wallet.',
    options: ['but', 'so', 'or', 'for'],
    correctAnswer: 'but',
    explanation: '"But" shows contrast between wanting ice cream and forgetting the wallet.'
  },
  {
    id: 'q2',
    category: 'coordinating',
    difficulty: 'beginner',
    type: 'fill_blank',
    prompt: 'You can choose apple juice, ___ you can have fresh lemonade.',
    options: ['or', 'nor', 'yet', 'so'],
    correctAnswer: 'or',
    explanation: '"Or" presents a choice between two drink options.'
  },
  {
    id: 'q3',
    category: 'coordinating',
    difficulty: 'intermediate',
    type: 'fill_blank',
    prompt: 'Aria studied diligence for weeks, ___ she scored the highest mark in class.',
    options: ['so', 'yet', 'nor', 'but'],
    correctAnswer: 'so',
    explanation: '"So" indicates the result or consequence of her hard studying.'
  },
  {
    id: 'q4',
    category: 'coordinating',
    difficulty: 'intermediate',
    type: 'fill_blank',
    prompt: 'The puppy was very tired, ___ it refused to stop playing with the tennis ball.',
    options: ['yet', 'or', 'so', 'and'],
    correctAnswer: 'yet',
    explanation: '"Yet" expresses a surprising contrast similar to "nevertheless".'
  },
  {
    id: 'q5',
    category: 'coordinating',
    difficulty: 'advanced',
    type: 'spot_error',
    prompt: 'Spot the incorrect conjunction: "Ethan does not like broccoli, or does he enjoy spinach."',
    originalSentence: 'Ethan does not like broccoli, or does he enjoy spinach.',
    errorWord: 'or',
    options: ['nor', 'but', 'so', 'and'],
    correctAnswer: 'nor',
    explanation: 'When connecting two negative statements with inverted verb order ("does he enjoy"), "nor" must be used instead of "or".'
  },

  // Subordinating
  {
    id: 'q6',
    category: 'subordinating',
    difficulty: 'beginner',
    type: 'fill_blank',
    prompt: '___ the bell rang, the students neatly packed their notebooks.',
    options: ['When', 'Unless', 'Although', 'Whereas'],
    correctAnswer: 'When',
    explanation: '"When" indicates the time moment at which the action took place.'
  },
  {
    id: 'q7',
    category: 'subordinating',
    difficulty: 'beginner',
    type: 'fill_blank',
    prompt: 'We cannot go swimming ___ the lifeguard arrives at the pool.',
    options: ['until', 'because', 'although', 'so that'],
    correctAnswer: 'until',
    explanation: '"Until" marks the condition of waiting up to a specific time event.'
  },
  {
    id: 'q8',
    category: 'subordinating',
    difficulty: 'intermediate',
    type: 'fill_blank',
    prompt: '___ Lucas was feeling sleepy, he stayed up to finish his science project.',
    options: ['Although', 'Because', 'Since', 'Unless'],
    correctAnswer: 'Although',
    explanation: '"Although" introduces a concession/contrast clause.'
  },
  {
    id: 'q9',
    category: 'subordinating',
    difficulty: 'intermediate',
    type: 'clause_match',
    prompt: 'Connect these clauses: Clause A: "She wore her thick winter coat" + Clause B: "it was freezing outside."',
    clauses: { clauseA: 'She wore her thick winter coat', clauseB: 'it was freezing outside.' },
    options: ['because', 'unless', 'even though', 'while'],
    correctAnswer: 'because',
    explanation: '"Because" supplies the cause/reason for wearing a coat.'
  },
  {
    id: 'q10',
    category: 'subordinating',
    difficulty: 'advanced',
    type: 'spot_error',
    prompt: 'Spot the error: "Unless you practice every day, you will improve your piano skills quickly."',
    originalSentence: 'Unless you practice every day, you will improve your piano skills quickly.',
    errorWord: 'Unless',
    options: ['If', 'Because', 'Although', 'Since'],
    correctAnswer: 'If',
    explanation: '"Unless" means "if not", which creates a contradictory meaning here. "If you practice every day..." makes logical sense.'
  },

  // Correlative
  {
    id: 'q11',
    category: 'correlative',
    difficulty: 'beginner',
    type: 'fill_blank',
    prompt: 'You can have ___ chocolate ___ vanilla frozen yogurt.',
    options: ['either...or', 'neither...or', 'both...or', 'not only...nor'],
    correctAnswer: 'either...or',
    explanation: '"Either...or" presents a selection between two alternatives.'
  },
  {
    id: 'q12',
    category: 'correlative',
    difficulty: 'intermediate',
    type: 'fill_blank',
    prompt: '___ the teacher ___ the students were surprised by the unexpected fire drill.',
    options: ['Both...and', 'Neither...or', 'Either...nor', 'Not...and'],
    correctAnswer: 'Both...and',
    explanation: '"Both...and" links two subjects jointly performing or experiencing an event.'
  },
  {
    id: 'q13',
    category: 'correlative',
    difficulty: 'intermediate',
    type: 'fill_blank',
    prompt: 'The new computer was ___ fast ___ easy to operate.',
    options: ['not only...but also', 'either...nor', 'neither...or', 'whether...and'],
    correctAnswer: 'not only...but also',
    explanation: '"Not only...but also" emphasizes two positive qualities together.'
  },
  {
    id: 'q14',
    category: 'correlative',
    difficulty: 'advanced',
    type: 'spot_error',
    prompt: 'Fix the pair: "Neither the captain or the crew members gave up hope during the storm."',
    originalSentence: 'Neither the captain or the crew members gave up hope.',
    errorWord: 'or',
    options: ['nor', 'and', 'but', 'also'],
    correctAnswer: 'nor',
    explanation: '"Neither" must always pair with "nor" (not "or").'
  },

  // Conjunctive Adverb
  {
    id: 'q15',
    category: 'conjunctive_adverb',
    difficulty: 'beginner',
    type: 'fill_blank',
    prompt: 'Sophia loves outdoor hobbies; ___, she spent her entire summer hiking.',
    options: ['therefore', 'however', 'otherwise', 'nevertheless'],
    correctAnswer: 'therefore',
    explanation: '"Therefore" introduces a logical conclusion resulting from her love of outdoors.'
  },
  {
    id: 'q16',
    category: 'conjunctive_adverb',
    difficulty: 'intermediate',
    type: 'fill_blank',
    prompt: 'The team trained intensely for months; ___, they lost the final match by one point.',
    options: ['however', 'furthermore', 'for example', 'likewise'],
    correctAnswer: 'however',
    explanation: '"However" indicates a contrast between their preparation and the match result.'
  },
  {
    id: 'q17',
    category: 'conjunctive_adverb',
    difficulty: 'advanced',
    type: 'fill_blank',
    prompt: 'You must submit your entry before noon; ___, your artwork will not be judged.',
    options: ['otherwise', 'meanwhile', 'consequently', 'in fact'],
    correctAnswer: 'otherwise',
    explanation: '"Otherwise" states the negative consequence if the condition is not met.'
  }
];
