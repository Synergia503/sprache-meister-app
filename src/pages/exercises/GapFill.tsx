
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGapFillExercise } from '@/hooks/useGapFillExercise';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';
import { ExerciseDisplay } from '@/components/exercises/ExerciseDisplay';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { VocabularySelector } from '@/components/VocabularySelector';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { GapFillExercise } from '@/types/gapFill';

const GapFill = () => {
  const { languageSettings } = useLanguage();
  const { toast } = useToast();
  const { apiKey } = useOpenAI();
  const {
    currentExercise,
    userAnswers,
    showResults,
    handleAnswerChange,
    checkAnswers,
    resetExercise,
    loadPreviousExercise,
    practiceMistakes,
  } = useGapFillExercise();

  const [previousExercises, setPreviousExercises] = useState<GapFillExercise[]>([]);

  const handleGenerateExercise = async (words: string[]) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your OpenAI API key in settings.",
        variant: "destructive",
      });
      return;
    }

    // This would call the gap-fill exercise generation
    toast({
      title: "Exercise Generated",
      description: `Created gap-fill exercise with ${words.length} words.`,
    });
  };

  const handlePracticeMistakes = () => {
    practiceMistakes();
    toast({
      title: "Practice Mistakes",
      description: "New exercise created with your previous mistakes.",
    });
  };

  return (
    <ExerciseLayout
      title={`${languageSettings.targetLanguage.nativeName} Gap-Fill Exercise`}
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
      currentExercise={currentExercise}
    >
      <div className="space-y-6">
        {!currentExercise ? (
          <div className="space-y-6">
            <VocabularySelector
              onWordsSelected={handleGenerateExercise}
              title="Use Existing Vocabulary"
              description={`Select ${languageSettings.targetLanguage.nativeName} words from your vocabulary to practice gap-fill exercises.`}
              exerciseType="gap-fill"
              exercisePath="/exercises/gap-fill"
            />

            <WordInputForm
              onGenerateExercise={handleGenerateExercise}
              isLoading={false}
              apiKey={apiKey}
              title="Create New Gap-Fill Exercise"
              description={`Add up to 20 ${languageSettings.targetLanguage.nativeName} words or phrases. The exercise will generate 2-4 times as many sentences with gaps.`}
              placeholder={`${languageSettings.targetLanguage.nativeName} word`}
            />
          </div>
        ) : (
          <ExerciseDisplay
            exercise={currentExercise}
            userAnswers={userAnswers}
            showResults={showResults}
            onAnswerChange={handleAnswerChange}
            onCheckAnswers={checkAnswers}
            onPracticeMistakes={handlePracticeMistakes}
            onNewExercise={resetExercise}
          />
        )}
      </div>
    </ExerciseLayout>
  );
};

export default GapFill;
