import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Plus, Star, Loader2, BookOpen, X, Edit, Trash, List, ChevronRight } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { useToast } from '@/hooks/use-toast';
import PhotoWordExtractor from '@/components/PhotoWordExtractor';

interface CustomWord {
  id: string;
  german: string;
  english: string;
  categories: string[];
  dateAdded: Date;
}

interface ExtractedWord {
  german: string;
  english: string;
  categories?: string[];
}

const Custom = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [vocabulary, setVocabulary] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGermanWord, setNewGermanWord] = useState('');
  const [newEnglishWord, setNewEnglishWord] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllWords, setShowAllWords] = useState(false);
  const wordsPerPage = 10;
  
  const [customWords, setCustomWords] = useState<CustomWord[]>([
    { id: '1', german: 'Fernweh', english: 'Wanderlust', categories: ['emotions', 'travel'], dateAdded: new Date() },
    { id: '2', german: 'Gemütlichkeit', english: 'Coziness', categories: ['feelings', 'home'], dateAdded: new Date() },
    { id: '3', german: 'Verschlimmbessern', english: 'To make worse by trying to improve', categories: ['actions', 'irony'], dateAdded: new Date() },
    { id: '4', german: 'Schadenfreude', english: 'Joy from others\' misfortune', categories: ['emotions'], dateAdded: new Date() },
    { id: '5', german: 'Zeitgeist', english: 'Spirit of the age', categories: ['culture', 'philosophy'], dateAdded: new Date() },
    { id: '6', german: 'der Tisch', english: 'table', categories: ['furniture', 'home'], dateAdded: new Date() },
    { id: '7', german: 'das Buch', english: 'book', categories: ['objects', 'education'], dateAdded: new Date() },
    { id: '8', german: 'die Lampe', english: 'lamp', categories: ['furniture', 'lighting'], dateAdded: new Date() },
    { id: '9', german: 'der Stuhl', english: 'chair', categories: ['furniture'], dateAdded: new Date() },
    { id: '10', german: 'das Fenster', english: 'window', categories: ['architecture', 'home'], dateAdded: new Date() },
    { id: '11', german: 'die Tür', english: 'door', categories: ['architecture', 'home'], dateAdded: new Date() },
    { id: '12', german: 'der Computer', english: 'computer', categories: ['technology', 'electronics'], dateAdded: new Date() },
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
      categories: [],
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
      categories: word.categories || [],
      dateAdded: new Date(),
    }));

    setCustomWords(prev => [...newWords, ...prev]);
  };

  const handleWordClick = (wordId: string) => {
    navigate(`/vocabulary/custom/${wordId}`);
  };

  const totalPages = Math.ceil(customWords.length / wordsPerPage);
  const paginatedWords = customWords.slice(
    (currentPage - 1) * wordsPerPage,
    currentPage * wordsPerPage
  );

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

        {/* All Words List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List className="h-5 w-5" />
                All Custom Words ({customWords.length})
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowAllWords(!showAllWords)}
              >
                {showAllWords ? 'Hide List' : 'Show All Words'}
              </Button>
            </CardTitle>
          </CardHeader>
          {showAllWords && (
            <CardContent>
              <div className="space-y-3">
                {paginatedWords.map((word) => (
                  <div 
                    key={word.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleWordClick(word.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium">{word.german}</span>
                        <span className="text-muted-foreground">—</span>
                        <span>{word.english}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {word.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
                
                {totalPages > 1 && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </CardContent>
          )}
        </Card>

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
                  <div 
                    key={word.id} 
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleWordClick(word.id)}
                  >
                    <div className="flex-1">
                      <div className="mb-1">
                        <span className="font-medium">{word.german}</span> - {word.english}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {word.categories.slice(0, 3).map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {word.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{word.categories.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWord(word.id);
                        }}
                        className="h-6 w-6"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
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
