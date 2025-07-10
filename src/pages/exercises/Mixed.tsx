
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shuffle, Loader2 } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';

const Mixed = () => {
  const [exercise, setExercise] = useState('');
  const [response, setResponse] = useState('');
  const { callOpenAI, isLoading, apiKey, saveApiKey } = useOpenAI();

  const generateExercise = async () => {
    const prompt = "Generate a mixed German language exercise that combines vocabulary, grammar, and comprehension. Include instructions in English and provide the exercise content.";
    const systemMessage = "You are a German language teacher creating mixed exercises for intermediate students.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setExercise(result);
      setResponse('');
    }
  };

  const checkAnswer = async () => {
    if (!exercise || !response) return;
    
    const prompt = `Exercise: ${exercise}\n\nStudent's response: ${response}\n\nPlease evaluate this response and provide feedback in English.`;
    const systemMessage = "You are a German language teacher providing feedback on student exercises.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setResponse(result);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mixed Exercises</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5" />
              AI-Generated Mixed Exercise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateExercise} 
              disabled={isLoading || !apiKey}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate New Exercise'
              )}
            </Button>
            
            {exercise && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Exercise:</h3>
                  <div className="whitespace-pre-wrap">{exercise}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Your Response:</label>
                  <Textarea
                    placeholder="Enter your answer here..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <Button 
                  onClick={checkAnswer} 
                  disabled={isLoading || !response.trim()}
                  variant="outline"
                >
                  Check Answer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Mixed;
