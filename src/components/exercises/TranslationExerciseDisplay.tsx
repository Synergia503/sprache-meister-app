
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { TranslationExercise } from "@/types/exercises";

interface TranslationExerciseDisplayProps {
  exercise: TranslationExercise | null;
  userAnswers: { [key: number]: string };
  showResults: boolean;
  onAnswerChange: (sentenceOrder: number, answer: string) => void;
  onCheckAnswers: () => void;
  onNewExercise: () => void;
}

export const TranslationExerciseDisplay = ({
  exercise,
  userAnswers,
  showResults,
  onAnswerChange,
  onCheckAnswers,
  onNewExercise
}: TranslationExerciseDisplayProps) => {
  if (!exercise) return null;

  const allAnswersFilled = exercise.sentences.every(sentence => 
    userAnswers[sentence.sentenceOrder]?.trim()
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Translation Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {exercise.sentences.map((sentence) => (
            <div key={sentence.sentenceOrder} className="space-y-2">
              <p className="font-medium">
                {sentence.sentenceOrder}. {sentence.targetSentence}
              </p>
              <Textarea
                placeholder="Enter your English translation"
                value={userAnswers[sentence.sentenceOrder] || ''}
                onChange={(e) => onAnswerChange(sentence.sentenceOrder, e.target.value)}
                disabled={showResults}
                className={showResults ? 'bg-gray-50' : ''}
              />
              {showResults && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Correct translation:</p>
                  <p className="text-blue-700">{sentence.nativeSentence}</p>
                </div>
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            {!showResults ? (
              <Button onClick={onCheckAnswers} disabled={!allAnswersFilled}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Check Translations
              </Button>
            ) : (
              <>
                <Button onClick={onNewExercise} variant="outline">
                  Restart Same Exercise
                </Button>
                <Button onClick={() => window.location.reload()}>
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
