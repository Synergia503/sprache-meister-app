
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpenText, Target, Loader2, FileText, Languages, Link, PenTool, Shuffle } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { AnkiExport } from '@/components/AnkiExport';
import { useNavigate } from 'react-router-dom';

const Exercises = () => {
  const [activeExercise, setActiveExercise] = useState('');
  const [exerciseContent, setExerciseContent] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showAnkiExport, setShowAnkiExport] = useState(false);
  const [showDirectExerciseSelection, setShowDirectExerciseSelection] = useState(false);
  const { callOpenAI, isLoading, apiKey, saveApiKey } = useOpenAI();
  const navigate = useNavigate();

  const exercises = [
    {
      id: 'matching',
      title: 'Word Matching',
      description: 'Match German words with their English translations',
      icon: BookOpenText
    },
    {
      id: 'fill-blanks',
      title: 'Fill in the Blanks',
      description: 'Complete sentences with the correct vocabulary',
      icon: Target
    },
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Choose the correct translation from options',
      icon: BookOpenText
    }
  ];

  const directExercises = [
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

  const generateExercise = async (exerciseId: string, title: string) => {
    setActiveExercise(exerciseId);
    setUserAnswer('');
    setFeedback('');
    setShowAnkiExport(false);

    let prompt = '';
    switch (exerciseId) {
      case 'matching':
        prompt = "Create a word matching exercise with 8 German words and their English translations. Present them in a clear format for matching.";
        break;
      case 'fill-blanks':
        prompt = "Create 5 German sentences with missing vocabulary words. Provide the sentences with blanks and a word bank.";
        break;
      case 'multiple-choice':
        prompt = "Create 5 multiple choice questions where students choose the correct German translation of English words. Provide 4 options for each question.";
        break;
    }

    const systemMessage = "You are a German language teacher creating vocabulary exercises for intermediate students.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setExerciseContent(result);
    }
  };

  const checkAnswer = async () => {
    if (!exerciseContent || !userAnswer) return;
    
    const prompt = `Exercise: ${exerciseContent}\n\nStudent's answers: ${userAnswer}\n\nPlease evaluate these answers and provide detailed feedback with correct answers and explanations.`;
    const systemMessage = "You are a German language teacher providing feedback on vocabulary exercises.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setFeedback(result);
      setShowAnkiExport(true);
    }
  };

  const sendToExercise = (exercisePath: string) => {
    // Clear any existing word list for direct navigation
    sessionStorage.removeItem('wordListForExercise');
    navigate(exercisePath);
  };

  // Extract vocabulary from exercise content for Anki export
  const getAnkiItems = () => {
    if (!exerciseContent) return [];
    
    // Simple extraction - this could be enhanced based on exercise format
    const lines = exerciseContent.split('\n');
    const items: Array<{ front: string; back: string; tags: string[] }> = [];
    
    lines.forEach(line => {
      // Look for patterns like "German word - English word" or "1. German - English"
      const match = line.match(/([A-Za-zÄÖÜäöüß\s]+)\s*-\s*([A-Za-z\s]+)/);
      if (match) {
        items.push({
          front: match[1].trim(),
          back: match[2].trim(),
          tags: ['vocabulary-exercise', activeExercise]
        });
      }
    });
    
    return items;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Vocabulary Exercises</h1>
      
      {/* Send to Direct Exercise Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Go to Exercise Types</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Navigate directly to specific exercise types to practice with custom word lists or general exercises.
          </p>
          <Button 
            onClick={() => setShowDirectExerciseSelection(!showDirectExerciseSelection)}
            variant="outline"
            className="mb-4"
          >
            {showDirectExerciseSelection ? 'Hide' : 'Show'} Exercise Types
          </Button>
          
          {showDirectExerciseSelection && (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {directExercises.map((exercise) => {
                const IconComponent = exercise.icon;
                return (
                  <Button
                    key={exercise.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => sendToExercise(exercise.path)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-medium">{exercise.title}</div>
                      <div className="text-xs text-muted-foreground">{exercise.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
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
                  onClick={() => generateExercise(exercise.id, exercise.title)}
                  disabled={isLoading || !apiKey}
                >
                  {isLoading && activeExercise === exercise.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Start Exercise'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {exerciseContent && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap mb-4">{exerciseContent}</div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Answers:</label>
                  <Input
                    placeholder="Enter your answers (e.g., 1-A, 2-B, 3-C...)"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={checkAnswer} 
                  disabled={isLoading || !userAnswer.trim()}
                  variant="outline"
                >
                  Submit Answers
                </Button>
              </div>
            </CardContent>
          </Card>

          {feedback && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap">{feedback}</div>
                </CardContent>
              </Card>

              {showAnkiExport && getAnkiItems().length > 0 && (
                <AnkiExport 
                  items={getAnkiItems()}
                  defaultDeckName="German Vocabulary Exercise"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Exercises;
