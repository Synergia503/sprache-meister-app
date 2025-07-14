
import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { TranslationExercise } from '@/types/exercises';

const SAMPLE_EXERCISE: TranslationExercise = {
  id: 'sample-translation',
  words: ['Ich bin müde', 'Das Wetter ist schön', 'Wo ist der Bahnhof?'],
  sentences: [
    { sentenceOrder: 1, germanSentence: 'Ich bin müde.', englishSentence: 'I am tired.' },
    { sentenceOrder: 2, germanSentence: 'Das Wetter ist heute schön.', englishSentence: 'The weather is nice today.' },
    { sentenceOrder: 3, germanSentence: 'Wo ist der Bahnhof?', englishSentence: 'Where is the train station?' }
  ],
  userAnswers: {},
  isCompleted: false,
  createdAt: new Date()
};

export const useTranslationExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<TranslationExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<TranslationExercise[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's vocabulary data from the category selection
    const vocabularyPairsData = sessionStorage.getItem('vocabularyPairsForExercise');
    const exerciseCategory = sessionStorage.getItem('exerciseCategory');
    
    if (vocabularyPairsData) {
      try {
        const vocabularyPairs = JSON.parse(vocabularyPairsData);
        const categoryExercise: TranslationExercise = {
          id: `category-${Date.now()}`,
          words: vocabularyPairs.map((pair: any) => pair.german),
          sentences: vocabularyPairs.map((pair: any, index: number) => ({
            sentenceOrder: index + 1,
            germanSentence: pair.german,
            englishSentence: pair.english
          })),
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date()
        };
        
        setCurrentExercise(categoryExercise);
        setUserAnswers({});
        setShowResults(false);
        
        // Clear the sessionStorage after using it
        sessionStorage.removeItem('vocabularyPairsForExercise');
        sessionStorage.removeItem('exerciseCategory');
        
        toast({
          title: "Exercise loaded",
          description: `Using vocabulary from ${exerciseCategory || 'selected category'}`,
        });
      } catch (error) {
        console.error('Error parsing vocabulary pairs:', error);
        loadSampleExercise();
      }
    } else {
      loadSampleExercise();
    }
  }, []);

  const loadSampleExercise = () => {
    setCurrentExercise(SAMPLE_EXERCISE);
    setUserAnswers({});
    setShowResults(false);
  };

  const generateExercise = async (sentences: string[]) => {
    const validSentences = sentences.filter(sentence => sentence.trim());
    if (validSentences.length === 0) {
      toast({
        title: "No sentences provided",
        description: "Please add at least one sentence to generate an exercise.",
        variant: "destructive",
      });
      return;
    }

    const prompt = `Create a German-English translation exercise with these German sentences: ${validSentences.join(', ')}. For each German sentence, provide its accurate English translation.

Return only a JSON object with this exact format:
{
  "sentences": [
    {
      "sentenceOrder": 1,
      "germanSentence": "Ich bin müde.",
      "englishSentence": "I am tired."
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating translation exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const exercise: TranslationExercise = {
          id: Date.now().toString(),
          words: validSentences,
          sentences: exerciseData.sentences,
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date()
        };
        setCurrentExercise(exercise);
        setUserAnswers({});
        setShowResults(false);
      } catch (error) {
        toast({
          title: "Error parsing exercise",
          description: "Failed to generate exercise. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAnswerChange = (sentenceOrder: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [sentenceOrder]: answer
    }));
  };

  const checkAnswers = () => {
    if (!currentExercise) return;

    const updatedExercise = {
      ...currentExercise,
      userAnswers,
      isCompleted: true
    };

    setPreviousExercises(prev => [...prev, updatedExercise]);
    setShowResults(true);
    
    toast({
      title: "Exercise completed!",
      description: "Your translations have been checked and saved.",
    });
  };

  const resetExercise = () => {
    // Store the current exercise data to enable restart functionality
    const currentVocabulary = currentExercise?.sentences?.map(sentence => ({
      german: sentence.germanSentence,
      english: sentence.englishSentence
    }));
    
    if (currentVocabulary && currentVocabulary.length > 0) {
      // Keep current exercise vocabulary for restart
      setCurrentExercise(prev => prev ? {
        ...prev,
        userAnswers: {},
        isCompleted: false
      } : null);
      setUserAnswers({});
      setShowResults(false);
    } else {
      loadSampleExercise();
    }
  };

  const loadPreviousExercise = (exercise: TranslationExercise) => {
    setCurrentExercise(exercise);
    setUserAnswers(exercise.userAnswers);
    setShowResults(exercise.isCompleted);
  };

  return {
    currentExercise,
    userAnswers,
    showResults,
    previousExercises,
    isLoading,
    generateExercise,
    handleAnswerChange,
    checkAnswers,
    resetExercise,
    loadPreviousExercise
  };
};
