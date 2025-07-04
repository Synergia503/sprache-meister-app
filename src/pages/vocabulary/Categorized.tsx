
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Loader2, FileText, Target, Languages, Link, BookOpenText, PenTool, Shuffle } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { AnkiExport } from '@/components/AnkiExport';
import { useNavigate } from 'react-router-dom';

const Categorized = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [vocabulary, setVocabulary] = useState('');
  const [showAnkiExport, setShowAnkiExport] = useState(false);
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [selectedCategoryForExercise, setSelectedCategoryForExercise] = useState<any>(null);
  const { callOpenAI, isLoading, apiKey, saveApiKey } = useOpenAI();
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
    setSelectedCategoryForExercise(category);
    const samplesText = category.samples.map((sample: any, index: number) => 
      `${index + 1}. ${sample.german} - ${sample.english}`
    ).join('\n');
    setVocabulary(`Sample vocabulary for ${category.name}:\n\n${samplesText}`);
    setShowAnkiExport(true);
  };

  const sendToExercise = (exercisePath: string) => {
    if (selectedCategoryForExercise && selectedCategoryForExercise.samples) {
      // Create word list from category samples
      const wordList = selectedCategoryForExercise.samples.map((sample: any) => sample.german).join('\n');
      sessionStorage.setItem('wordListForExercise', wordList);
    }
    navigate(exercisePath);
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

      {/* Exercise Selection Modal */}
      {showExerciseSelection && selectedCategoryForExercise && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Choose Exercise for {selectedCategoryForExercise.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-4">
              {exercises.map((exercise) => {
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
            <Button 
              variant="ghost" 
              onClick={() => setShowExerciseSelection(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {vocabulary && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{selectedCategory} Vocabulary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap mb-4">{vocabulary}</div>
              
              {/* Send to Exercise button appears only after viewing samples */}
              {selectedCategoryForExercise && (
                <div className="mt-4">
                  <Button 
                    onClick={() => setShowExerciseSelection(true)}
                    className="w-full"
                  >
                    Send to Exercise
                  </Button>
                </div>
              )}
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
