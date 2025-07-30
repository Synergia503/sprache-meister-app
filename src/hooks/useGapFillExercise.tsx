import { useState, useEffect, useCallback } from "react";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useToast } from "@/hooks/use-toast";
import { GapFillExercise } from "@/types/gapFill";
import {
  vocabularyExerciseService,
  VocabularyWord,
} from "@/services/vocabularyExerciseService";
import { useLanguage } from "@/contexts/LanguageContext";

export const useGapFillExercise = () => {
  const [currentExercise, setCurrentExercise] =
    useState<GapFillExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<GapFillExercise[]>(
    []
  );
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();
  const { languageSettings } = useLanguage();

  const generateExercise = useCallback(
    async (words: VocabularyWord[]) => {
      console.log("generateExercise called with input:", words);

      // Handle both word objects and string arrays
      let validWords: string[] = [];
      validWords = words.map((word: VocabularyWord) => word.targetWord);
      console.log("Extracted target words from objects:", validWords);

      if (validWords.length === 0) {
        console.log("No valid words found");
        toast({
          title: "No words provided",
          description: "Please add at least one word to generate an exercise.",
          variant: "destructive",
        });
        return;
      }

      console.log("Calling OpenAI with words:", validWords);
        const prompt = `Create a gap-fill exercise with target language words: ${validWords.join(
        ", "
      )}. Generate ${
        validWords.length * 3
      } sentences where each word appears 2-4 times in different grammatical forms. Each sentence should have exactly one gap marked with ___. Randomize the order of words throughout the sentences.

Return only a JSON object with this exact format:
{
  "sentences": [
    {
      "sentenceOrder": 1,
      "sentence": "Ich ___ gestern ins Kino gegangen.",
      "solution": "bin"
    }
  ]
}`;

      const systemMessage =
        `You are a ${languageSettings.targetLanguage.nativeName} language teacher creating gap-fill exercises. Return only valid JSON without any additional text or explanations.`;

      const result = await callOpenAI(prompt, systemMessage);
      if (result) {
        try {
          const exerciseData = JSON.parse(result);
          const exercise: GapFillExercise = {
            id: Date.now().toString(),
            words: validWords,
            sentences: exerciseData.sentences,
            userAnswers: {},
            isCompleted: false,
            createdAt: new Date(),
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
    },
    [callOpenAI, toast, languageSettings.targetLanguage.nativeName]
  );

  // Check for vocabulary data from service on mount
  useEffect(() => {
    console.log(
      "Gap-fill exercise useEffect triggered - checking for service data"
    );

    // Check if there's vocabulary data from the service
    if (vocabularyExerciseService.hasExerciseData()) {
      const exerciseData = vocabularyExerciseService.getExerciseData();
      console.log("Found exercise data from service:", exerciseData);

      if (exerciseData && exerciseData.words.length > 0) {
        console.log(
          "Generating exercise with vocabulary words:",
          exerciseData.words
        );

        // Generate exercise with the vocabulary words
        generateExercise(exerciseData.words);

        toast({
          title: "Exercise loaded",
          description: `Using vocabulary from ${exerciseData.category}`,
        });

        // Clear the service data after using it
        vocabularyExerciseService.clearExerciseData();
        return;
      }
    } else {
      console.log("No exercise data found in service");
    }

    console.log("Loading sample exercise as fallback");
  }, [generateExercise, toast]);

  const handleAnswerChange = (sentenceOrder: number, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [sentenceOrder]: answer,
    }));
  };

  const checkAnswers = () => {
    if (!currentExercise) return;

    const updatedExercise = {
      ...currentExercise,
      userAnswers,
      isCompleted: true,
    };

    setPreviousExercises((prev) => [...prev, updatedExercise]);
    setShowResults(true);

    toast({
      title: "Exercise completed!",
      description: "Your answers have been checked and saved.",
    });
  };

  const createNewExerciseFromMistakes = () => {
    if (!currentExercise || !showResults) return [];

    const incorrectWords: string[] = [];
    currentExercise.sentences.forEach((sentence) => {
      const userAnswer = userAnswers[sentence.sentenceOrder] || "";
      if (
        userAnswer.toLowerCase().trim() !==
        sentence.solution.toLowerCase().trim()
      ) {
        if (!incorrectWords.includes(sentence.solution)) {
          incorrectWords.push(sentence.solution);
        }
      }
    });

    if (incorrectWords.length > 0) {
      return incorrectWords.concat(
        Array(Math.max(0, 20 - incorrectWords.length)).fill("")
      );
    }
    return [];
  };

  const resetExercise = () => {
    loadPreviousExercise(currentExercise);
  };

  const loadPreviousExercise = (exercise: GapFillExercise) => {
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
    createNewExerciseFromMistakes,
    resetExercise,
    loadPreviousExercise,
  };
};
