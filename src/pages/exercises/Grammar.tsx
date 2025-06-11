
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenTool, Loader2 } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';

const Grammar = () => {
  const [exercise, setExercise] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const { callOpenAI, isLoading, apiKey, saveApiKey } = useOpenAI();

  const generateGrammarExercise = async () => {
    const prompt = "Create a German grammar exercise focusing on cases (Nominativ, Akkusativ, Dativ, Genitiv), verb conjugation, or sentence structure. Include clear instructions in English and provide 3-5 practice sentences.";
    const systemMessage = "You are a German language teacher creating grammar exercises for intermediate students.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setExercise(result);
      setAnswer('');
      setFeedback('');
    }
  };

  const checkGrammar = async () => {
    if (!exercise || !answer) return;
    
    const prompt = `Grammar exercise: ${exercise}\n\nStudent's answers: ${answer}\n\nPlease check the grammar, provide corrections if needed, and explain the rules in English.`;
    const systemMessage = "You are a German language teacher providing detailed grammar feedback.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setFeedback(result);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Grammar Exercises</h1>
      
      <ApiKeyInput apiKey={apiKey} onSaveApiKey={saveApiKey} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            AI-Generated Grammar Practice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={generateGrammarExercise} 
            disabled={isLoading || !apiKey}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Grammar Exercise'
            )}
          </Button>
          
          {exercise && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Grammar Exercise:</h3>
                <div className="whitespace-pre-wrap">{exercise}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Your Answers:</label>
                <Textarea
                  placeholder="Enter your answers here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                />
              </div>
              
              <Button 
                onClick={checkGrammar} 
                disabled={isLoading || !answer.trim()}
                variant="outline"
              >
                Check Grammar
              </Button>
              
              {feedback && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium mb-2 text-blue-800">Grammar Feedback:</h3>
                  <div className="whitespace-pre-wrap text-blue-700">{feedback}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Grammar;
