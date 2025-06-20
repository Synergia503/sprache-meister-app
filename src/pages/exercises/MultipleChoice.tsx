
import { useOpenAI } from '@/hooks/useOpenAI';
import { useMultipleChoiceExercise } from '@/hooks/useMultipleChoiceExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { MultipleChoiceExerciseDisplay } from '@/components/exercises/MultipleChoiceExerciseDisplay';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';

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

  const downloadPDF = () => {
    if (!currentExercise) return;
    
    const content = currentExercise.sentences.map(s => 
      `${s.sentenceOrder}. ${s.sentence}\n   Options: ${s.options.join(', ')}\n   Answer: ${s.solution}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'multiple-choice-exercise.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ExerciseLayout
      title="Multiple Choice Exercise"
      apiKey={apiKey}
      onSaveApiKey={saveApiKey}
      onDownload={currentExercise ? downloadPDF : undefined}
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
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
      
      <WordInputForm
        onGenerateExercise={generateExercise}
        isLoading={isLoading}
        apiKey={apiKey}
        description="Add German grammar topics to practice with multiple choice questions."
        placeholder="Grammar topic (e.g., der/die/das, verb conjugation)"
        title="Create New Multiple Choice Exercise"
      />
    </ExerciseLayout>
  );
};

export default MultipleChoice;
