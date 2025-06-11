
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { edit, trash-2 } from 'lucide-react';
import { Flashcard } from './FlashcardForm';

interface FlashcardListProps {
  flashcards: Flashcard[];
  onEdit: (flashcard: Flashcard) => void;
  onDelete: (id: string) => void;
}

export const FlashcardList = ({ flashcards, onEdit, onDelete }: FlashcardListProps) => {
  if (flashcards.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No flashcards yet. Add your first one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {flashcards.map((flashcard) => (
        <Card key={flashcard.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="text-lg">{flashcard.german}</CardTitle>
                <p className="text-muted-foreground">{flashcard.english}</p>
                <Badge variant="secondary">{flashcard.category}</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(flashcard)}
                >
                  <edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(flashcard.id)}
                >
                  <trash-2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          {flashcard.example && (
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground italic">
                "{flashcard.example}"
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};
