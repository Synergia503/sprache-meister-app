
import { useOpenAI } from '@/hooks/useOpenAI';
import { useTranslationExercise } from '@/hooks/useTranslationExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { TranslationExerciseDisplay } from '@/components/exercises/TranslationExerciseDisplay';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';

const Translation = () => {
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
    resetExercise,
    loadPreviousExercise
  } = useTranslationExercise();

  return (
    <ExerciseLayout
      title="Translation Exercise"
      apiKey={apiKey}
      onSaveApiKey={saveApiKey}
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
      currentExercise={currentExercise}
    >
      <TranslationExerciseDisplay
        exercise={currentExercise}
        userAnswers={userAnswers}
        showResults={showResults}
        onAnswerChange={handleAnswerChange}
        onCheckAnswers={checkAnswers}
        onNewExercise={resetExercise}
      />
      
      <WordInputForm
        onGenerateExercise={generateExercise}
        isLoading={isLoading}
        apiKey={apiKey}
        description="Add German sentences to translate into English."
        placeholder="German sentence"
        title="Create New Translation Exercise"
      />
    </ExerciseLayout>
  );
};

export default Translation;
