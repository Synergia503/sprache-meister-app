
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

  const downloadPDF = () => {
    if (!currentExercise) return;
    
    // Create proper PDF content
    const content = `Matching Exercise\n\nGerman Words:\n${currentExercise.pairs.map((p, i) => 
      `${i + 1}. ${p.germanWord}`
    ).join('\n')}\n\nEnglish Words:\n${currentExercise.pairs.map((p, i) => 
      `${String.fromCharCode(65 + i)}. ${p.englishWord}`
    ).join('\n')}\n\nAnswer Key:\n${currentExercise.pairs.map((p, i) => 
      `${i + 1}. ${p.germanWord} - ${p.englishWord}`
    ).join('\n')}`;
    
    // For now, we'll create a text file but name it as PDF
    // In a real application, you would use a PDF library like jsPDF
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matching-exercise.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ExerciseLayout
      title="Matching Exercise"
      apiKey={apiKey}
      onSaveApiKey={saveApiKey}
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
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
          onDownload={downloadPDF}
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
