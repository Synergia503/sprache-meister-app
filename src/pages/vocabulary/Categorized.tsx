import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Check, X, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOpenAI } from '@/hooks/useOpenAI';
import { vocabularyExerciseService } from '@/services/vocabularyExerciseService';
import { useLanguage } from '@/contexts/LanguageContext';
import { getExerciseTypes } from '@/services/exerciseService';

const Categorized = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { callOpenAI, apiKey } = useOpenAI();
  const { languageSettings } = useLanguage();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(10);
  const [generatedWords, setGeneratedWords] = useState<Array<{targetWord: string, nativeWord: string}>>([]);
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
  const [exerciseTypes, setExerciseTypes] = useState<any[]>([]);

  useEffect(() => {
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

    const prompt = `Generate exactly ${wordCount} ${languageSettings.targetLanguage.nativeName} vocabulary words for the category "${selectedCategory}". 
    Include the ${languageSettings.targetLanguage.nativeName} word and its ${languageSettings.nativeLanguage.nativeName} translation.
    
    Return only a JSON array with this exact format:
    [
      {"targetWord": "word1", "nativeWord": "translation1"},
      {"targetWord": "word2", "nativeWord": "translation2"}
    ]`;

    const systemMessage = `You are a ${languageSettings.targetLanguage.nativeName} language teacher creating vocabulary lists. Return only valid JSON without any additional text or explanations.`;
    
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
    if (selectedWords.size === 0) {
      toast({
        title: "No words selected",
        description: "Please select at least one word to add to your vocabulary.",
        variant: "destructive",
      });
      return;
    }

    const selectedWordList = Array.from(selectedWords).map(index => generatedWords[index]);
    
    // Here you would typically add the words to the vocabulary context
    // For now, we'll just show a success message
    toast({
      title: "Words added!",
      description: `Added ${selectedWordList.length} words to your vocabulary.`,
    });
    
    // Clear selections after adding
    setSelectedWords(new Set());
  };

  const startExerciseWithCategory = () => {
    if (selectedWords.size === 0) {
      toast({
        title: "No words selected",
        description: "Please select at least one word to start an exercise.",
        variant: "destructive",
      });
      return;
    }

    const selectedWordList = Array.from(selectedWords).map(index => generatedWords[index]);
    
    // Store the selected words in the exercise service
    vocabularyExerciseService.setExerciseData(
      selectedWordList.map(word => ({
        id: Math.random().toString(),
        targetWord: word.targetWord,
        nativeWord: word.nativeWord,
        categories: [selectedCategory]
      })),
      selectedCategory,
      'mixed'
    );
    
    // Navigate to exercises page
    navigate('/exercises');
    
    toast({
      title: "Exercise ready!",
      description: `Starting exercise with ${selectedWordList.length} words from ${selectedCategory}.`,
    });
  };

  const sendToExercise = (exercisePath: string) => {
    if (selectedWords.size === 0) {
      toast({
        title: "No words selected",
        description: "Please select at least one word to start an exercise.",
        variant: "destructive",
      });
      return;
    }

    const selectedWordList = Array.from(selectedWords).map(index => generatedWords[index]);
    
    // Store the selected words in the exercise service
    vocabularyExerciseService.setExerciseData(
      selectedWordList.map(word => ({
        id: Math.random().toString(),
        targetWord: word.targetWord,
        nativeWord: word.nativeWord,
        categories: [selectedCategory]
      })),
      selectedCategory,
      exercisePath.split('/').pop() || 'mixed'
    );
    
    // Navigate to the specific exercise
    navigate(exercisePath);
    
    toast({
      title: "Exercise ready!",
      description: `Starting ${exercisePath.split('/').pop()} exercise with ${selectedWordList.length} words.`,
    });
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Categorized Vocabulary</h1>
      </div>

      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Generate Vocabulary by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <Input
                id="category"
                placeholder={`Enter a category (e.g., ${languageSettings.targetLanguage.code === 'de' ? 'food, animals, colors' : 'comida, animales, colores'})`}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="min-h-[48px]"
              />
            </div>
            <div>
              <Label htmlFor="wordCount" className="text-sm font-medium">Number of Words</Label>
              <Select value={wordCount.toString()} onValueChange={(value) => setWordCount(parseInt(value))}>
                <SelectTrigger className="min-h-[48px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 words</SelectItem>
                  <SelectItem value="10">10 words</SelectItem>
                  <SelectItem value="15">15 words</SelectItem>
                  <SelectItem value="20">20 words</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button onClick={generateVocabulary} className="w-full min-h-[48px]">
                <Plus className="h-4 w-4 mr-2" />
                Generate Vocabulary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Words */}
      {generatedWords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 text-lg sm:text-xl">
              <span>Generated Words ({generatedWords.length})</span>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={selectAllWords} className="w-full sm:w-auto min-h-[48px]">
                  Select All
                </Button>
                <Button variant="outline" onClick={deselectAllWords} className="w-full sm:w-auto min-h-[48px]">
                  Deselect All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {generatedWords.map((word, index) => (
                <div
                  key={index}
                  className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors touch-manipulation ${
                    selectedWords.has(index) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleWordSelection(index)}
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <Checkbox
                      checked={selectedWords.has(index)}
                      onChange={() => toggleWordSelection(index)}
                      className="h-5 w-5"
                    />
                    <Badge variant="secondary" className="text-xs">{selectedCategory}</Badge>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="font-medium text-sm sm:text-base break-words">{word.targetWord}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground break-words">{word.nativeWord}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6">
              <Button onClick={addSelectedWordsToVocabulary} disabled={selectedWords.size === 0} className="w-full sm:w-auto min-h-[48px]">
                <Plus className="h-4 w-4 mr-2" />
                Add to Vocabulary ({selectedWords.size})
              </Button>
              <Button onClick={startExerciseWithCategory} disabled={selectedWords.size === 0} className="w-full sm:w-auto min-h-[48px]">
                <Play className="h-4 w-4 mr-2" />
                Start Mixed Exercise
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Types */}
      {selectedWords.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Start Specific Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {exerciseTypes.map((exerciseType) => (
                <Button
                  key={exerciseType.id}
                  variant="outline"
                  onClick={() => sendToExercise(exerciseType.path)}
                  className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 min-h-[80px] sm:min-h-[100px]"
                >
                  <div className="text-xl sm:text-2xl">{exerciseType.icon}</div>
                  <div className="text-xs sm:text-sm font-medium text-center leading-tight">{exerciseType.title}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Categorized;