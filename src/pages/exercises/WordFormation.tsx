import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers, Loader2, CheckCircle } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { useWordFormationExercise } from '@/hooks/useWordFormationExercise';
import { WordInputForm } from '@/components/exercises/WordInputForm';
import { ExerciseLayout } from '@/components/exercises/ExerciseLayout';
import { VocabularySelector } from '@/components/VocabularySelector';

const WordFormation = () => {
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
  } = useWordFormationExercise();

  return (
    <ExerciseLayout
      title="Word Formation Exercise"
      previousExercises={previousExercises}
      onLoadExercise={loadPreviousExercise}
      currentExercise={currentExercise}
    >
      {currentExercise && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create new words using prefixes and suffixes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentExercise.exercises.map((exercise) => (
                <div key={exercise.exerciseOrder} className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-2">
                      {exercise.exerciseOrder}. {exercise.instruction}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Base word: <span className="font-medium">{exercise.baseWord}</span>
                    </p>
                    {exercise.hint && showResults && (
                      <p className="text-sm text-blue-600">
                        Hint: {exercise.hint}
                      </p>
                    )}
                    {!showResults && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Toggle hint visibility for this specific exercise
                          const hintElement = document.getElementById(`hint-${exercise.exerciseOrder}`);
                          if (hintElement) {
                            hintElement.style.display = hintElement.style.display === 'none' ? 'block' : 'none';
                          }
                        }}
                        className="text-xs"
                      >
                        Show Hint
                      </Button>
                    )}
                    <div id={`hint-${exercise.exerciseOrder}`} style={{ display: 'none' }} className="text-sm text-blue-600">
                      Hint: {exercise.hint}
                    </div>
                  </div>
                  
                  <Input
                    placeholder="Your answer"
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
                    <Button onClick={resetExercise}>
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
          exerciseType="word-formation"
          exercisePath="/exercises/word-formation"
          title="Use Vocabulary from Category"
          description="Select a category from your vocabulary to create word formation exercises."
        />
        
        <WordInputForm
          onGenerateExercise={generateExercise}
          isLoading={isLoading}
          apiKey={apiKey}
          description="Add German base words to practice word formation with prefixes and suffixes."
          placeholder="Base word (e.g., spielen, Haus)"
          title="Create New Word Formation Exercise"
        />
      </div>
    </ExerciseLayout>
  );
};

export default WordFormation;