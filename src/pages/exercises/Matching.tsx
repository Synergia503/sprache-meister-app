import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMatchingExercise } from "@/hooks/useMatchingExercise";
import { ExerciseLayout } from "@/components/exercises/ExerciseLayout";
import { MatchingExerciseDisplay } from "@/components/exercises/MatchingExerciseDisplay";
import { WordInputForm } from "@/components/exercises/WordInputForm";
import { VocabularySelector } from "@/components/VocabularySelector";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useToast } from "@/hooks/use-toast";

const Matching = () => {
  const { languageSettings } = useLanguage();
  const { toast } = useToast();
  const { apiKey } = useOpenAI();
  const {
    currentExercise,
    userMatches,
    showResults,
    shuffledNative,
    selectedGerman,
    selectedEnglish,
    onMatch,
    onCheckAnswers,
    onShuffle,
    onNewExercise,
    onSelectGerman,
    onSelectEnglish,
    getMatchingResult,
  } = useMatchingExercise();

  const [previousExercises, setPreviousExercises] = useState<any[]>([]);

  const handleGenerateExercise = async (words: string[]) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your OpenAI API key in settings.",
        variant: "destructive",
      });
      return;
    }

    // This would call the matching exercise generation
    toast({
      title: "Exercise Generated",
      description: `Created matching exercise with ${words.length} word pairs.`,
    });
  };

  return (
    <ExerciseLayout
      title={`${languageSettings.targetLanguage.nativeName} - ${languageSettings.nativeLanguage.nativeName} Matching`}
      previousExercises={previousExercises}
      onLoadExercise={() => {}}
      currentExercise={currentExercise}
    >
      <div className="space-y-6">
        {!currentExercise ? (
          <div className="space-y-6">
            <VocabularySelector
              onWordsSelected={handleGenerateExercise}
              title="Use Existing Vocabulary"
              description={`Select ${languageSettings.targetLanguage.nativeName} words from your vocabulary to practice matching.`}
              exerciseType="matching"
              exercisePath="/exercises/matching"
            />

            <WordInputForm
              onGenerateExercise={handleGenerateExercise}
              isLoading={false}
              apiKey={apiKey}
              title="Create New Matching Exercise"
              description={`Add up to 20 ${languageSettings.targetLanguage.nativeName} words or phrases. The exercise will create ${languageSettings.targetLanguage.nativeName}-${languageSettings.nativeLanguage.nativeName} matching pairs.`}
              placeholder={`${languageSettings.targetLanguage.nativeName} word`}
            />
          </div>
        ) : (
          <MatchingExerciseDisplay
            exercise={currentExercise}
            userMatches={userMatches}
            showResults={showResults}
            shuffledNative={shuffledNative}
            selectedTarget={selectedGerman}
            selectedNative={selectedEnglish}
            onMatch={onMatch}
            onCheckAnswers={onCheckAnswers}
            onShuffle={onShuffle}
            onNewExercise={onNewExercise}
            onSelectTarget={onSelectGerman}
            onSelectNative={onSelectEnglish}
            getMatchingResult={getMatchingResult}
          />
        )}
      </div>
    </ExerciseLayout>
  );
};

export default Matching;
