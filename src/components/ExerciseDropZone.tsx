import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, X, Play } from "lucide-react";
import { CustomWord } from '@/types/vocabulary';
import { useToast } from '@/hooks/use-toast';
import { getExerciseTypes, ExerciseType } from '@/services/exerciseService';

interface ExerciseDropZoneProps {
  droppedWords: CustomWord[];
  onRemoveWord: (wordId: string) => void;
  onClearAll: () => void;
}

const ExerciseDropZone: React.FC<ExerciseDropZoneProps> = ({
  droppedWords,
  onRemoveWord,
  onClearAll
}) => {
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleStartExercise = () => {
    if (!selectedExercise || droppedWords.length === 0) {
      toast({
        title: "Missing requirements",
        description: "Please select an exercise type and add at least one word.",
        variant: "destructive",
      });
      return;
    }

    const selectedType = exerciseTypes.find(type => type.id === selectedExercise);
    if (!selectedType) return;

    // Clear any existing session storage first
    sessionStorage.removeItem('vocabularyPairsForExercise');
    sessionStorage.removeItem('gapFillWordsForExercise');
    sessionStorage.removeItem('wordListForExercise');
    sessionStorage.removeItem('exerciseCategory');
    
    // Store words in different formats for different exercise types
    if (selectedExercise === 'gap-fill') {
      // Gap-fill needs just the German words as strings
      const germanWords = droppedWords.map(word => word.german);
      sessionStorage.setItem('gapFillWordsForExercise', JSON.stringify(germanWords));
      console.log('Stored gap-fill words:', germanWords);
    } else if (selectedExercise === 'matching' || selectedExercise === 'multiple-choice' || selectedExercise === 'translation') {
      // These exercises need vocabulary pairs
      const vocabularyPairs = droppedWords.map(word => ({
        german: word.german,
        english: word.english
      }));
      sessionStorage.setItem('vocabularyPairsForExercise', JSON.stringify(vocabularyPairs));
    } else {
      // Other exercises get the full word objects
      sessionStorage.setItem('wordListForExercise', JSON.stringify(droppedWords));
    }
    
    sessionStorage.setItem('exerciseCategory', 'Custom Words');
    
    // Navigate to exercise
    navigate(selectedType.path);
    
    toast({
      title: "Exercise started!",
      description: `Starting ${selectedType.title} with ${droppedWords.length} words.`,
    });
  };

  return (
    <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Exercise Preparation
          </div>
          {droppedWords.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="min-h-20 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          {droppedWords.length === 0 ? (
            <p className="text-muted-foreground text-center">
              Drag words here to create an exercise
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {droppedWords.map((word) => (
                <Badge
                  key={word.id}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer hover:bg-destructive/10"
                  onClick={() => onRemoveWord(word.id)}
                >
                  {word.german} - {word.english}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>

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
            onClick={handleStartExercise}
            disabled={!selectedExercise || droppedWords.length === 0 || isLoading}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Start Exercise
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseDropZone;