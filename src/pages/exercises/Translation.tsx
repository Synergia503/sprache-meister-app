
import { useOpenAI } from '@/hooks/useOpenAI';
import { useTranslationExercise } from '@/hooks/useTranslationExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { TranslationExerciseDisplay } from '@/components/exercises/TranslationExerciseDisplay';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';
import { VocabularySelector } from '@/components/VocabularySelector';

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
      
      <div className="space-y-6">
        <VocabularySelector
          onWordsSelected={generateExercise}
          title="Use Vocabulary from Category"
          description="Select a category from your vocabulary to create translation exercises."
        />
        
        <WordInputForm
          onGenerateExercise={generateExercise}
          isLoading={isLoading}
          apiKey={apiKey}
          description="Add German sentences to translate into English."
          placeholder="German sentence"
          title="Create New Translation Exercise"
        />
      </div>
    </ExerciseLayout>
  );
};

export default Translation;
