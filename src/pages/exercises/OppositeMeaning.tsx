import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight, Loader2, CheckCircle } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { useOppositeMeaningExercise } from '@/hooks/useOppositeMeaningExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';
import { VocabularySelector } from '@/components/VocabularySelector';
import { useLanguage } from '@/contexts/LanguageContext';

const OppositeMeaning = () => {
  const { apiKey } = useOpenAI();
  const { languageSettings } = useLanguage();
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
  } = useOppositeMeaningExercise();

  return (
    <ExerciseLayout
      title={`${languageSettings.targetLanguage.nativeName} Opposite Meaning Exercise`}
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
      currentExercise={currentExercise}
    >
      {currentExercise && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Find the opposite meaning (antonym) for each word</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentExercise.exercises.map((exercise) => (
                <div key={exercise.exerciseOrder} className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-2">
                      {exercise.exerciseOrder}. What is the opposite of "{exercise.word}"?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {languageSettings.nativeLanguage.nativeName} meaning: {exercise.englishMeaning}
                    </p>
                    {exercise.hint && showResults && (
                      <p className="text-sm text-blue-600">
                        Hint: {exercise.hint}
                      </p>
                    )}
                  </div>
                  
                  <Input
                    placeholder={`Enter the opposite word in ${languageSettings.targetLanguage.nativeName}`}
                    value={userAnswers[exercise.exerciseOrder] || ''}
                    onChange={(e) => handleAnswerChange(exercise.exerciseOrder, e.target.value)}
                    disabled={showResults}
                    className={showResults ? 
                      (userAnswers[exercise.exerciseOrder]?.toLowerCase().trim() === exercise.solution.toLowerCase().trim() ? 
                        'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''
                    }
                  />
                  
                  {showResults && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Correct answer:</p>
                      <p className="text-blue-700">{exercise.solution}</p>
                      {exercise.explanation && (
                        <p className="text-sm text-blue-600 mt-1">{exercise.explanation}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex gap-2">
                {!showResults ? (
                  <Button onClick={checkAnswers}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check Answers
                  </Button>
                ) : (
                  <>
                    <Button onClick={resetExercise} variant="outline">
                      Restart Same Exercise
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                      New Exercise
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-6">
        <VocabularySelector
          exerciseType="opposite-meaning"
          exercisePath="/exercises/opposite-meaning"
          title="Use Vocabulary from Category"
          description={`Select a category from your ${languageSettings.targetLanguage.nativeName} vocabulary to create opposite meaning exercises.`}
        />
        
        <WordInputForm
          onGenerateExercise={generateExercise}
          isLoading={isLoading}
          apiKey={apiKey}
          description={`Add ${languageSettings.targetLanguage.nativeName} words to find their opposites (antonyms).`}
          placeholder={`${languageSettings.targetLanguage.nativeName} word (e.g., ${languageSettings.targetLanguage.code === 'de' ? 'groß, schnell' : 'big, fast'})`}
          title={`Create New ${languageSettings.targetLanguage.nativeName} Opposite Meaning Exercise`}
        />
      </div>
    </ExerciseLayout>
  );
};

export default OppositeMeaning;