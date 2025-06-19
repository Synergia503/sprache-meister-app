
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, CheckCircle, Download } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { useToast } from '@/hooks/use-toast';

interface GapFillSentence {
  sentenceOrder: number;
  sentence: string;
  solution: string;
}

interface GapFillExercise {
  id: string;
  words: string[];
  sentences: GapFillSentence[];
  userAnswers: { [key: number]: string };
  isCompleted: boolean;
  createdAt: Date;
}

const GapFill = () => {
  const [words, setWords] = useState<string[]>(['']);
  const [currentExercise, setCurrentExercise] = useState<GapFillExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<GapFillExercise[]>([]);
  const { callOpenAI, isLoading, apiKey, saveApiKey } = useOpenAI();
  const { toast } = useToast();

  const addWordField = () => {
    if (words.length < 20) {
      setWords([...words, '']);
    }
  };

  const removeWordField = (index: number) => {
    if (words.length > 1) {
      const newWords = words.filter((_, i) => i !== index);
      setWords(newWords);
    }
  };

  const updateWord = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const generateExercise = async () => {
    const validWords = words.filter(word => word.trim());
    if (validWords.length === 0) {
      toast({
        title: "No words provided",
        description: "Please add at least one word to generate an exercise.",
        variant: "destructive",
      });
      return;
    }

    const prompt = `Create a gap-fill exercise with German words: ${validWords.join(', ')}. Generate ${validWords.length * 3} sentences where each word appears 2-4 times in different grammatical forms. Each sentence should have exactly one gap marked with ___. Randomize the order of words throughout the sentences.

Return only a JSON object with this exact format:
{
  "sentences": [
    {
      "sentenceOrder": 1,
      "sentence": "Ich ___ gestern ins Kino gegangen.",
      "solution": "bin"
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating gap-fill exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const exercise: GapFillExercise = {
          id: Date.now().toString(),
          words: validWords,
          sentences: exerciseData.sentences,
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date()
        };
        setCurrentExercise(exercise);
        setUserAnswers({});
        setShowResults(false);
      } catch (error) {
        toast({
          title: "Error parsing exercise",
          description: "Failed to generate exercise. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAnswerChange = (sentenceOrder: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [sentenceOrder]: answer
    }));
  };

  const checkAnswers = () => {
    if (!currentExercise) return;

    const updatedExercise = {
      ...currentExercise,
      userAnswers,
      isCompleted: true
    };

    setPreviousExercises(prev => [...prev, updatedExercise]);
    setShowResults(true);
    
    toast({
      title: "Exercise completed!",
      description: "Your answers have been checked and saved.",
    });
  };

  const createNewExerciseFromMistakes = () => {
    if (!currentExercise || !showResults) return;

    const incorrectWords: string[] = [];
    currentExercise.sentences.forEach(sentence => {
      const userAnswer = userAnswers[sentence.sentenceOrder] || '';
      if (userAnswer.toLowerCase().trim() !== sentence.solution.toLowerCase().trim()) {
        if (!incorrectWords.includes(sentence.solution)) {
          incorrectWords.push(sentence.solution);
        }
      }
    });

    if (incorrectWords.length > 0) {
      setWords(incorrectWords.concat(Array(Math.max(0, 20 - incorrectWords.length)).fill('')));
      setCurrentExercise(null);
      setShowResults(false);
      setUserAnswers({});
    }
  };

  const downloadPDF = () => {
    if (!currentExercise) return;
    
    // Simple PDF generation simulation
    const content = currentExercise.sentences.map(s => 
      `${s.sentenceOrder}. ${s.sentence}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gap-fill-exercise.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gap-Fill Exercise</h1>
        {currentExercise && (
          <Button onClick={downloadPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        )}
      </div>
      
      <ApiKeyInput apiKey={apiKey} onSaveApiKey={saveApiKey} />

      {!currentExercise ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Gap-Fill Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add up to 20 German words or phrases. The exercise will generate 2-4 times as many sentences with gaps.
              </p>
              
              {words.map((word, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Word ${index + 1}`}
                    value={word}
                    onChange={(e) => updateWord(index, e.target.value)}
                  />
                  {words.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeWordField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <div className="flex gap-2">
                {words.length < 20 && (
                  <Button variant="outline" onClick={addWordField}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Word
                  </Button>
                )}
                <Button 
                  onClick={generateExercise} 
                  disabled={isLoading || !apiKey}
                >
                  Generate Exercise
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gap-Fill Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentExercise.sentences.map((sentence) => (
                  <div key={sentence.sentenceOrder} className="space-y-2">
                    <p className="font-medium">
                      {sentence.sentenceOrder}. {sentence.sentence}
                    </p>
                    <Input
                      placeholder="Your answer"
                      value={userAnswers[sentence.sentenceOrder] || ''}
                      onChange={(e) => handleAnswerChange(sentence.sentenceOrder, e.target.value)}
                      disabled={showResults}
                      className={showResults ? 
                        (userAnswers[sentence.sentenceOrder]?.toLowerCase().trim() === sentence.solution.toLowerCase().trim() ? 
                          'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''
                      }
                    />
                    {showResults && (
                      <p className="text-sm text-muted-foreground">
                        Correct answer: <span className="font-medium">{sentence.solution}</span>
                      </p>
                    )}
                  </div>
                ))}
                
                <div className="flex gap-2">
                  {!showResults ? (
                    <Button onClick={checkAnswers}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Check Answers
                    </Button>
                  ) : (
                    <>
                      <Button onClick={createNewExerciseFromMistakes} variant="outline">
                        Practice Mistakes
                      </Button>
                      <Button onClick={() => {
                        setCurrentExercise(null);
                        setShowResults(false);
                        setUserAnswers({});
                      }}>
                        New Exercise
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {previousExercises.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Previous Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {previousExercises.map((exercise) => (
                <div key={exercise.id} className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">
                    {exercise.createdAt.toLocaleDateString()} - {exercise.words.length} words
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentExercise(exercise);
                      setUserAnswers(exercise.userAnswers);
                      setShowResults(exercise.isCompleted);
                    }}
                  >
                    Open
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GapFill;
