
import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { MultipleChoiceExercise } from '@/types/exercises';

const SAMPLE_EXERCISE: MultipleChoiceExercise = {
  id: 'sample-multiple-choice',
  words: ['der/die/das', 'haben/sein', 'Adjektivendungen'],
  sentences: [
    {
      sentenceOrder: 1,
      sentence: '____ Haus ist groß.',
      options: ['Der', 'Die', 'Das', 'Den'],
      solution: 'Das'
    },
    {
      sentenceOrder: 2,
      sentence: 'Ich ____ heute müde.',
      options: ['habe', 'bin', 'ist', 'sind'],
      solution: 'bin'
    },
    {
      sentenceOrder: 3,
      sentence: 'Er trägt ein____ schwarz____ Jacke.',
      options: ['e, e', 'en, en', 'e, en', 'er, e'],
      solution: 'e, e'
    }
  ],
  userAnswers: {},
  isCompleted: false,
  createdAt: new Date()
};

export const useMultipleChoiceExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<MultipleChoiceExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<MultipleChoiceExercise[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's vocabulary data from the category selection
    const vocabularyPairsData = sessionStorage.getItem('vocabularyPairsForExercise');
    const exerciseCategory = sessionStorage.getItem('exerciseCategory');
    
    if (vocabularyPairsData) {
      try {
        const vocabularyPairs = JSON.parse(vocabularyPairsData);
        // Generate multiple choice questions from vocabulary pairs
        const sentences = vocabularyPairs.map((pair: any, index: number) => ({
          sentenceOrder: index + 1,
          sentence: `What is the English translation of "${pair.german}"?`,
          options: generateRandomOptions(pair.english, vocabularyPairs),
          solution: pair.english
        }));
        
        const categoryExercise: MultipleChoiceExercise = {
          id: `category-${Date.now()}`,
          words: vocabularyPairs.map((pair: any) => pair.german),
          sentences,
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

  const generateRandomOptions = (correctAnswer: string, allPairs: any[]) => {
    const otherAnswers = allPairs
      .map(pair => pair.english)
      .filter(answer => answer !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const options = [correctAnswer, ...otherAnswers].sort(() => Math.random() - 0.5);
    return options.length === 4 ? options : [correctAnswer, 'Option 2', 'Option 3', 'Option 4'];
  };

  const loadSampleExercise = () => {
    setCurrentExercise(SAMPLE_EXERCISE);
    setUserAnswers({});
    setShowResults(false);
  };

  const generateExercise = async (topics: string[]) => {
    const validTopics = topics.filter(topic => topic.trim());
    if (validTopics.length === 0) {
      toast({
        title: "No topics provided",
        description: "Please add at least one topic to generate an exercise.",
        variant: "destructive",
      });
      return;
    }

    const prompt = `Create a German multiple choice exercise focusing on these topics: ${validTopics.join(', ')}. Create sentences with blanks and provide 4 options for each, with one correct answer.

Return only a JSON object with this exact format:
{
  "sentences": [
    {
      "sentenceOrder": 1,
      "sentence": "____ Haus ist groß.",
      "options": ["Der", "Die", "Das", "Den"],
      "solution": "Das"
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating multiple choice exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const exercise: MultipleChoiceExercise = {
          id: Date.now().toString(),
          words: validTopics,
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
    
    // Calculate score
    const correctAnswers = currentExercise.sentences.filter(sentence => 
      userAnswers[sentence.sentenceOrder] === sentence.solution
    ).length;

    toast({
      title: "Exercise completed!",
      description: `You got ${correctAnswers} out of ${currentExercise.sentences.length} correct.`,
    });
  };

  const resetExercise = () => {
    // Store the current exercise data to enable restart functionality
    const currentVocabulary = currentExercise?.sentences;
    
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

  const loadPreviousExercise = (exercise: MultipleChoiceExercise) => {
    setCurrentExercise(exercise);
    setUserAnswers(exercise.userAnswers);
    setShowResults(exercise.isCompleted);
  };

  const practiceMistakes = () => {
    if (!currentExercise || !showResults) return;

    const incorrectSentences = currentExercise.sentences.filter(sentence => 
      userAnswers[sentence.sentenceOrder] !== sentence.solution
    );

    if (incorrectSentences.length === 0) {
      toast({
        title: "Perfect score!",
        description: "You got all answers correct. No mistakes to practice!",
      });
      return;
    }

    const mistakeExercise: MultipleChoiceExercise = {
      ...currentExercise,
      id: Date.now().toString(),
      sentences: incorrectSentences,
      userAnswers: {},
      isCompleted: false,
      createdAt: new Date()
    };

    setCurrentExercise(mistakeExercise);
    setUserAnswers({});
    setShowResults(false);
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
    loadPreviousExercise,
    practiceMistakes
  };
};
