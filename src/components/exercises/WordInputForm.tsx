
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface WordInputFormProps {
  onGenerateExercise: (words: string[]) => void;
  isLoading: boolean;
  apiKey: string;
  initialWords?: string[];
  title?: string;
  description?: string;
  placeholder?: string;
}

export const WordInputForm = ({ 
  onGenerateExercise, 
  isLoading, 
  apiKey, 
  initialWords = [''],
  title = "Create New Exercise",
  description = "Add up to 20 German words or phrases.",
  placeholder = "Word"
}: WordInputFormProps) => {
  // Check for words from session storage first
  const getInitialWords = () => {
    const storedWords = sessionStorage.getItem('gapFillWordsForExercise');
    if (storedWords) {
      try {
        const wordList = JSON.parse(storedWords);
        // Clear session storage after reading
        sessionStorage.removeItem('gapFillWordsForExercise');
        return wordList.map((word: any) => word.german);
      } catch (error) {
        console.error('Error parsing stored words:', error);
      }
    }
    return initialWords;
  };

  const [words, setWords] = useState<string[]>(getInitialWords);

  const addWordField = () => {
    if (words.length < 20) {
      setWords([...words, '']);
    }
  };

  const removeWordField = (index: number) => {
    if (words.length > 1) {
      const newWords = words.filter((_, i) => i !== index);
      setWords(newWords);
    }
  };

  const updateWord = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const handleGenerate = () => {
    onGenerateExercise(words);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
          
          {words.map((word, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`${placeholder} ${index + 1}`}
                value={word}
                onChange={(e) => updateWord(index, e.target.value)}
              />
              {words.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeWordField(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            {words.length < 20 && (
              <Button variant="outline" onClick={addWordField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Word
              </Button>
            )}
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading || !apiKey}
            >
              Generate Exercise
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
