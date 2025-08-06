
import { ExerciseHeader } from './ExerciseHeader';
import { PreviousExercises } from './PreviousExercises';
import { BaseExercise } from '@/types/exercises';
import { GapFillExercise } from '@/types/gapFill';

interface ExerciseLayoutProps {
  title: string;
  previousExercises: BaseExercise[];
  onLoadExercise: (exercise: BaseExercise) => void;
  children: React.ReactNode;
  currentExercise?: BaseExercise | GapFillExercise | null;
}

export const ExerciseLayout = ({
  title,
  previousExercises,
  onLoadExercise,
  children,
  currentExercise
}: ExerciseLayoutProps) => {
  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <ExerciseHeader title={title} exercise={currentExercise} />
      {children}
      <PreviousExercises 
        exercises={previousExercises} 
        onLoadExercise={onLoadExercise} 
      />
    </div>
  );
};
