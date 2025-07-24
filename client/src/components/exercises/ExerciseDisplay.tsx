
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { GapFillExercise } from "@/types/gapFill";

interface ExerciseDisplayProps {
  exercise: GapFillExercise | null;
  userAnswers: { [key: number]: string };
  showResults: boolean;
  onAnswerChange: (sentenceOrder: number, answer: string) => void;
  onCheckAnswers: () => void;
  onPracticeMistakes: () => void;
  onNewExercise: () => void;
}

export const ExerciseDisplay = ({
  exercise,
  userAnswers,
  showResults,
  onAnswerChange,
  onCheckAnswers,
  onPracticeMistakes,
  onNewExercise
}: ExerciseDisplayProps) => {
  if (!exercise) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gap-Fill Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading exercise...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gap-Fill Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exercise.sentences.map((sentence) => (
            <div key={sentence.sentenceOrder} className="space-y-2">
              <p className="font-medium">
                {sentence.sentenceOrder}. {sentence.sentence}
              </p>
              <Input
                placeholder="Your answer"
                value={userAnswers[sentence.sentenceOrder] || ''}
                onChange={(e) => onAnswerChange(sentence.sentenceOrder, e.target.value)}
                disabled={showResults}
                className={showResults ? 
                  (userAnswers[sentence.sentenceOrder]?.toLowerCase().trim() === sentence.solution.toLowerCase().trim() ? 
                    'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''
                }
              />
              {showResults && (
                <p className="text-sm text-muted-foreground">
                  Correct answer: <span className="font-medium">{sentence.solution}</span>
                </p>
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            {!showResults ? (
              <Button onClick={onCheckAnswers}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Check Answers
              </Button>
            ) : (
              <>
                <Button onClick={onPracticeMistakes} variant="outline">
                  Practice Mistakes
                </Button>
                <Button onClick={onNewExercise}>
                  New Exercise
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
