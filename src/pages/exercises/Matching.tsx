
import { useOpenAI } from '@/hooks/useOpenAI';
import { useMatchingExercise } from '@/hooks/useMatchingExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { MatchingExerciseDisplay } from '@/components/exercises/MatchingExerciseDisplay';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';

const Matching = () => {
  const { apiKey, saveApiKey } = useOpenAI();
  const {
    currentExercise,
    userMatches,
    showResults,
    shuffledEnglish,
    previousExercises,
    isLoading,
    generateExercise,
    handleMatch,
    checkAnswers,
    getMatchingResult,
    resetExercise,
    loadPreviousExercise,
    shuffleEnglishWords
  } = useMatchingExercise();

  const downloadPDF = () => {
    if (!currentExercise) return;
    
    const content = currentExercise.pairs.map(p => 
      `${p.germanWord} - ${p.englishWord}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matching-exercise.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ExerciseLayout
      title="Matching Exercise"
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
          description="Add up to 20 German words or phrases. The exercise will create German-English matching pairs."
          placeholder="German word"
          title="Create New Matching Exercise"
        />
      ) : (
        <MatchingExerciseDisplay
          exercise={currentExercise}
          userMatches={userMatches}
          showResults={showResults}
          shuffledEnglish={shuffledEnglish}
          onMatch={handleMatch}
          onCheckAnswers={checkAnswers}
          onShuffle={shuffleEnglishWords}
          onNewExercise={resetExercise}
          getMatchingResult={getMatchingResult}
        />
      )}
    </ExerciseLayout>
  );
};

export default Matching;
