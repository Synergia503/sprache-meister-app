
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

  const downloadPDF = () => {
    if (!currentExercise) return;
    
    const content = currentExercise.sentences.map(s => 
      `${s.sentenceOrder}. ${s.sentence}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gap-fill-exercise.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ExerciseLayout
      title="Gap-Fill Exercise"
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
          description="Add up to 20 German words or phrases. The exercise will generate 2-4 times as many sentences with gaps."
          title="Create New Gap-Fill Exercise"
        />
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
    </ExerciseLayout>
  );
};

export default GapFill;
