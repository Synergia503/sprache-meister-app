
import { BaseExercise, TranslationExercise, MultipleChoiceExercise, MatchingExercise } from '@/types/exercises';
import { GapFillExercise } from '@/types/gapFill';

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
  let content = '';
  let filename = '';

  if (isMatchingExercise(exercise)) {
    // Matching exercise
    content = `Matching Exercise

German Words:
${exercise.pairs.map((p, i) => `${i + 1}. ${p.germanWord}`).join('\n')}

English Words:
${exercise.pairs.map((p, i) => `${String.fromCharCode(65 + i)}. ${p.englishWord}`).join('\n')}

Answer Key:
${exercise.pairs.map((p, i) => `${i + 1}. ${p.germanWord} - ${p.englishWord}`).join('\n')}`;
    filename = 'matching-exercise.pdf';
  } else if (isTranslationExercise(exercise)) {
    // Translation exercise
    content = `Translation Exercise

Instructions: Translate the following German sentences into English.

${exercise.sentences.map((s, i) => 
  `${i + 1}. ${s.germanSentence}\n   _________________________________`
).join('\n\n')}

Answer Key:
${exercise.sentences.map((s, i) => 
  `${i + 1}. ${s.germanSentence}\n   Answer: ${s.englishSentence}`
).join('\n\n')}`;
    filename = 'translation-exercise.pdf';
  } else if (isMultipleChoiceExercise(exercise)) {
    // Multiple choice exercise
    content = `Multiple Choice Exercise

Instructions: Choose the correct answer for each question.

${exercise.sentences.map((s, i) => 
  `${i + 1}. ${s.sentence}\n${s.options.map((opt, idx) => 
    `   ${String.fromCharCode(65 + idx)}) ${opt}`
  ).join('\n')}`
).join('\n\n')}

Answer Key:
${exercise.sentences.map((s, i) => 
  `${i + 1}. ${s.sentence}\n   Answer: ${s.solution}`
).join('\n\n')}`;
    filename = 'multiple-choice-exercise.pdf';
  } else if (isGapFillExercise(exercise)) {
    // Gap fill exercise
    content = `Gap-Fill Exercise

Instructions: Fill in the blanks with the correct word.

${exercise.sentences.map((s, i) => 
  `${i + 1}. ${s.sentence}\n   Answer: _______________`
).join('\n\n')}

Answer Key:
${exercise.sentences.map((s, i) => 
  `${i + 1}. ${s.sentence.replace('___', s.solution)}`
).join('\n\n')}`;
    filename = 'gap-fill-exercise.pdf';
  } else {
    content = 'Exercise content not available';
    filename = 'exercise.pdf';
  }

  // Create and download the PDF file
  const blob = new Blob([content], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
