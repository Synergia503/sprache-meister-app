
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpenText, Target, PenTool, Shuffle, Loader2, FileText, Languages, Link } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { useNavigate } from 'react-router-dom';
import { useVocabulary } from '@/contexts/VocabularyContext';

const All = () => {
  const { isLoading, apiKey, saveApiKey } = useOpenAI();
  const navigate = useNavigate();
  const { getAllCategories, getWordsByCategory } = useVocabulary();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const categories = getAllCategories();

  const exercises = [
    {
      id: 'gap-fill',
      title: 'Gap-Fill',
      description: 'Fill in the blanks with correct German words',
      icon: FileText,
      path: '/exercises/gap-fill'
    },
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Choose the correct answer from multiple options',
      icon: Target,
      path: '/exercises/multiple-choice'
    },
    {
      id: 'translation',
      title: 'Translation',
      description: 'Translate between German and English',
      icon: Languages,
      path: '/exercises/translation'
    },
    {
      id: 'matching',
      title: 'Matching',
      description: 'Match German words with their English translations',
      icon: Link,
      path: '/exercises/matching'
    },
    {
      id: 'describe-picture',
      title: 'Describe a Picture',
      description: 'Practice describing images in German',
      icon: BookOpenText,
      path: '/exercises/describe-picture'
    },
    {
      id: 'grammar',
      title: 'Grammar',
      description: 'Practice German grammar rules',
      icon: PenTool,
      path: '/exercises/grammar'
    },
    {
      id: 'mixed',
      title: 'Mixed',
      description: 'Mixed exercises for comprehensive practice',
      icon: Shuffle,
      path: '/exercises/mixed'
    }
  ];

  const sendToExercise = (exercisePath: string) => {
    if (selectedCategory) {
      const categoryWords = getWordsByCategory(selectedCategory);
      const vocabularyPairs = categoryWords.map(word => ({
        german: word.german,
        english: word.english
      }));
      
      sessionStorage.setItem('vocabularyPairsForExercise', JSON.stringify(vocabularyPairs));
      sessionStorage.setItem('exerciseCategory', selectedCategory);
    }
    navigate(exercisePath);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Exercises</h1>
      
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Select a vocabulary category to practice with specific words, or leave empty to use general exercises.
              </p>
              
              <div className="max-w-md">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vocabulary category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No category (general exercise)</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCategory && (
                <p className="text-sm text-blue-600">
                  Selected: <strong>{selectedCategory}</strong> ({getWordsByCategory(selectedCategory).length} words)
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => {
          const IconComponent = exercise.icon;
          return (
            <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {exercise.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{exercise.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => sendToExercise(exercise.path)}
                  disabled={isLoading}
                >
                  Start Exercise
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default All;
