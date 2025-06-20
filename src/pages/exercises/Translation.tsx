
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

  const downloadPDF = () => {
    if (!currentExercise) return;
    
    const content = currentExercise.sentences.map(s => 
      `${s.sentenceOrder}. ${s.germanSentence}\n   English: ${s.englishSentence}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation-exercise.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ExerciseLayout
      title="Translation Exercise"
      apiKey={apiKey}
      onSaveApiKey={saveApiKey}
      onDownload={currentExercise ? downloadPDF : undefined}
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
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
