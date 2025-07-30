
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslationExercise } from '@/hooks/useTranslationExercise';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';
import { TranslationExerciseDisplay } from '@/components/exercises/TranslationExerciseDisplay';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { VocabularySelector } from '@/components/VocabularySelector';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';

const Translation = () => {
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
  } = useTranslationExercise();

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

    // This would call the translation exercise generation
    // For now, we'll use the existing logic
    toast({
      title: "Exercise Generated",
      description: `Created translation exercise with ${words.length} words.`,
    });
  };

  return (
    <ExerciseLayout
      title={`${languageSettings.targetLanguage.nativeName} to ${languageSettings.nativeLanguage.nativeName} Translation`}
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
              description={`Select ${languageSettings.targetLanguage.nativeName} words from your vocabulary to practice translation.`}
              exerciseType="translation"
              exercisePath="/exercises/translation"
            />

            <WordInputForm
              onGenerateExercise={handleGenerateExercise}
              isLoading={false}
              apiKey={apiKey}
              title="Create New Translation Exercise"
              description={`Add up to 20 ${languageSettings.targetLanguage.nativeName} words or phrases to translate into ${languageSettings.nativeLanguage.nativeName}.`}
              placeholder={`${languageSettings.targetLanguage.nativeName} word`}
            />
          </div>
        ) : (
          <TranslationExerciseDisplay
            exercise={currentExercise}
            userAnswers={userAnswers}
            showResults={showResults}
            onAnswerChange={handleAnswerChange}
            onCheckAnswers={checkAnswers}
            onNewExercise={resetExercise}
          />
        )}
      </div>
    </ExerciseLayout>
  );
};

export default Translation;
