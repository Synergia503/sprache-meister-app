import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Star, Loader2, BookOpen } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';

const Custom = () => {
  const [topic, setTopic] = useState('');
  const [vocabulary, setVocabulary] = useState('');
  const { callOpenAI, isLoading, apiKey, saveApiKey } = useOpenAI();

  const generateCustomVocabulary = async () => {
    if (!topic.trim()) return;
    
    const prompt = `Generate a custom German vocabulary list for the topic "${topic}". Include 10-15 relevant words with their German article (der/die/das), English translation, and pronunciation guide if needed.`;
    const systemMessage = "You are a German language teacher creating custom vocabulary lists based on student interests.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setVocabulary(result);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Custom Vocabulary</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Word
        </Button>
      </div>

      <ApiKeyInput apiKey={apiKey} onSaveApiKey={saveApiKey} />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Generate Custom Vocabulary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter a topic (e.g., cooking, sports, technology...)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={generateCustomVocabulary}
                disabled={isLoading || !apiKey || !topic.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>

            {vocabulary && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Custom Vocabulary for "{topic}":</h3>
                <div className="whitespace-pre-wrap">{vocabulary}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                My Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Your starred vocabulary words</p>
              <div className="mt-4">
                <p><span className="font-medium">Fernweh</span> - Wanderlust</p>
                <p><span className="font-medium">Gemütlichkeit</span> - Coziness</p>
                <p><span className="font-medium">Verschlimmbessern</span> - To make worse by trying to improve</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recent Additions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Recently added custom words</p>
              <div className="mt-4">
                <p><span className="font-medium">Schadenfreude</span> - Joy from others' misfortune</p>
                <p><span className="font-medium">Zeitgeist</span> - Spirit of the age</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Custom;
