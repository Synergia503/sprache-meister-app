
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ExerciseHeader } from './ExerciseHeader';
import { PreviousExercises } from './PreviousExercises';
import { BaseExercise } from '@/types/exercises';
import { GapFillExercise } from '@/types/gapFill';

interface ExerciseLayoutProps {
  title: string;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  previousExercises: BaseExercise[];
  onLoadExercise: (exercise: BaseExercise) => void;
  children: React.ReactNode;
  currentExercise?: BaseExercise | GapFillExercise | null;
}

export const ExerciseLayout = ({
  title,
  apiKey,
  onSaveApiKey,
  previousExercises,
  onLoadExercise,
  children,
  currentExercise
}: ExerciseLayoutProps) => {
  return (
    <div className="p-6">
      <ExerciseHeader title={title} exercise={currentExercise} />
      <ApiKeyInput apiKey={apiKey} onSaveApiKey={onSaveApiKey} />
      {children}
      <PreviousExercises 
        exercises={previousExercises} 
        onLoadExercise={onLoadExercise} 
      />
    </div>
  );
};
