import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useVocabulary } from '@/contexts/VocabularyContext';
import { vocabularyExerciseService, VocabularyWord } from '@/services/vocabularyExerciseService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CustomWord } from '@/types/vocabulary';
import { useLanguage } from '@/contexts/LanguageContext';

interface VocabularySelectorProps {
  onWordsSelected?: (words: string[] | CustomWord[]) => void;
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
  const { languageSettings } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const categories = getAllCategories();

  const handleUseCategory = () => {
    if (selectedCategory) {
      const categoryWords = getWordsByCategory(selectedCategory);
      
      if (categoryWords.length === 0) {
        toast({
          title: "No words found",
          description: "This category has no words. Please add some words first.",
          variant: "destructive",
        });
        return;
      }

      if (exerciseType && exercisePath) {
        // Convert to VocabularyWord format and use service
        const vocabularyWords: VocabularyWord[] = categoryWords.map(word => ({
          id: word.id,
          targetWord: word.targetWord,
          nativeWord: word.nativeWord,
          categories: word.categories
        }));
        
        console.log('🔥 VocabularySelector: Setting exercise data for', exerciseType, 'with', vocabularyWords.length, 'words');
        // Convert VocabularyWord back to CustomWord format for the service
        const customWords: CustomWord[] = vocabularyWords.map(word => ({
          id: word.id,
          targetLanguage: languageSettings.targetLanguage,
          nativeLanguage: languageSettings.nativeLanguage,
          targetWord: word.targetWord,
          nativeWord: word.nativeWord,
          categories: word.categories,
          sampleSentence: '',
          dateAdded: new Date(),
          learningHistory: [],
          isFavorite: false
        }));

        vocabularyExerciseService.setExerciseData(
          customWords,
          selectedCategory,
          exerciseType
        );
        
        // Check if we're already on the target exercise page
        if (location.pathname === exercisePath) {
          // We're already on the correct page, just reload the page to pick up new data
          window.location.reload();
        } else {
          // Navigate to the exercise page using React Router
          navigate(exercisePath);
        }
        
        toast({
          title: "Exercise started!",
          description: `Starting ${exerciseType} with ${categoryWords.length} words from ${selectedCategory}.`,
        });
        
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
        <CardTitle>{defaultTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {defaultDescription}
          </p>
          
          <div className="space-y-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('vocabularySelector.selectCategoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category} ({t('vocabularySelector.wordsCount', { count: getWordsByCategory(category).length })})
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
              {t('vocabularySelector.useSelectedCategory')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};