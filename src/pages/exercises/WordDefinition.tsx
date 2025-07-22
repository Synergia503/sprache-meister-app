import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Loader2, CheckCircle } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { useWordDefinitionExercise } from '@/hooks/useWordDefinitionExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';
import { VocabularySelector } from '@/components/VocabularySelector';

const WordDefinition = () => {
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
  } = useWordDefinitionExercise();

  return (
    <ExerciseLayout
      title="Word Definition Exercise"
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
      currentExercise={currentExercise}
    >
      {currentExercise && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Write the German word that matches each definition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentExercise.exercises.map((exercise) => (
                <div key={exercise.exerciseOrder} className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-2">
                      {exercise.exerciseOrder}. {exercise.definition}
                    </p>
                    {exercise.hint && showResults && (
                      <p className="text-sm text-blue-600">
                        Hint: {exercise.hint}
                      </p>
                    )}
                  </div>
                  
                  <Input
                    placeholder="Enter the German word"
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
          exerciseType="word-definition"
          exercisePath="/exercises/word-definition"
          title="Use Vocabulary from Category"
          description="Select a category from your vocabulary to create definition exercises."
        />
        
        <WordInputForm
          onGenerateExercise={generateExercise}
          isLoading={isLoading}
          apiKey={apiKey}
          description="Add German words to create definition-based exercises."
          placeholder="German word (e.g., Haus, laufen)"
          title="Create New Word Definition Exercise"
        />
      </div>
    </ExerciseLayout>
  );
};

export default WordDefinition;