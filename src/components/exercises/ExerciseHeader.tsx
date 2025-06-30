
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExerciseHeaderProps {
  title: string;
  onDownload?: () => void;
}

export const ExerciseHeader = ({ title, onDownload }: ExerciseHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {onDownload && (
        <Button onClick={onDownload} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Generate PDF
        </Button>
      )}
    </div>
  );
};
