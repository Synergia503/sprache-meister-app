
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BaseExercise } from '@/types/exercises';
import { GapFillExercise } from '@/types/gapFill';
import { generateExercisePDF } from '@/utils/pdfGenerator';

interface ExerciseHeaderProps {
  title: string;
  exercise?: BaseExercise | GapFillExercise | null;
}

export const ExerciseHeader = ({ title, exercise }: ExerciseHeaderProps) => {
  const handleDownloadPDF = () => {
    if (exercise) {
      generateExercisePDF(exercise);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {exercise && (
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Generate PDF
        </Button>
      )}
    </div>
  );
};
