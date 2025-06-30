
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
    selectedGerman,
    selectedEnglish,
    previousExercises,
    isLoading,
    generateExercise,
    handleMatch,
    handleSelectGerman,
    handleSelectEnglish,
    checkAnswers,
    getMatchingResult,
    resetExercise,
    loadPreviousExercise,
    shuffleEnglishWords
  } = useMatchingExercise();

  return (
    <ExerciseLayout
      title="Matching Exercise"
      apiKey={apiKey}
      onSaveApiKey={saveApiKey}
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
      currentExercise={currentExercise}
    >
      {currentExercise && (
        <MatchingExerciseDisplay
          exercise={currentExercise}
          userMatches={userMatches}
          showResults={showResults}
          shuffledEnglish={shuffledEnglish}
          selectedGerman={selectedGerman}
          selectedEnglish={selectedEnglish}
          onMatch={handleMatch}
          onCheckAnswers={checkAnswers}
          onShuffle={shuffleEnglishWords}
          onNewExercise={resetExercise}
          onSelectGerman={handleSelectGerman}
          onSelectEnglish={handleSelectEnglish}
          getMatchingResult={getMatchingResult}
        />
      )}
      
      <WordInputForm
        onGenerateExercise={generateExercise}
        isLoading={isLoading}
        apiKey={apiKey}
        description="Add up to 20 German words or phrases. The exercise will create German-English matching pairs."
        placeholder="German word"
        title="Create New Matching Exercise"
      />
    </ExerciseLayout>
  );
};

export default Matching;
