
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
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
        <CardContent className="text-center py-6 sm:py-8">
          <p className="text-sm sm:text-base text-muted-foreground">No flashcards yet. Add your first one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {flashcards.map((flashcard) => (
        <Card key={flashcard.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                <CardTitle className="text-base sm:text-lg break-words">{flashcard.german}</CardTitle>
                <p className="text-sm sm:text-base text-muted-foreground break-words">{flashcard.english}</p>
                <Badge variant="secondary" className="text-xs">{flashcard.category}</Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 ml-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-1 sm:h-9 sm:w-9 sm:p-2"
                  onClick={() => onEdit(flashcard)}
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-1 sm:h-9 sm:w-9 sm:p-2"
                  onClick={() => onDelete(flashcard.id)}
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          {flashcard.example && (
            <CardContent className="pt-0 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground italic break-words">
                "{flashcard.example}"
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};
