
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ExerciseHeader } from './ExerciseHeader';
import { PreviousExercises } from './PreviousExercises';
import { BaseExercise } from '@/types/exercises';

interface ExerciseLayoutProps {
  title: string;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onDownload?: () => void;
  previousExercises: BaseExercise[];
  onLoadExercise: (exercise: BaseExercise) => void;
  children: React.ReactNode;
}

export const ExerciseLayout = ({
  title,
  apiKey,
  onSaveApiKey,
  onDownload,
  previousExercises,
  onLoadExercise,
  children
}: ExerciseLayoutProps) => {
  return (
    <div className="p-6">
      <ExerciseHeader title={title} onDownload={onDownload} />
      <ApiKeyInput apiKey={apiKey} onSaveApiKey={onSaveApiKey} />
      {children}
      <PreviousExercises 
        exercises={previousExercises} 
        onLoadExercise={onLoadExercise} 
      />
    </div>
  );
};
