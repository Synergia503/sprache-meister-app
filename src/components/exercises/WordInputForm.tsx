
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useLocalization } from "@/contexts/LocalizationContext";

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
  const { t } = useLocalization();

  // Check for words from session storage first
  const getInitialWords = () => {
    // No longer using session storage, just return initial words
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
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
          
          {words.map((word, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Input
                placeholder={`${placeholder} ${index + 1}`}
                value={word}
                onChange={(e) => updateWord(index, e.target.value)}
                className="flex-1 min-w-0 min-h-[48px]"
              />
              {words.length > 1 && (
                <Button
                  variant="outline"
                  onClick={() => removeWordField(index)}
                  className="w-full sm:w-auto min-h-[48px] px-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {words.length < 20 && (
              <Button variant="outline" onClick={addWordField} className="w-full sm:w-auto min-h-[48px]">
                <Plus className="h-4 w-4 mr-2" />
                {t('wordInputForm.addWord')}
              </Button>
            )}
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading || !apiKey}
              className="w-full sm:w-auto min-h-[48px]"
            >
              {t('wordInputForm.generateExercise')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
