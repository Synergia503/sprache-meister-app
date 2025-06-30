
import { useState } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useGapFillExercise } from '@/hooks/useGapFillExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { ExerciseDisplay } from '@/components/exercises/ExerciseDisplay';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';

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
      apiKey={apiKey}
      onSaveApiKey={saveApiKey}
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
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
      
      <WordInputForm
        onGenerateExercise={generateExercise}
        isLoading={isLoading}
        apiKey={apiKey}
        initialWords={mistakeWords.length > 0 ? mistakeWords : ['']}
        description="Add up to 20 German words or phrases. The exercise will generate 2-4 times as many sentences with gaps."
        title="Create New Gap-Fill Exercise"
      />
    </ExerciseLayout>
  );
};

export default GapFill;
