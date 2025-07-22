import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Equal, Loader2, CheckCircle } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { useSameMeaningExercise } from '@/hooks/useSameMeaningExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';
import { VocabularySelector } from '@/components/VocabularySelector';

const SameMeaning = () => {
  const { apiKey } = useOpenAI();
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
  } = useSameMeaningExercise();

  return (
    <ExerciseLayout
      title="Same Meaning Exercise"
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
      currentExercise={currentExercise}
    >
      {currentExercise && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Find a word with the same meaning (synonym) for each word</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentExercise.exercises.map((exercise) => (
                <div key={exercise.exerciseOrder} className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-2">
                      {exercise.exerciseOrder}. Find a synonym for "{exercise.word}"
                    </p>
                    <p className="text-sm text-muted-foreground">
                      English meaning: {exercise.englishMeaning}
                    </p>
                    {exercise.hint && showResults && (
                      <p className="text-sm text-blue-600">
                        Hint: {exercise.hint}
                      </p>
                    )}
                  </div>
                  
                  <Input
                    placeholder="Enter a word with similar meaning in German"
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
          exerciseType="same-meaning"
          exercisePath="/exercises/same-meaning"
          title="Use Vocabulary from Category"
          description="Select a category from your vocabulary to create synonym exercises."
        />
        
        <WordInputForm
          onGenerateExercise={generateExercise}
          isLoading={isLoading}
          apiKey={apiKey}
          description="Add German words to find their synonyms (words with similar meanings)."
          placeholder="German word (e.g., schön, schnell)"
          title="Create New Same Meaning Exercise"
        />
      </div>
    </ExerciseLayout>
  );
};

export default SameMeaning;