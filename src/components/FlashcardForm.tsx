
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Flashcard {
  id: string;
  german: string;
  english: string;
  example: string;
  category: string;
}

interface FlashcardFormProps {
  flashcard?: Flashcard;
  onSave: (flashcard: Omit<Flashcard, 'id'>) => void;
  onCancel: () => void;
}

export const FlashcardForm = ({ flashcard, onSave, onCancel }: FlashcardFormProps) => {
  const [german, setGerman] = useState(flashcard?.german || '');
  const [english, setEnglish] = useState(flashcard?.english || '');
  const [example, setExample] = useState(flashcard?.example || '');
  const [category, setCategory] = useState(flashcard?.category || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!german.trim() || !english.trim()) return;

    onSave({
      german: german.trim(),
      english: english.trim(),
      example: example.trim(),
      category: category.trim() || 'General',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{flashcard ? 'Edit Flashcard' : 'Add New Flashcard'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="german" className="text-sm font-medium">German Word/Phrase</Label>
            <Input
              id="german"
              value={german}
              onChange={(e) => setGerman(e.target.value)}
              placeholder="e.g., der Hund"
              className="min-h-[48px]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="english" className="text-sm font-medium">English Translation</Label>
            <Input
              id="english"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="e.g., the dog"
              className="min-h-[48px]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Animals"
              className="min-h-[48px]"
            />
          </div>
          
          <div>
            <Label htmlFor="example" className="text-sm font-medium">Example Sentence (Optional)</Label>
            <Textarea
              id="example"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="e.g., Der Hund läuft im Park."
              rows={3}
              className="min-h-[48px]"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="w-full sm:w-auto min-h-[48px]">
              {flashcard ? 'Update' : 'Add'} Flashcard
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto min-h-[48px]">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
