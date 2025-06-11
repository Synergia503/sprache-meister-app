
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Loader2 } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';

const Categorized = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [vocabulary, setVocabulary] = useState('');
  const { callOpenAI, isLoading, apiKey, saveApiKey } = useOpenAI();

  const categories = [
    { name: "Animals", description: "Learn animal names in German" },
    { name: "Food & Drinks", description: "Food and beverage vocabulary" },
    { name: "Travel", description: "Travel-related vocabulary" },
    { name: "Family", description: "Family members and relationships" },
    { name: "Weather", description: "Weather conditions and seasons" },
    { name: "Shopping", description: "Shopping and retail vocabulary" }
  ];

  const generateVocabulary = async (category: string) => {
    setSelectedCategory(category);
    const prompt = `Generate a comprehensive vocabulary list for the category "${category}" in German. Include 15-20 words with their German article (der/die/das), English translation, and a simple example sentence in German with English translation.`;
    const systemMessage = "You are a German language teacher creating vocabulary lists for students.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setVocabulary(result);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Categorized Vocabulary</h1>
      
      <ApiKeyInput apiKey={apiKey} onSaveApiKey={saveApiKey} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {categories.map((category) => (
          <Card key={category.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => generateVocabulary(category.name)}
                disabled={isLoading || !apiKey}
              >
                {isLoading && selectedCategory === category.name ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'View Category'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {vocabulary && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedCategory} Vocabulary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{vocabulary}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Categorized;
