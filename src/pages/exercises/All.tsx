
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenText, Target, PenTool, Shuffle, Loader2, FileText, Languages, Link } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { useNavigate } from 'react-router-dom';

const All = () => {
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
    navigate(exercisePath);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Exercises</h1>
      
      <ApiKeyInput apiKey={apiKey} onSaveApiKey={saveApiKey} />
      
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              To use exercises with specific vocabulary, go to <strong>Vocabulary → Categorized</strong> or <strong>Vocabulary → Custom</strong> and use the "Send to Exercise" feature to practice with selected words.
            </p>
          </CardContent>
        </Card>
      </div>

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
                  Start Exercise
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
