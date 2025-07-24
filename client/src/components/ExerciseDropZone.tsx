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
import { vocabularyExerciseService, VocabularyWord } from '@/services/vocabularyExerciseService';

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

    // Convert CustomWord to VocabularyWord format
    const vocabularyWords: VocabularyWord[] = droppedWords.map(word => ({
      id: word.id,
      german: word.german,
      english: word.english,
      categories: word.categories
    }));

    console.log('🚀 ExerciseDropZone: Starting exercise with words:', vocabularyWords);

    // Set exercise data using the service
    vocabularyExerciseService.setExerciseData(
      vocabularyWords,
      'Custom Words',
      selectedExercise
    );
    
    console.log('🚀 ExerciseDropZone: Navigating to:', selectedType.path);
    
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