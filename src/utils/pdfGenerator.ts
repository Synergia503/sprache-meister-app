
import { BaseExercise, TranslationExercise, MultipleChoiceExercise, MatchingExercise } from '@/types/exercises';
import { GapFillExercise } from '@/types/gapFill';
import { jsPDF } from 'jspdf';

// Type guards to safely identify exercise types
const isMatchingExercise = (exercise: any): exercise is MatchingExercise => {
  return 'pairs' in exercise && 'userMatches' in exercise;
};

const isTranslationExercise = (exercise: any): exercise is TranslationExercise => {
  return 'sentences' in exercise && 
         exercise.sentences.length > 0 && 
         'germanSentence' in exercise.sentences[0] && 
         'englishSentence' in exercise.sentences[0];
};

const isMultipleChoiceExercise = (exercise: any): exercise is MultipleChoiceExercise => {
  return 'sentences' in exercise && 
         exercise.sentences.length > 0 && 
         'options' in exercise.sentences[0] && 
         'solution' in exercise.sentences[0];
};

const isGapFillExercise = (exercise: any): exercise is GapFillExercise => {
  return 'sentences' in exercise && 
         exercise.sentences.length > 0 && 
         'solution' in exercise.sentences[0] && 
         !('options' in exercise.sentences[0]) &&
         !('germanSentence' in exercise.sentences[0]);
};

export const generateExercisePDF = (exercise: BaseExercise | GapFillExercise) => {
  try {
    console.log('Starting PDF generation for exercise:', exercise);
    
    const doc = new jsPDF();
    let filename = '';
    let yPosition = 20;
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.height;

    const addText = (text: string, fontSize = 12) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, 180);
      
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 15, yPosition);
        yPosition += lineHeight;
      });
    };

    const addTitle = (title: string) => {
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text(title, 15, yPosition);
      yPosition += 15;
      doc.setFont(undefined, 'normal');
    };

    const addSection = (title: string) => {
      yPosition += 5;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(title, 15, yPosition);
      yPosition += 10;
      doc.setFont(undefined, 'normal');
    };

    if (isMatchingExercise(exercise)) {
      console.log('Generating matching exercise PDF');
      addTitle('Matching Exercise');
      filename = 'matching-exercise.pdf';
      
      addSection('Instructions:');
      addText('Match the German words with their English translations.');
      
      addSection('German Words:');
      exercise.pairs.forEach((pair, i) => {
        addText(`${i + 1}. ${pair.germanWord}`);
      });
      
      addSection('English Words:');
      exercise.pairs.forEach((pair, i) => {
        addText(`${String.fromCharCode(65 + i)}. ${pair.englishWord}`);
      });
      
      addSection('Answer Key:');
      exercise.pairs.forEach((pair, i) => {
        addText(`${i + 1}. ${pair.germanWord} - ${pair.englishWord}`);
      });
      
    } else if (isTranslationExercise(exercise)) {
      console.log('Generating translation exercise PDF');
      addTitle('Translation Exercise');
      filename = 'translation-exercise.pdf';
      
      addSection('Instructions:');
      addText('Translate the following German sentences into English.');
      
      addSection('Questions:');
      exercise.sentences.forEach((sentence, i) => {
        addText(`${i + 1}. ${sentence.germanSentence}`);
        addText('   _________________________________');
        yPosition += 5;
      });
      
      addSection('Answer Key:');
      exercise.sentences.forEach((sentence, i) => {
        addText(`${i + 1}. ${sentence.germanSentence}`);
        addText(`   Answer: ${sentence.englishSentence}`);
        yPosition += 5;
      });
      
    } else if (isMultipleChoiceExercise(exercise)) {
      console.log('Generating multiple choice exercise PDF');
      addTitle('Multiple Choice Exercise');
      filename = 'multiple-choice-exercise.pdf';
      
      addSection('Instructions:');
      addText('Choose the correct answer for each question.');
      
      addSection('Questions:');
      exercise.sentences.forEach((sentence, i) => {
        addText(`${i + 1}. ${sentence.sentence}`);
        sentence.options.forEach((option, idx) => {
          addText(`   ${String.fromCharCode(65 + idx)}) ${option}`);
        });
        yPosition += 5;
      });
      
      addSection('Answer Key:');
      exercise.sentences.forEach((sentence, i) => {
        addText(`${i + 1}. ${sentence.sentence}`);
        addText(`   Answer: ${sentence.solution}`);
        yPosition += 5;
      });
      
    } else if (isGapFillExercise(exercise)) {
      console.log('Generating gap-fill exercise PDF');
      addTitle('Gap-Fill Exercise');
      filename = 'gap-fill-exercise.pdf';
      
      addSection('Instructions:');
      addText('Fill in the blanks with the correct word.');
      
      addSection('Questions:');
      exercise.sentences.forEach((sentence, i) => {
        addText(`${i + 1}. ${sentence.sentence}`);
        addText('   Answer: _______________');
        yPosition += 5;
      });
      
      addSection('Answer Key:');
      exercise.sentences.forEach((sentence, i) => {
        const completeSentence = sentence.sentence.replace('___', sentence.solution);
        addText(`${i + 1}. ${completeSentence}`);
      });
      
    } else {
      console.log('Unknown exercise type, generating generic PDF');
      addTitle('Exercise');
      addText('Exercise content not available');
      filename = 'exercise.pdf';
    }

    console.log('Saving PDF with filename:', filename);
    // Save the PDF
    doc.save(filename);
    console.log('PDF generation completed successfully');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please check the console for details.');
  }
};
