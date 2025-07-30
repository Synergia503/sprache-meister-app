import {
  BaseExercise,
  TranslationExercise,
  MultipleChoiceExercise,
  MatchingExercise,
} from "@/types/exercises";
import { GapFillExercise } from "@/types/gapFill";
import { jsPDF } from "jspdf";

interface WordFormationExercise {
  exerciseOrder: number;
  instruction: string;
  baseWord: string;
  solution: string;
  hint?: string;
  explanation?: string;
}

interface WordFormationExerciseData {
  id: string;
  words: string[];
  exercises: WordFormationExercise[];
  userAnswers: { [key: number]: string };
  isCompleted: boolean;
  createdAt: Date;
  targetLanguage: string;
  nativeLanguage: string;
}

// Type guards to safely identify exercise types
const isMatchingExercise = (exercise: MatchingExercise): exercise is MatchingExercise => {
  return "pairs" in exercise && "userMatches" in exercise;
};

const isTranslationExercise = (
  exercise: TranslationExercise
): exercise is TranslationExercise => {
  return (
    "sentences" in exercise &&
    exercise.sentences.length > 0 &&
    "targetSentence" in exercise.sentences[0] &&
    "nativeSentence" in exercise.sentences[0]
  );
};

const isMultipleChoiceExercise = (
  exercise: MultipleChoiceExercise
): exercise is MultipleChoiceExercise => {
  return (
    "sentences" in exercise &&
    exercise.sentences.length > 0 &&
    "options" in exercise.sentences[0] &&
    "solution" in exercise.sentences[0]
  );
};

const isGapFillExercise = (
  exercise: GapFillExercise
): exercise is GapFillExercise => {
  return (
    "sentences" in exercise &&
    exercise.sentences.length > 0 &&
    "solution" in exercise.sentences[0] &&
    !("options" in exercise.sentences[0]) &&
    !("targetSentence" in exercise.sentences[0])
  );
};

const isWordFormationExercise = (
  exercise: WordFormationExerciseData
): exercise is WordFormationExerciseData => {
  return (
    "exercises" in exercise &&
    exercise.exercises.length > 0 &&
    "baseWord" in exercise.exercises[0] &&
    "instruction" in exercise.exercises[0]
  );
};

// Helper function to determine exercise type
const getExerciseType = (exercise: BaseExercise | GapFillExercise | TranslationExercise | MultipleChoiceExercise | MatchingExercise | WordFormationExerciseData): string => {
  if ("pairs" in exercise && "userMatches" in exercise) {
    return "matching";
  }
  if ("sentences" in exercise && exercise.sentences.length > 0) {
    const firstSentence = exercise.sentences[0];
    if ("targetSentence" in firstSentence && "nativeSentence" in firstSentence) {
      return "translation";
    }
    if ("options" in firstSentence && "solution" in firstSentence) {
      return "multiple-choice";
    }
    if ("solution" in firstSentence && !("options" in firstSentence) && !("targetSentence" in firstSentence)) {
      return "gap-fill";
    }
  }
  if ("exercises" in exercise && exercise.exercises.length > 0) {
    const firstExercise = exercise.exercises[0];
    if ("baseWord" in firstExercise && "instruction" in firstExercise) {
      return "word-formation";
    }
  }
  return "unknown";
};

