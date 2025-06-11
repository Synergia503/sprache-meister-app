
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpenText, Loader2 } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';

const DescribePicture = () => {
  const [scenario, setScenario] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const { callOpenAI, isLoading, apiKey, saveApiKey } = useOpenAI();

  const generateScenario = async () => {
    const prompt = "Create a detailed description of a scene or picture that a German language student should describe. Include specific details about people, objects, actions, and setting that would help practice German vocabulary and sentence structure.";
    const systemMessage = "You are a German language teacher creating picture description exercises.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setScenario(result);
      setDescription('');
      setFeedback('');
    }
  };

  const checkDescription = async () => {
    if (!scenario || !description) return;
    
    const prompt = `Picture scenario: ${scenario}\n\nStudent's German description: ${description}\n\nPlease evaluate this German description, check grammar, vocabulary usage, and provide constructive feedback in English.`;
    const systemMessage = "You are a German language teacher providing feedback on picture description exercises.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setFeedback(result);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Describe a Picture</h1>
      
      <ApiKeyInput apiKey={apiKey} onSaveApiKey={saveApiKey} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenText className="h-5 w-5" />
            Picture Description Exercise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={generateScenario} 
            disabled={isLoading || !apiKey}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate New Picture Scenario'
            )}
          </Button>
          
          {scenario && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Picture to Describe:</h3>
                <div className="whitespace-pre-wrap">{scenario}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Your German Description:</label>
                <Textarea
                  placeholder="Beschreiben Sie das Bild auf Deutsch..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                />
              </div>
              
              <Button 
                onClick={checkDescription} 
                disabled={isLoading || !description.trim()}
                variant="outline"
              >
                Get Feedback
              </Button>
              
              {feedback && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium mb-2 text-green-800">Feedback:</h3>
                  <div className="whitespace-pre-wrap text-green-700">{feedback}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DescribePicture;
