import exercisesData from '@/data/exercises.json';

export interface ExerciseType {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
}

// Simulate HTTP call with Promise
export const getExerciseTypes = async (): Promise<ExerciseType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(exercisesData);
    }, 100);
  });
};

export const getExerciseTypeById = async (id: string): Promise<ExerciseType | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const exercise = exercisesData.find(ex => ex.id === id);
      resolve(exercise);
    }, 50);
  });
};