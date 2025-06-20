
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { useGapFillExercise } from '@/hooks/useGapFillExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { ExerciseDisplay } from '@/components/exercises/ExerciseDisplay';
import { PreviousExercises } from '@/components/exercises/PreviousExercises';

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gap-Fill Exercise</h1>
        {currentExercise && (
          <Button onClick={downloadPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        )}
      </div>
      
      <ApiKeyInput apiKey={apiKey} onSaveApiKey={saveApiKey} />

      {!currentExercise ? (
        <WordInputForm
          onGenerateExercise={generateExercise}
          isLoading={isLoading}
          apiKey={apiKey}
          initialWords={mistakeWords.length > 0 ? mistakeWords : [''] }
        />
      ) : (
        <div className="space-y-4">
          <ExerciseDisplay
            exercise={currentExercise}
            userAnswers={userAnswers}
            showResults={showResults}
            onAnswerChange={handleAnswerChange}
            onCheckAnswers={checkAnswers}
            onPracticeMistakes={handlePracticeMistakes}
            onNewExercise={resetExercise}
          />
        </div>
      )}

      <PreviousExercises 
        exercises={previousExercises} 
        onLoadExercise={loadPreviousExercise} 
      />
    </div>
  );
};

export default GapFill;
