
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
        <CardTitle>{flashcard ? 'Edit Flashcard' : 'Add New Flashcard'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="german">German Word/Phrase</Label>
            <Input
              id="german"
              value={german}
              onChange={(e) => setGerman(e.target.value)}
              placeholder="e.g., der Hund"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="english">English Translation</Label>
            <Input
              id="english"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="e.g., the dog"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Animals"
            />
          </div>
          
          <div>
            <Label htmlFor="example">Example Sentence (Optional)</Label>
            <Textarea
              id="example"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="e.g., Der Hund läuft im Park."
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit">
              {flashcard ? 'Update' : 'Add'} Flashcard
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
