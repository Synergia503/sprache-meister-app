
import React from 'react';
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BaseExercise } from '@/types/exercises';
import { GapFillExercise } from '@/types/gapFill';
import { generateExercisePDF } from '@/utils/pdfGenerator';
import { useLocalization } from '@/contexts/LocalizationContext';

interface ExerciseHeaderProps {
  title: string;
  exercise?: BaseExercise | GapFillExercise | null;
}

export const ExerciseHeader = ({ title, exercise }: ExerciseHeaderProps) => {
  const { t } = useLocalization();
  const [isGenerating, setIsGenerating] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDownloadPDF = () => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Prevent multiple rapid clicks
    if (isGenerating) {
      console.log('PDF generation already in progress, ignoring click');
      return;
    }

    setIsGenerating(true);
    console.log('🔥 PDF Generation: Starting PDF generation for exercise:', exercise?.id);

    // Debounce the actual PDF generation
    debounceTimeoutRef.current = setTimeout(() => {
      try {
        if (exercise) {
          console.log('🔥 PDF Generation: Calling generateExercisePDF with exercise type:', typeof exercise);
          generateExercisePDF(exercise);
        } else {
          console.warn('🔥 PDF Generation: No exercise provided');
        }
      } catch (error) {
        console.error('🔥 PDF Generation: Error during PDF generation:', error);
      } finally {
        setIsGenerating(false);
        debounceTimeoutRef.current = null;
      }
    }, 300); // 300ms debounce
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{title}</h1>
      {exercise && (
        <Button 
          variant="outline" 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="w-full sm:w-auto min-h-[48px]"
        >
          <Download className="h-4 w-4 mr-2" />
          {isGenerating ? t('exercises.generating') : t('exercises.generatePDF')}
        </Button>
      )}
    </div>
  );
};
