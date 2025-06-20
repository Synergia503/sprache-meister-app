
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
    mistakeWords,
    isLoading,
    generateExercise,
    handleAnswerChange,
    checkAnswers,
    createNewExerciseFromMistakes,
    resetExercise,
    loadPreviousExercise
  } = useMultipleChoiceExercise();

  const handlePracticeMistakes = () => {
    createNewExerciseFromMistakes();
  };

  const downloadPDF = () => {
    if (!currentExercise) return;
    
    const content = currentExercise.sentences.map(s => 
      `${s.sentenceOrder}. ${s.sentence}\nA) ${s.options[0]} B) ${s.options[1]} C) ${s.options[2]}`
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
      {!currentExercise ? (
        <WordInputForm
          onGenerateExercise={generateExercise}
          isLoading={isLoading}
          apiKey={apiKey}
          initialWords={mistakeWords.length > 0 ? mistakeWords : ['']}
          description="Add up to 20 German words or phrases. The exercise will generate multiple choice questions with three options each."
          title="Create New Multiple Choice Exercise"
        />
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
    </ExerciseLayout>
  );
};

export default MultipleChoice;
