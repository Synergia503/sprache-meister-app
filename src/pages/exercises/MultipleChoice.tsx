
import { useOpenAI } from '@/hooks/useOpenAI';
import { useMultipleChoiceExercise } from '@/hooks/useMultipleChoiceExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { MultipleChoiceExerciseDisplay } from '@/components/exercises/MultipleChoiceExerciseDisplay';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';
import { VocabularySelector } from '@/components/VocabularySelector';

const MultipleChoice = () => {
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
    loadPreviousExercise,
    practiceMistakes
  } = useMultipleChoiceExercise();

  return (
    <ExerciseLayout
      title="Multiple Choice Exercise"
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
      currentExercise={currentExercise}
    >
      <MultipleChoiceExerciseDisplay
        exercise={currentExercise}
        userAnswers={userAnswers}
        showResults={showResults}
        onAnswerChange={handleAnswerChange}
        onCheckAnswers={checkAnswers}
        onPracticeMistakes={practiceMistakes}
        onNewExercise={resetExercise}
      />
      
      <div className="space-y-6">
        <VocabularySelector
          onWordsSelected={generateExercise}
          title="Use Vocabulary from Category"
          description="Select a category from your vocabulary to create multiple choice exercises."
        />
        
        <WordInputForm
          onGenerateExercise={generateExercise}
          isLoading={isLoading}
          apiKey={apiKey}
          description="Add German grammar topics to practice with multiple choice questions."
          placeholder="Grammar topic (e.g., der/die/das, verb conjugation)"
          title="Create New Multiple Choice Exercise"
        />
      </div>
    </ExerciseLayout>
  );
};

export default MultipleChoice;
