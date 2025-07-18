import { useState, useEffect, useCallback } from "react";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useToast } from "@/hooks/use-toast";
import { GapFillExercise } from "@/types/gapFill";

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

  const generateExercise = useCallback(
    async (input: string[] | any[]) => {
      console.log("generateExercise called with input:", input);

      // Handle both word objects and string arrays
      let validWords: string[] = [];

      if (
        input.length > 0 &&
        typeof input[0] === "object" &&
        "german" in input[0]
      ) {
        // Input is word objects from vocabulary
        validWords = input.map((word: any) => word.german);
        console.log("Extracted German words from objects:", validWords);
      } else {
        // Input is string array
        validWords = (input as string[]).filter((word) => word.trim());
        console.log("Using string array as words:", validWords);
      }

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
      const prompt = `Create a gap-fill exercise with German words: ${validWords.join(
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
        "You are a German language teacher creating gap-fill exercises. Return only valid JSON without any additional text or explanations.";

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
    [callOpenAI, toast]
  );

  // Load sample exercise on mount or check for vocabulary
  useEffect(() => {
    console.log("Gap-fill exercise useEffect triggered");

    // Check if there's vocabulary data from category selection or drag zone
    const vocabularyPairsData = sessionStorage.getItem(
      "vocabularyPairsForExercise"
    );
    const wordListData = sessionStorage.getItem("gapFillWordsForExercise");
    const exerciseCategory = sessionStorage.getItem("exerciseCategory");

    console.log("Session storage data:", {
      vocabularyPairsData: vocabularyPairsData ? "exists" : "null",
      wordListData: wordListData ? "exists" : "null",
      exerciseCategory,
    });

    if (vocabularyPairsData) {
      console.log("Processing vocabulary pairs data");
      try {
        const vocabularyPairs = JSON.parse(vocabularyPairsData);
        const words = vocabularyPairs.map((pair: any) => pair.german);
        generateExercise(words);

        // Clear the sessionStorage after using it
        sessionStorage.removeItem("vocabularyPairsForExercise");
        sessionStorage.removeItem("exerciseCategory");

        toast({
          title: "Exercise loaded",
          description: `Using vocabulary from ${
            exerciseCategory || "selected category"
          }`,
        });
        return; // Exit early to prevent loading sample exercise
      } catch (error) {
        console.error("Error parsing vocabulary pairs:", error);
      }
    } else if (wordListData) {
      console.log("Processing word list data:", wordListData);
      try {
        const parsedWordList = JSON.parse(wordListData);
        console.log("Parsed word list:", parsedWordList);

        let words: string[] = [];
        if (Array.isArray(parsedWordList)) {
          words = parsedWordList.filter((word) => word && word.trim());
        } else {
          words = [parsedWordList].filter((word) => word && word.trim());
        }

        console.log("Processed words for exercise:", words);

        if (words.length > 0) {
          console.log("Generating exercise with words:", words);
          generateExercise(words);

          // Clear the sessionStorage after using it
          sessionStorage.removeItem("gapFillWordsForExercise");
          sessionStorage.removeItem("exerciseCategory");

          toast({
            title: "Exercise loaded",
            description: `Using ${words.length} selected words`,
          });
          return; // Exit early to prevent loading sample exercise
        } else {
          console.log("No valid words found, loading sample exercise");
        }
      } catch (error) {
        console.error("Error parsing word list:", error);
      }
    }

    console.log("Loading sample exercise as fallback");
  }, [toast, generateExercise]);

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
