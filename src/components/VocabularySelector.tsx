import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useVocabulary } from '@/contexts/VocabularyContext';

interface VocabularySelectorProps {
  onWordsSelected: (words: string[] | any[]) => void;
  title?: string;
  description?: string;
}

export const VocabularySelector = ({ 
  onWordsSelected, 
  title = "Use Existing Vocabulary",
  description = "Select a category from your vocabulary to practice with."
}: VocabularySelectorProps) => {
  const { getAllCategories, getWordsByCategory } = useVocabulary();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const categories = getAllCategories();

  const handleUseCategory = () => {
    if (selectedCategory) {
      const categoryWords = getWordsByCategory(selectedCategory);
      // Pass the full word objects for exercises that need both german and english
      onWordsSelected(categoryWords);
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