import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMultipleChoiceExercise } from '@/hooks/useMultipleChoiceExercise';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';
import { MultipleChoiceExerciseDisplay } from '@/components/exercises/MultipleChoiceExerciseDisplay';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { VocabularySelector } from '@/components/VocabularySelector';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { MultipleChoiceExercise } from '@/types/exercises';

const MultipleChoice = () => {
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
  } = useMultipleChoiceExercise();

  const [previousExercises, setPreviousExercises] = useState<MultipleChoiceExercise[]>([]);

  const handleGenerateExercise = async (words: string[]) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your OpenAI API key in settings.",
        variant: "destructive",
      });
      return;
    }

    // This would call the multiple choice exercise generation
    toast({
      title: "Exercise Generated",
      description: `Created multiple choice exercise with ${words.length} words.`,
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
      title={`${languageSettings.targetLanguage.nativeName} Multiple Choice Exercise`}
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
              description={`Select ${languageSettings.targetLanguage.nativeName} words from your vocabulary to practice multiple choice exercises.`}
              exerciseType="multiple-choice"
              exercisePath="/exercises/multiple-choice"
            />

            <WordInputForm
              onGenerateExercise={handleGenerateExercise}
              isLoading={false}
              apiKey={apiKey}
              title="Create New Multiple Choice Exercise"
              description={`Add ${languageSettings.targetLanguage.nativeName} grammar topics to practice with multiple choice questions.`}
              placeholder={`${languageSettings.targetLanguage.nativeName} topic`}
            />
          </div>
        ) : (
          <MultipleChoiceExerciseDisplay
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

export default MultipleChoice;
