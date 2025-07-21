import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderOpen, Loader2, Plus, Target } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { useNavigate } from 'react-router-dom';
import { vocabularyExerciseService, VocabularyWord } from '@/services/vocabularyExerciseService';
import { useToast } from '@/hooks/use-toast';
import { getExerciseTypes, ExerciseType } from '@/services/exerciseService';

const Categorized = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [wordCount, setWordCount] = useState(10);
  const [generatedWords, setGeneratedWords] = useState<Array<{german: string, english: string}>>([]);
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const { callOpenAI, isLoading, apiKey } = useOpenAI();
  const { getAllCategories, getWordsByCategory, addWord } = useVocabulary();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userCategories = getAllCategories();

  // Load exercise types on component mount
  React.useEffect(() => {
    const loadExerciseTypes = async () => {
      try {
        const types = await getExerciseTypes();
        setExerciseTypes(types);
      } catch (error) {
        console.error('Failed to load exercise types:', error);
      }
    };
    loadExerciseTypes();
  }, []);

  const generateVocabulary = async () => {
    if (!selectedCategory || !apiKey) {
      toast({
        title: "Missing requirements",
        description: "Please select a category and ensure API key is configured.",
        variant: "destructive",
      });
      return;
    }

    const prompt = `Generate exactly ${wordCount} German vocabulary words for the category "${selectedCategory}". 
    Include the German word with proper article (der/die/das where applicable) and its English translation.
    
    Return only a JSON array with this exact format:
    [
      {"german": "der Hund", "english": "dog"},
      {"german": "die Katze", "english": "cat"}
    ]`;

    const systemMessage = "You are a German language teacher creating vocabulary lists. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const words = JSON.parse(result);
        setGeneratedWords(words);
        setSelectedWords(new Set()); // Clear previous selections
        toast({
          title: "Vocabulary generated!",
          description: `Generated ${words.length} words for ${selectedCategory}.`,
        });
      } catch (error) {
        toast({
          title: "Error parsing vocabulary",
          description: "Failed to parse generated vocabulary. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleWordSelection = (index: number) => {
    setSelectedWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const selectAllWords = () => {
    setSelectedWords(new Set(generatedWords.map((_, index) => index)));
  };

  const deselectAllWords = () => {
    setSelectedWords(new Set());
  };

  const addSelectedWordsToVocabulary = () => {
    const wordsToAdd = Array.from(selectedWords).map(index => {
      const word = generatedWords[index];
      return {
        id: Date.now().toString() + Math.random(),
        german: word.german,
        english: word.english,
        categories: [selectedCategory],
        sampleSentence: '',
        dateAdded: new Date(),
        learningHistory: [],
        isFavorite: false,
      };
    });

    wordsToAdd.forEach(word => addWord(word));
    
    toast({
      title: "Words added!",
      description: `Added ${wordsToAdd.length} words to your vocabulary.`,
    });

    // Clear generated words and selections
    setGeneratedWords([]);
    setSelectedWords(new Set());
  };

  const startExerciseWithCategory = () => {
    if (!selectedCategory || !selectedExercise) {
      toast({
        title: "Missing selection",
        description: "Please select both a category and exercise type.",
        variant: "destructive",
      });
      return;
    }

    const categoryWords = getWordsByCategory(selectedCategory);
    if (categoryWords.length === 0) {
      toast({
        title: "No words found",
        description: "This category has no words. Please add some words first.",
        variant: "destructive",
      });
      return;
    }

    // Convert to VocabularyWord format
    const vocabularyWords: VocabularyWord[] = categoryWords.map(word => ({
      id: word.id,
      german: word.german,
      english: word.english,
      categories: word.categories
    }));

    const selectedType = exerciseTypes.find(type => type.id === selectedExercise);
    if (!selectedType) return;

    // Use the service to store exercise data
    vocabularyExerciseService.setExerciseData(
      vocabularyWords,
      selectedCategory,
      selectedExercise
    );

    // Navigate to exercise
    navigate(selectedType.path);
    
    toast({
      title: "Exercise started!",
      description: `Starting ${selectedType.title} with ${categoryWords.length} words from ${selectedCategory}.`,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Categorized Vocabulary</h1>
      
      {/* User Categories Section */}
      {userCategories.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Your Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {userCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="h-auto p-3 text-left"
                  >
                    <div>
                      <div className="font-medium">{category}</div>
                      <div className="text-xs text-muted-foreground">
                        {getWordsByCategory(category).length} words
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              {selectedCategory && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Generate more words for "{selectedCategory}"</h3>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="word-count">Count:</Label>
                      <Input
                        id="word-count"
                        type="number"
                        min="5"
                        max="50"
                        value={wordCount}
                        onChange={(e) => setWordCount(parseInt(e.target.value) || 10)}
                        className="w-20"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateVocabulary}
                    disabled={isLoading || !apiKey}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating {wordCount} words...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate {wordCount} New Words
                      </>
                    )}
                  </Button>

                  {/* Exercise Selection */}
                  <div className="space-y-3">
                    <Label>Start Exercise with Category</Label>
                    <div className="flex gap-3">
                      <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Choose exercise type" />
                        </SelectTrigger>
                        <SelectContent>
                          {exerciseTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        onClick={startExerciseWithCategory}
                        disabled={!selectedExercise || getWordsByCategory(selectedCategory).length === 0}
                        className="flex items-center gap-2"
                      >
                        <Target className="h-4 w-4" />
                        Start Exercise
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Words Section */}
      {generatedWords.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generated Words for "{selectedCategory}"</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllWords}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAllWords}>
                  Deselect All
                </Button>
                <span className="text-sm text-muted-foreground self-center">
                  {selectedWords.size} of {generatedWords.length} selected
                </span>
              </div>

              <div className="grid gap-2">
                {generatedWords.map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={selectedWords.has(index)}
                      onCheckedChange={() => toggleWordSelection(index)}
                    />
                    <div className="flex-1">
                      <span className="font-medium">{word.german}</span>
                      <span className="text-muted-foreground mx-2">—</span>
                      <span>{word.english}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={addSelectedWordsToVocabulary}
                disabled={selectedWords.size === 0}
                className="w-full"
              >
                Add {selectedWords.size} Selected Words to Vocabulary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {userCategories.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Categories Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add some words to your custom vocabulary first to see categories here.
            </p>
            <Button onClick={() => navigate('/vocabulary/custom')}>
              Go to Custom Vocabulary
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Categorized;