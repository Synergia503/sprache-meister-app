
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpenText, Target, PenTool, Shuffle, Loader2, FileText, Languages, Link } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { useNavigate } from 'react-router-dom';

const All = () => {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [wordList, setWordList] = useState('');
  const { isLoading, apiKey, saveApiKey } = useOpenAI();
  const navigate = useNavigate();

  const exercises = [
    {
      id: 'gap-fill',
      title: 'Gap-Fill',
      description: 'Fill in the blanks with correct German words',
      icon: FileText,
      path: '/exercises/gap-fill'
    },
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Choose the correct answer from multiple options',
      icon: Target,
      path: '/exercises/multiple-choice'
    },
    {
      id: 'translation',
      title: 'Translation',
      description: 'Translate between German and English',
      icon: Languages,
      path: '/exercises/translation'
    },
    {
      id: 'matching',
      title: 'Matching',
      description: 'Match German words with their English translations',
      icon: Link,
      path: '/exercises/matching'
    },
    {
      id: 'describe-picture',
      title: 'Describe a Picture',
      description: 'Practice describing images in German',
      icon: BookOpenText,
      path: '/exercises/describe-picture'
    },
    {
      id: 'grammar',
      title: 'Grammar',
      description: 'Practice German grammar rules',
      icon: PenTool,
      path: '/exercises/grammar'
    },
    {
      id: 'mixed',
      title: 'Mixed',
      description: 'Mixed exercises for comprehensive practice',
      icon: Shuffle,
      path: '/exercises/mixed'
    }
  ];

  const sendToExercise = (exercisePath: string) => {
    if (wordList.trim()) {
      // Store the word list in sessionStorage to pass to the exercise
      sessionStorage.setItem('wordListForExercise', wordList.trim());
    }
    navigate(exercisePath);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Exercises</h1>
      
      <ApiKeyInput apiKey={apiKey} onSaveApiKey={saveApiKey} />
      
      {/* Word List Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Send Word List to Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Word List (optional - one word per line)
              </label>
              <textarea
                className="w-full h-32 p-3 border rounded-md resize-none"
                placeholder="Enter German words or phrases, one per line:&#10;Hund&#10;Katze&#10;Haus&#10;Auto"
                value={wordList}
                onChange={(e) => setWordList(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Add words here and then click on any exercise below to create a custom exercise with these words.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => {
          const IconComponent = exercise.icon;
          return (
            <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {exercise.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{exercise.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => sendToExercise(exercise.path)}
                  disabled={isLoading}
                >
                  {wordList.trim() ? 'Start with Word List' : 'Start Exercise'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default All;
