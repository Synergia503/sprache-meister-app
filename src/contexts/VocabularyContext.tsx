import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CustomWord, VocabularyFilters, SortOption, SortOrder } from '@/types/vocabulary';
import { fuzzySearch } from '@/utils/fuzzySearch';
import { useLanguage } from './LanguageContext';

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

// Updated mock data with language-agnostic structure
const createMockWords = (targetLanguage: string, nativeLanguage: string): CustomWord[] => [
  {
    id: '1',
    targetLanguage,
    nativeLanguage,
    targetWord: 'Fernweh',
    nativeWord: 'Wanderlust',
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
    targetLanguage,
    nativeLanguage,
    targetWord: 'Gemütlichkeit',
    nativeWord: 'Coziness',
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
  // Add more mock words as needed
];

export const VocabularyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { languageSettings } = useLanguage();
  const [words, setWords] = useState<CustomWord[]>([]);
  const [filters, setFilters] = useState<VocabularyFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>('dateAdded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Initialize words based on language settings
  useEffect(() => {
    const savedWords = localStorage.getItem(`vocabulary-${languageSettings.targetLanguage.code}-${languageSettings.nativeLanguage.code}`);
    if (savedWords) {
      try {
        const parsedWords = JSON.parse(savedWords);
        // Convert date strings back to Date objects
        const wordsWithDates = parsedWords.map((word: any) => ({
          ...word,
          dateAdded: new Date(word.dateAdded),
          lastLearningDate: word.lastLearningDate ? new Date(word.lastLearningDate) : undefined,
          learningHistory: word.learningHistory.map((history: any) => ({
            ...history,
            date: new Date(history.date)
          }))
        }));
        setWords(wordsWithDates);
      } catch {
        setWords(createMockWords(languageSettings.targetLanguage.code, languageSettings.nativeLanguage.code));
      }
    } else {
      setWords(createMockWords(languageSettings.targetLanguage.code, languageSettings.nativeLanguage.code));
    }
  }, [languageSettings.targetLanguage.code, languageSettings.nativeLanguage.code]);

  // Save words when they change
  useEffect(() => {
    localStorage.setItem(`vocabulary-${languageSettings.targetLanguage.code}-${languageSettings.nativeLanguage.code}`, JSON.stringify(words));
  }, [words, languageSettings.targetLanguage.code, languageSettings.nativeLanguage.code]);

  const updateWord = (updatedWord: CustomWord) => {
    setWords(prev => prev.map(word => word.id === updatedWord.id ? updatedWord : word));
  };

  const addWord = (newWord: CustomWord) => {
    setWords(prev => [...prev, newWord]);
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
    if (word.learningHistory.length === 0) return 0;
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
        fuzzySearch(searchTerm, word.targetWord) || 
        fuzzySearch(searchTerm, word.nativeWord) ||
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
        case 'targetWord':
          compareValue = a.targetWord.localeCompare(b.targetWord);
          break;
        case 'nativeWord':
          compareValue = a.nativeWord.localeCompare(b.nativeWord);
          break;
        case 'learningProgress':
          compareValue = calculateSuccessRate(a) - calculateSuccessRate(b);
          break;
        case 'lastLearning': {
          const aDate = a.lastLearningDate?.getTime() || 0;
          const bDate = b.lastLearningDate?.getTime() || 0;
          compareValue = aDate - bDate;
          break;
        }
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
    <VocabularyContext.Provider
      value={{
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
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};