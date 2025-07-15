import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CustomWord, VocabularyFilters, SortOption, SortOrder } from '@/types/vocabulary';
import { fuzzySearch } from '@/utils/fuzzySearch';

interface VocabularyContextType {
  words: CustomWord[];
  filters: VocabularyFilters;
  sortOption: SortOption;
  sortOrder: SortOrder;
  updateWord: (word: CustomWord) => void;
  addWord: (word: CustomWord) => void;
  removeWord: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setFilters: (filters: VocabularyFilters) => void;
  setSortOption: (option: SortOption) => void;
  setSortOrder: (order: SortOrder) => void;
  getFilteredAndSortedWords: () => CustomWord[];
  getWordById: (id: string) => CustomWord | undefined;
  getAllCategories: () => string[];
  getWordsByCategory: (category: string) => CustomWord[];
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

const mockWords: CustomWord[] = [
  {
    id: '1',
    german: 'Fernweh',
    english: 'Wanderlust',
    categories: ['emotions', 'travel'],
    sampleSentence: 'Ich habe großes Fernweh nach den Bergen.',
    dateAdded: new Date('2024-01-15'),
    isFavorite: true,
    lastLearningDate: new Date('2024-01-20'),
    learningHistory: [
      { exerciseType: 'translation', success: true, date: new Date('2024-01-20'), timeSpent: 45 },
      { exerciseType: 'multiple-choice', success: false, date: new Date('2024-01-19'), timeSpent: 30 },
      { exerciseType: 'matching', success: true, date: new Date('2024-01-18'), timeSpent: 25 },
    ]
  },
  {
    id: '2',
    german: 'Gemütlichkeit',
    english: 'Coziness',
    categories: ['feelings', 'home'],
    sampleSentence: 'Die Gemütlichkeit des Cafés lädt zum Verweilen ein.',
    dateAdded: new Date('2024-01-10'),
    isFavorite: false,
    lastLearningDate: new Date('2024-01-18'),
    learningHistory: [
      { exerciseType: 'translation', success: true, date: new Date('2024-01-18'), timeSpent: 35 },
      { exerciseType: 'gap-fill', success: true, date: new Date('2024-01-17'), timeSpent: 40 },
    ]
  },
  {
    id: '3',
    german: 'Verschlimmbessern',
    english: 'To make worse by trying to improve',
    categories: ['actions', 'irony'],
    sampleSentence: 'Er hat die Situation verschlimmbessert.',
    dateAdded: new Date('2024-01-08'),
    isFavorite: false,
    lastLearningDate: new Date('2024-01-16'),
    learningHistory: [
      { exerciseType: 'translation', success: false, date: new Date('2024-01-16'), timeSpent: 60 },
    ]
  },
  {
    id: '4',
    german: 'Schadenfreude',
    english: 'Joy from others\' misfortune',
    categories: ['emotions'],
    sampleSentence: 'Seine Schadenfreude war deutlich zu sehen.',
    dateAdded: new Date('2024-01-05'),
    isFavorite: true,
    lastLearningDate: new Date('2024-01-15'),
    learningHistory: [
      { exerciseType: 'matching', success: true, date: new Date('2024-01-15'), timeSpent: 30 },
      { exerciseType: 'multiple-choice', success: true, date: new Date('2024-01-14'), timeSpent: 25 },
    ]
  },
  {
    id: '5',
    german: 'Zeitgeist',
    english: 'Spirit of the age',
    categories: ['culture', 'philosophy'],
    sampleSentence: 'Der Zeitgeist unserer Zeit ist von Technologie geprägt.',
    dateAdded: new Date('2024-01-12'),
    isFavorite: false,
    lastLearningDate: undefined,
    learningHistory: []
  },
  {
    id: '6',
    german: 'der Tisch',
    english: 'table',
    categories: ['furniture', 'home'],
    sampleSentence: 'Der Tisch ist aus Holz.',
    dateAdded: new Date('2024-01-03'),
    isFavorite: false,
    lastLearningDate: new Date('2024-01-12'),
    learningHistory: [
      { exerciseType: 'translation', success: true, date: new Date('2024-01-12'), timeSpent: 20 },
    ]
  },
  {
    id: '7',
    german: 'das Buch',
    english: 'book',
    categories: ['objects', 'education'],
    sampleSentence: 'Das Buch liegt auf dem Tisch.',
    dateAdded: new Date('2024-01-01'),
    isFavorite: false,
    lastLearningDate: undefined,
    learningHistory: []
  },
  {
    id: '8',
    german: 'die Lampe',
    english: 'lamp',
    categories: ['furniture', 'lighting'],
    sampleSentence: 'Die Lampe spendet warmes Licht.',
    dateAdded: new Date('2024-01-02'),
    isFavorite: false,
    lastLearningDate: new Date('2024-01-10'),
    learningHistory: [
      { exerciseType: 'matching', success: true, date: new Date('2024-01-10'), timeSpent: 35 },
      { exerciseType: 'translation', success: false, date: new Date('2024-01-09'), timeSpent: 40 },
    ]
  },
  {
    id: '9',
    german: 'der Stuhl',
    english: 'chair',
    categories: ['furniture'],
    sampleSentence: 'Der Stuhl ist bequem.',
    dateAdded: new Date('2024-01-04'),
    isFavorite: true,
    lastLearningDate: new Date('2024-01-14'),
    learningHistory: [
      { exerciseType: 'translation', success: true, date: new Date('2024-01-14'), timeSpent: 25 },
    ]
  },
  {
    id: '10',
    german: 'das Fenster',
    english: 'window',
    categories: ['architecture', 'home'],
    sampleSentence: 'Das Fenster ist geöffnet.',
    dateAdded: new Date('2024-01-06'),
    isFavorite: false,
    lastLearningDate: undefined,
    learningHistory: []
  },
  {
    id: '11',
    german: 'die Tür',
    english: 'door',
    categories: ['architecture', 'home'],
    sampleSentence: 'Die Tür ist geschlossen.',
    dateAdded: new Date('2024-01-07'),
    isFavorite: false,
    lastLearningDate: new Date('2024-01-13'),
    learningHistory: [
      { exerciseType: 'multiple-choice', success: true, date: new Date('2024-01-13'), timeSpent: 30 },
    ]
  },
  {
    id: '12',
    german: 'der Computer',
    english: 'computer',
    categories: ['technology', 'electronics'],
    sampleSentence: 'Der Computer ist sehr schnell.',
    dateAdded: new Date('2024-01-11'),
    isFavorite: false,
    lastLearningDate: undefined,
    learningHistory: []
  },
];

export const VocabularyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [words, setWords] = useState<CustomWord[]>(mockWords);
  const [filters, setFilters] = useState<VocabularyFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>('dateAdded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const updateWord = (updatedWord: CustomWord) => {
    setWords(prev => prev.map(word => 
      word.id === updatedWord.id ? updatedWord : word
    ));
  };

