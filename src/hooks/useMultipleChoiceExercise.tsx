
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

  // Load sample exercise on mount
  useEffect(() => {
    loadSampleExercise();
  }, []);

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
    loadSampleExercise();
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
