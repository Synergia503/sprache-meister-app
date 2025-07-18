import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useVocabulary } from '@/contexts/VocabularyContext';
import { vocabularyExerciseService, VocabularyWord } from '@/services/vocabularyExerciseService';
import { useNavigate } from 'react-router-dom';

interface VocabularySelectorProps {
  onWordsSelected?: (words: string[] | any[]) => void;
  title?: string;
  description?: string;
  exerciseType?: string;
  exercisePath?: string;
}

export const VocabularySelector = ({ 
  onWordsSelected, 
  title = "Use Existing Vocabulary",
  description = "Select a category from your vocabulary to practice with.",
  exerciseType,
  exercisePath
}: VocabularySelectorProps) => {
  const { getAllCategories, getWordsByCategory } = useVocabulary();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const categories = getAllCategories();

  const handleUseCategory = () => {
    if (selectedCategory) {
      const categoryWords = getWordsByCategory(selectedCategory);
      
      if (exerciseType && exercisePath) {
        // Convert to VocabularyWord format and use service
        const vocabularyWords: VocabularyWord[] = categoryWords.map(word => ({
          id: word.id,
          german: word.german,
          english: word.english,
          categories: word.categories
        }));
        
        vocabularyExerciseService.setExerciseData(
          vocabularyWords,
          selectedCategory,
          exerciseType
        );
        
        navigate(exercisePath);
      } else if (onWordsSelected) {
        // Fallback to callback for backward compatibility
        onWordsSelected(categoryWords);
      }
    }
  };

  if (categories.length === 0) {
    return null;
  }

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
          
          <div className="space-y-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category} ({getWordsByCategory(category).length} words)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleUseCategory}
              disabled={!selectedCategory}
              className="w-full"
              variant="secondary"
            >
              Use Selected Category
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};