
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { MultipleChoiceExercise } from "@/types/exercises";

interface MultipleChoiceExerciseDisplayProps {
  exercise: MultipleChoiceExercise | null;
  userAnswers: { [key: number]: string };
  showResults: boolean;
  onAnswerChange: (sentenceOrder: number, answer: string) => void;
  onCheckAnswers: () => void;
  onPracticeMistakes: () => void;
  onNewExercise: () => void;
}

export const MultipleChoiceExerciseDisplay = ({
  exercise,
  userAnswers,
  showResults,
  onAnswerChange,
  onCheckAnswers,
  onPracticeMistakes,
  onNewExercise
}: MultipleChoiceExerciseDisplayProps) => {
  if (!exercise) return null;

  const allAnswersSelected = exercise.sentences.every(sentence => 
    userAnswers[sentence.sentenceOrder]
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Multiple Choice Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {exercise.sentences.map((sentence) => (
            <div key={sentence.sentenceOrder} className="space-y-3">
              <p className="font-medium">
                {sentence.sentenceOrder}. {sentence.sentence}
              </p>
              <div className="space-y-2">
                {sentence.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                      showResults
                        ? option === sentence.solution
                          ? 'bg-green-100 border-green-300 border'
                          : userAnswers[sentence.sentenceOrder] === option
                          ? 'bg-red-100 border-red-300 border'
                          : 'bg-gray-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${sentence.sentenceOrder}`}
                      value={option}
                      checked={userAnswers[sentence.sentenceOrder] === option}
                      onChange={() => onAnswerChange(sentence.sentenceOrder, option)}
                      disabled={showResults}
                      className="text-blue-600"
                    />
                    <span>{String.fromCharCode(65 + optionIndex)}) {option}</span>
                  </label>
                ))}
              </div>
              {showResults && (
                <p className="text-sm text-muted-foreground">
                  Correct answer: <span className="font-medium">{sentence.solution}</span>
                </p>
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            {!showResults ? (
              <Button onClick={onCheckAnswers} disabled={!allAnswersSelected}>
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
