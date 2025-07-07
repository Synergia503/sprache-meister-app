import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Star, Loader2, BookOpen, X, Edit, Trash } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { useToast } from '@/hooks/use-toast';
import PhotoWordExtractor from '@/components/PhotoWordExtractor';

interface CustomWord {
  id: string;
  german: string;
  english: string;
  dateAdded: Date;
}

interface ExtractedWord {
  german: string;
  english: string;
}

const Custom = () => {
  const [topic, setTopic] = useState('');
  const [vocabulary, setVocabulary] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGermanWord, setNewGermanWord] = useState('');
  const [newEnglishWord, setNewEnglishWord] = useState('');
  const [customWords, setCustomWords] = useState<CustomWord[]>([
    { id: '1', german: 'Fernweh', english: 'Wanderlust', dateAdded: new Date() },
    { id: '2', german: 'Gemütlichkeit', english: 'Coziness', dateAdded: new Date() },
    { id: '3', german: 'Verschlimmbessern', english: 'To make worse by trying to improve', dateAdded: new Date() },
    { id: '4', german: 'Schadenfreude', english: 'Joy from others\' misfortune', dateAdded: new Date() },
    { id: '5', german: 'Zeitgeist', english: 'Spirit of the age', dateAdded: new Date() },
  ]);
  const { callOpenAI, isLoading, apiKey, saveApiKey } = useOpenAI();
  const { toast } = useToast();

  const generateCustomVocabulary = async () => {
    if (!topic.trim()) return;
    
    const prompt = `Generate a custom German vocabulary list for the topic "${topic}". Include 10-15 relevant words with their German article (der/die/das), English translation, and pronunciation guide if needed.`;
    const systemMessage = "You are a German language teacher creating custom vocabulary lists based on student interests.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setVocabulary(result);
    }
  };

  const handleAddCustomWord = () => {
    if (!newGermanWord.trim() || !newEnglishWord.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both German and English words.",
        variant: "destructive",
      });
      return;
    }

    const newWord: CustomWord = {
      id: Date.now().toString(),
      german: newGermanWord.trim(),
      english: newEnglishWord.trim(),
      dateAdded: new Date(),
    };

    setCustomWords(prev => [newWord, ...prev]);
    setNewGermanWord('');
    setNewEnglishWord('');
    setShowAddForm(false);

    toast({
      title: "Word added!",
      description: `"${newWord.german}" has been added to your custom vocabulary.`,
    });
  };

  const handleDeleteWord = (id: string) => {
    setCustomWords(prev => prev.filter(word => word.id !== id));
    toast({
      title: "Word removed",
      description: "The word has been removed from your custom vocabulary.",
    });
  };

  const handleWordsExtracted = (extractedWords: ExtractedWord[]) => {
    const newWords: CustomWord[] = extractedWords.map(word => ({
      id: Date.now().toString() + Math.random(),
      german: word.german,
      english: word.english,
      dateAdded: new Date(),
    }));

    setCustomWords(prev => [...newWords, ...prev]);
  };

  const recentWords = customWords.slice(0, 3);
  const favoriteWords = customWords.slice(0, 3);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Custom Vocabulary</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Word
        </Button>
      </div>

      <ApiKeyInput apiKey={apiKey} onSaveApiKey={saveApiKey} />

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Add Custom Word
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="german-word">German Word</Label>
                <Input
                  id="german-word"
                  placeholder="Enter German word"
                  value={newGermanWord}
                  onChange={(e) => setNewGermanWord(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="english-word">English Translation</Label>
                <Input
                  id="english-word"
                  placeholder="Enter English translation"
                  value={newEnglishWord}
                  onChange={(e) => setNewEnglishWord(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCustomWord}>
                Add Word
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <PhotoWordExtractor onWordsExtracted={handleWordsExtracted} />

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
              <div className="space-y-2">
                {favoriteWords.map((word) => (
                  <div key={word.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div>
                      <span className="font-medium">{word.german}</span> - {word.english}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWord(word.id)}
                      className="h-6 w-6"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
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
              <div className="space-y-2">
                {recentWords.map((word) => (
                  <div key={word.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div>
                      <span className="font-medium">{word.german}</span> - {word.english}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWord(word.id)}
                      className="h-6 w-6"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Custom;
