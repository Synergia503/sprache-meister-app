
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Loader2 } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { AnkiExport } from '@/components/AnkiExport';

const Categorized = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [vocabulary, setVocabulary] = useState('');
  const [showAnkiExport, setShowAnkiExport] = useState(false);
  const { callOpenAI, isLoading, apiKey, saveApiKey } = useOpenAI();

  const categories = [
    { 
      name: "Animals", 
      description: "Learn animal names in German",
      samples: [
        { german: "der Hund", english: "dog" },
        { german: "die Katze", english: "cat" },
        { german: "das Pferd", english: "horse" },
        { german: "der Vogel", english: "bird" },
        { german: "der Fisch", english: "fish" }
      ]
    },
    { 
      name: "Food & Drinks", 
      description: "Food and beverage vocabulary",
      samples: [
        { german: "das Brot", english: "bread" },
        { german: "die Milch", english: "milk" },
        { german: "das Wasser", english: "water" },
        { german: "der Apfel", english: "apple" },
        { german: "das Fleisch", english: "meat" }
      ]
    },
    { 
      name: "Travel", 
      description: "Travel-related vocabulary",
      samples: [
        { german: "der Flughafen", english: "airport" },
        { german: "das Hotel", english: "hotel" },
        { german: "der Zug", english: "train" },
        { german: "die Reise", english: "trip/journey" },
        { german: "der Koffer", english: "suitcase" }
      ]
    },
    { 
      name: "Family", 
      description: "Family members and relationships",
      samples: [
        { german: "die Familie", english: "family" },
        { german: "der Vater", english: "father" },
        { german: "die Mutter", english: "mother" },
        { german: "das Kind", english: "child" },
        { german: "die Schwester", english: "sister" }
      ]
    },
    { 
      name: "Weather", 
      description: "Weather conditions and seasons",
      samples: [
        { german: "das Wetter", english: "weather" },
        { german: "die Sonne", english: "sun" },
        { german: "der Regen", english: "rain" },
        { german: "der Schnee", english: "snow" },
        { german: "der Wind", english: "wind" }
      ]
    },
    { 
      name: "Shopping", 
      description: "Shopping and retail vocabulary",
      samples: [
        { german: "das Geschäft", english: "store/shop" },
        { german: "der Preis", english: "price" },
        { german: "das Geld", english: "money" },
        { german: "kaufen", english: "to buy" },
        { german: "verkaufen", english: "to sell" }
      ]
    }
  ];

  const generateVocabulary = async (category: any) => {
    setSelectedCategory(category.name);
    const prompt = `Generate a comprehensive vocabulary list for the category "${category.name}" in German. Include 15-20 words with their German article (der/die/das), English translation, and a simple example sentence in German with English translation.`;
    const systemMessage = "You are a German language teacher creating vocabulary lists for students.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setVocabulary(result);
    }
  };

  const showSamples = (category: any) => {
    setSelectedCategory(category.name);
    const samplesText = category.samples.map((sample: any, index: number) => 
      `${index + 1}. ${sample.german} - ${sample.english}`
    ).join('\n');
    setVocabulary(`Sample vocabulary for ${category.name}:\n\n${samplesText}`);
    setShowAnkiExport(true);
  };

  const getAnkiItems = () => {
    const selectedCat = categories.find(cat => cat.name === selectedCategory);
    if (!selectedCat) return [];
    
    return selectedCat.samples.map(sample => ({
      front: sample.german,
      back: sample.english,
      tags: [selectedCategory.toLowerCase().replace(/\s+/g, '-'), 'german-vocabulary']
    }));
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
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => showSamples(category)}
                >
                  View Samples
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => generateVocabulary(category)}
                  disabled={isLoading || !apiKey}
                >
                  {isLoading && selectedCategory === category.name ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Generate More'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vocabulary && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{selectedCategory} Vocabulary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">{vocabulary}</div>
            </CardContent>
          </Card>

          {showAnkiExport && (
            <AnkiExport 
              items={getAnkiItems()}
              defaultDeckName={`German - ${selectedCategory}`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Categorized;
