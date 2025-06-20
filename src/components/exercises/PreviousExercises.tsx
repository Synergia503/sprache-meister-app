
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BaseExercise } from "@/types/exercises";

interface PreviousExercisesProps {
  exercises: BaseExercise[];
  onLoadExercise: (exercise: BaseExercise) => void;
}

export const PreviousExercises = ({ exercises, onLoadExercise }: PreviousExercisesProps) => {
  if (exercises.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Previous Exercises</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="flex justify-between items-center p-2 border rounded">
              <span className="text-sm">
                {exercise.createdAt.toLocaleDateString()} - {exercise.words.length} words
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLoadExercise(exercise)}
              >
                Open
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
