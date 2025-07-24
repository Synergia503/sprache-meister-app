
import { useState } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useGapFillExercise } from '@/hooks/useGapFillExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { ExerciseDisplay } from '@/components/exercises/ExerciseDisplay';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';
import { VocabularySelector } from '@/components/VocabularySelector';

const GapFill = () => {
  const [mistakeWords, setMistakeWords] = useState<string[]>([]);
  const { apiKey, saveApiKey } = useOpenAI();
  const {
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
    loadPreviousExercise
  } = useGapFillExercise();

  const handlePracticeMistakes = () => {
    const incorrectWords = createNewExerciseFromMistakes();
    if (incorrectWords.length > 0) {
      setMistakeWords(incorrectWords);
      resetExercise();
    }
  };

  return (
    <ExerciseLayout
      title="Gap-Fill Exercise"
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
      currentExercise={currentExercise}
    >
      <ExerciseDisplay
        exercise={currentExercise}
        userAnswers={userAnswers}
        showResults={showResults}
        onAnswerChange={handleAnswerChange}
        onCheckAnswers={checkAnswers}
        onPracticeMistakes={handlePracticeMistakes}
        onNewExercise={resetExercise}
      />
      
      <div className="space-y-6">
        <VocabularySelector
          exerciseType="gap-fill"
          exercisePath="/exercises/gap-fill"
          title="Use Vocabulary from Category"
          description="Select a category from your vocabulary to create gap-fill exercises."
        />
        
        <WordInputForm
          onGenerateExercise={generateExercise}
          isLoading={isLoading}
          apiKey={apiKey}
          initialWords={mistakeWords.length > 0 ? mistakeWords : ['']}
          description="Add up to 20 German words or phrases. The exercise will generate 2-4 times as many sentences with gaps."
          title="Create New Gap-Fill Exercise"
        />
      </div>
    </ExerciseLayout>
  );
};

export default GapFill;
