import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, X, Play, Smartphone } from "lucide-react";
import { CustomWord } from '@/types/vocabulary';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

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

    console.log('🚀 ExerciseDropZone: Starting exercise with words:', droppedWords);

    // Set exercise data using the service
    vocabularyExerciseService.setExerciseData(
      droppedWords,
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
    <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/10 mx-2 sm:mx-0">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 text-lg sm:text-xl">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Exercise Preparation
            {isMobile && <Smartphone className="h-4 w-4 text-muted-foreground ml-1" />}
          </div>
          {droppedWords.length > 0 && (
            <Button variant="ghost" onClick={onClearAll} className="w-full sm:w-auto min-h-[48px]">
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className={`min-h-[80px] sm:min-h-20 p-3 sm:p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg ${
          isMobile ? 'touch-none' : ''
        }`}>
          {droppedWords.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {isMobile 
                  ? "Use buttons above to add words" 
                  : "Drag words here to create an exercise"
                }
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                {isMobile 
                  ? "Hold words for 2s to select multiple"
                  : "Select multiple words with Ctrl+Click"
                }
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {droppedWords.map((word) => (
                <Badge
                  key={word.id}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer hover:bg-destructive/10 text-xs sm:text-sm p-2 touch-manipulation"
                  onClick={() => onRemoveWord(word.id)}
                >
                  <span className="break-words">{word.targetWord} - {word.nativeWord}</span>
                  <X className="h-3 w-3 ml-1 flex-shrink-0" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger className="flex-1 min-w-0 min-h-[48px]">
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
            className="flex items-center gap-2 w-full sm:w-auto min-h-[48px]"
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