export const generateExercisePDF = (
  exercise: BaseExercise | GapFillExercise | TranslationExercise | MultipleChoiceExercise | MatchingExercise | WordFormationExerciseData
) => {
  try {
    console.log(
      "🔥 PDF Generation: Starting PDF generation for exercise:",
      exercise.id
    );

    const doc = new jsPDF();
    let filename = "";
    let yPosition = 20;
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.height;
    const answers: string[] = [];

    const addText = (text: string, fontSize = 12) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, 180);

      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          // Leave more space for footer
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 15, yPosition);
        yPosition += lineHeight;
      });
    };

    const addTitle = (title: string) => {
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      doc.text(title, 15, yPosition);
      yPosition += 15;
      doc.setFont(undefined, "normal");
    };

    const addSection = (title: string) => {
      yPosition += 5;
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text(title, 15, yPosition);
      yPosition += 10;
      doc.setFont(undefined, "normal");
    };

    const addAnswersToFooter = () => {
      // doc.addPage();
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "normal");
      doc.saveGraphicsState?.();

      let flippedY = pageHeight - 20; // Start from bottom of the page
      doc.setFontSize(8);
      doc.setFont(undefined, "bold");
      doc.text("Answer Key:", 15, flippedY);
      flippedY += 8;

      doc.setFont(undefined, "normal");

      // Handle long answers by splitting into multiple lines if necessary
      const formattedAnswers = answers.map((answer, index) => {
        const numberedAnswer = `${index + 1}. ${answer}`;
        return doc.splitTextToSize(numberedAnswer, 180);
      });

      // Join the answers with a comma, except for the last one
      const jointAnswers = formattedAnswers
        .map((lines, idx) => {
          const answerText = lines.join(" ");
          return idx < formattedAnswers.length - 1
            ? `${answerText};`
            : answerText;
        })
        .join(" ");

      doc.text(jointAnswers, 145, flippedY, {
        align: "left",
        angle: 180,
      });

      doc.restoreGraphicsState?.();
    };

    const exerciseType = getExerciseType(exercise);

    if (exerciseType === "matching" && isMatchingExercise(exercise as MatchingExercise)) {
      const matchingExercise = exercise as MatchingExercise;
      console.log("🔥 PDF Generation: Generating matching exercise PDF");
      addTitle("Matching Exercise");
      filename = "matching-exercise.pdf";
      console.log("🔥 PDF Generation: Set filename to:", filename);

      addSection("Instructions:");
      addText("Match the words with their translations.");

      addSection("Target Language Words:");
      matchingExercise.pairs.forEach((pair, i) => {
        addText(`${i + 1}. ${pair.targetWord}`);
      });

      addSection("Native Language Words:");
      matchingExercise.pairs.forEach((pair, i) => {
        addText(`${String.fromCharCode(65 + i)}. ${pair.nativeWord}`);
      });

      // Prepare answers
      matchingExercise.pairs.forEach((pair, i) => {
        answers.push(`${pair.targetWord} - ${pair.nativeWord}`);
      });
    } else if (exerciseType === "translation" && isTranslationExercise(exercise as TranslationExercise)) {
      const translationExercise = exercise as TranslationExercise;
      console.log("🔥 PDF Generation: Generating translation exercise PDF");
      addTitle("Translation Exercise");
      filename = "translation-exercise.pdf";
      console.log("🔥 PDF Generation: Set filename to:", filename);

      addSection("Instructions:");
      addText("Translate the following sentences.");

      addSection("Questions:");
      translationExercise.sentences.forEach((sentence, i) => {
        addText(`${i + 1}. ${sentence.targetSentence}`);
        addText("   _________________________________");
        yPosition += 5;
        answers.push(sentence.nativeSentence);
      });
    } else if (exerciseType === "multiple-choice" && isMultipleChoiceExercise(exercise as MultipleChoiceExercise)) {
      const multipleChoiceExercise = exercise as MultipleChoiceExercise;
      console.log("🔥 PDF Generation: Generating multiple choice exercise PDF");
      addTitle("Multiple Choice Exercise");
      filename = "multiple-choice-exercise.pdf";
      console.log("🔥 PDF Generation: Set filename to:", filename);

      addSection("Instructions:");
      addText("Choose the correct answer for each question.");

      addSection("Questions:");
      multipleChoiceExercise.sentences.forEach((sentence, i) => {
        addText(`${i + 1}. ${sentence.sentence}`);
        sentence.options.forEach((option, idx) => {
          addText(`   ${String.fromCharCode(65 + idx)}) ${option}`);
        });
        yPosition += 5;
        answers.push(sentence.solution);
      });
    } else if (exerciseType === "gap-fill" && isGapFillExercise(exercise as GapFillExercise)) {
      const gapFillExercise = exercise as GapFillExercise;
      console.log("🔥 PDF Generation: Generating gap-fill exercise PDF");
      addTitle("Gap-Fill Exercise");
      filename = "gap-fill-exercise.pdf";
      console.log("🔥 PDF Generation: Set filename to:", filename);

      addSection("Instructions:");
      addText("Fill in the blanks with the correct word.");

      addSection("Questions:");
      gapFillExercise.sentences.forEach((sentence, i) => {
        addText(`${i + 1}. ${sentence.sentence}`);
        addText("   Answer: _______________");
        yPosition += 5;
        answers.push(sentence.solution);
      });
    } else if (exerciseType === "word-formation" && isWordFormationExercise(exercise as WordFormationExerciseData)) {
      const wordFormationExercise = exercise as WordFormationExerciseData;
      console.log("🔥 PDF Generation: Generating word formation exercise PDF");
      addTitle("Word Formation Exercise");
      filename = "word-formation-exercise.pdf";
      console.log("🔥 PDF Generation: Set filename to:", filename);

      addSection("Instructions:");
      addText("Create new words using the given base words and instructions.");

      addSection("Questions:");
      wordFormationExercise.exercises.forEach((ex, i) => {
        addText(`${i + 1}. ${ex.instruction}`);
        addText(`   Base word: ${ex.baseWord}`);
        if (ex.hint) {
          addText(`   Hint: ${ex.hint}`);
        }
        addText("   Answer: _______________");
        yPosition += 5;
        answers.push(ex.solution);
      });
    } else {
      console.log(
        "🔥 PDF Generation: Unknown exercise type, generating generic PDF"
      );
      addTitle("Exercise");
      addText("Exercise content not available");
      filename = "exercise.pdf";
      console.log("🔥 PDF Generation: Set filename to:", filename);
    }

    // Add answers to footer if we have any
    if (answers.length > 0) {
      addAnswersToFooter();
    }

    console.log("🔥 PDF Generation: Generated answers:", answers);

    console.log(
      "🔥 PDF Generation: Preparing PDF download with filename:",
      filename
    );

    // Generate PDF as blob and force download
    const pdfBlob = doc.output("blob");
    console.log(
      "🔥 PDF Generation: PDF blob created, size:",
      pdfBlob.size,
      "bytes"
    );

    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    console.log(
      "🔥 PDF Generation: About to set download filename to:",
      filename
    );
    downloadLink.download = filename;
    console.log(
      "🔥 PDF Generation: Download link filename set to:",
      downloadLink.download
    );
    downloadLink.style.display = "none";

    // Add to DOM, click, and remove
    document.body.appendChild(downloadLink);
    console.log(
      "🔥 PDF Generation: Triggering download for file:",
      downloadLink.download
    );
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up the URL
    setTimeout(() => {
      URL.revokeObjectURL(url);
      console.log(
        "🔥 PDF Generation: PDF download completed and URL cleaned up"
      );
    }, 100);
  } catch (error) {
    console.error("🔥 PDF Generation: Error generating PDF:", error);
    alert("Error generating PDF. Please check the console for details.");
  }
};