  const addWord = (newWord: CustomWord) => {
    setWords(prev => [newWord, ...prev]);
  };

  const removeWord = (id: string) => {
    setWords(prev => prev.filter(word => word.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setWords(prev => prev.map(word => 
      word.id === id ? { ...word, isFavorite: !word.isFavorite } : word
    ));
  };

  const getWordById = (id: string) => {
    return words.find(word => word.id === id);
  };

  const calculateSuccessRate = (word: CustomWord) => {
    if (!word.learningHistory.length) return 0;
    const successCount = word.learningHistory.filter(h => h.success).length;
    return Math.round((successCount / word.learningHistory.length) * 100);
  };

  const getFilteredAndSortedWords = () => {
    let filteredWords = [...words];

    // Apply filters
    if (filters.category) {
      filteredWords = filteredWords.filter(word => 
        word.categories.includes(filters.category!)
      );
    }

    if (filters.favorites) {
      filteredWords = filteredWords.filter(word => word.isFavorite);
    }

    if (filters.hasLearningHistory) {
      filteredWords = filteredWords.filter(word => word.learningHistory.length > 0);
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredWords = filteredWords.filter(word => 
        fuzzySearch(searchTerm, word.german) || 
        fuzzySearch(searchTerm, word.english) ||
        word.categories.some(cat => fuzzySearch(searchTerm, cat))
      );
    }

    // Apply sorting
    filteredWords.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortOption) {
        case 'dateAdded':
          compareValue = a.dateAdded.getTime() - b.dateAdded.getTime();
          break;
        case 'german':
          compareValue = a.german.localeCompare(b.german);
          break;
        case 'english':
          compareValue = a.english.localeCompare(b.english);
          break;
        case 'learningProgress':
          compareValue = calculateSuccessRate(a) - calculateSuccessRate(b);
          break;
        case 'lastLearning':
          const aDate = a.lastLearningDate?.getTime() || 0;
          const bDate = b.lastLearningDate?.getTime() || 0;
          compareValue = aDate - bDate;
          break;
        default:
          compareValue = 0;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filteredWords;
  };

  const getAllCategories = () => {
    const categories = new Set<string>();
    words.forEach(word => {
      word.categories.forEach(category => {
        categories.add(category);
      });
    });
    return Array.from(categories).sort();
  };

  const getWordsByCategory = (category: string) => {
    return words.filter(word => word.categories.includes(category));
  };

  return (
    <VocabularyContext.Provider value={{
      words,
      filters,
      sortOption,
      sortOrder,
      updateWord,
      addWord,
      removeWord,
      toggleFavorite,
      setFilters,
      setSortOption,
      setSortOrder,
      getFilteredAndSortedWords,
      getWordById,
      getAllCategories,
      getWordsByCategory,
    }}>
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (context === undefined) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};