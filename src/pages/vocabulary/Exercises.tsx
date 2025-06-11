
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpenText, Target, Loader2 } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';

const Exercises = () => {
  const [activeExercise, setActiveExercise] = useState('');
  const [exerciseContent, setExerciseContent] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const { callOpenAI, isLoading, apiKey, saveApiKey } = useOpenAI();

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

  const generateExercise = async (exerciseId: string, title: string) => {
    setActiveExercise(exerciseId);
    setUserAnswer('');
    setFeedback('');

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
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Vocabulary Exercises</h1>
      
      <ApiKeyInput apiKey={apiKey} onSaveApiKey={saveApiKey} />
      
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
            <Card>
              <CardHeader>
                <CardTitle>Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{feedback}</div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Exercises;
