
import { BaseExercise, TranslationExercise, MultipleChoiceExercise, MatchingExercise } from '@/types/exercises';
import { GapFillExercise } from '@/types/gapFill';

export const generateExercisePDF = (exercise: BaseExercise | GapFillExercise) => {
  let content = '';
  let filename = '';

  if ('sentences' in exercise && 'pairs' in exercise) {
    // Matching exercise
    const matchingEx = exercise as MatchingExercise;
    content = `Matching Exercise

German Words:
${matchingEx.pairs.map((p, i) => `${i + 1}. ${p.germanWord}`).join('\n')}

English Words:
${matchingEx.pairs.map((p, i) => `${String.fromCharCode(65 + i)}. ${p.englishWord}`).join('\n')}

Answer Key:
${matchingEx.pairs.map((p, i) => `${i + 1}. ${p.germanWord} - ${p.englishWord}`).join('\n')}`;
    filename = 'matching-exercise.pdf';
  } else if ('sentences' in exercise && exercise.sentences.every(s => 'germanSentence' in s)) {
    // Translation exercise
    const translationEx = exercise as TranslationExercise;
    content = `Translation Exercise

Instructions: Translate the following German sentences into English.

${translationEx.sentences.map((s, i) => 
  `${i + 1}. ${s.germanSentence}\n   _________________________________`
).join('\n\n')}

Answer Key:
${translationEx.sentences.map((s, i) => 
  `${i + 1}. ${s.germanSentence}\n   Answer: ${s.englishSentence}`
).join('\n\n')}`;
    filename = 'translation-exercise.pdf';
  } else if ('sentences' in exercise && exercise.sentences.every(s => 'options' in s)) {
    // Multiple choice exercise
    const mcEx = exercise as MultipleChoiceExercise;
    content = `Multiple Choice Exercise

Instructions: Choose the correct answer for each question.

${mcEx.sentences.map((s, i) => 
  `${i + 1}. ${s.sentence}\n${s.options.map((opt, idx) => 
    `   ${String.fromCharCode(65 + idx)}) ${opt}`
  ).join('\n')}`
).join('\n\n')}

Answer Key:
${mcEx.sentences.map((s, i) => 
  `${i + 1}. ${s.sentence}\n   Answer: ${s.solution}`
).join('\n\n')}`;
    filename = 'multiple-choice-exercise.pdf';
  } else if ('sentences' in exercise && exercise.sentences.every(s => 'solution' in s)) {
    // Gap fill exercise
    const gapEx = exercise as GapFillExercise;
    content = `Gap-Fill Exercise

Instructions: Fill in the blanks with the correct word.

${gapEx.sentences.map((s, i) => 
  `${i + 1}. ${s.sentence}\n   Answer: _______________`
).join('\n\n')}

Answer Key:
${gapEx.sentences.map((s, i) => 
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
