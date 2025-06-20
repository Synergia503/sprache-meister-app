
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, CheckCircle, Download, Shuffle } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { useToast } from '@/hooks/use-toast';

interface MatchingPair {
  pairOrder: number;
  germanWord: string;
  englishWord: string;
}

interface MatchingExercise {
  id: string;
  words: string[];
  pairs: MatchingPair[];
  userMatches: { [key: number]: number };
  isCompleted: boolean;
  createdAt: Date;
}

const Matching = () => {
  const [words, setWords] = useState<string[]>(['']);
  const [currentExercise, setCurrentExercise] = useState<MatchingExercise | null>(null);
  const [userMatches, setUserMatches] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [shuffledEnglish, setShuffledEnglish] = useState<MatchingPair[]>([]);
  const [previousExercises, setPreviousExercises] = useState<MatchingExercise[]>([]);
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

  const shuffleArray = (array: MatchingPair[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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

    const prompt = `Create a German-English matching exercise with these German words: ${validWords.join(', ')}. For each German word, provide its most common English translation.

Return only a JSON object with this exact format:
{
  "pairs": [
    {
      "pairOrder": 1,
      "germanWord": "Hund",
      "englishWord": "dog"
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating matching exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const exercise: MatchingExercise = {
          id: Date.now().toString(),
          words: validWords,
          pairs: exerciseData.pairs,
          userMatches: {},
          isCompleted: false,
          createdAt: new Date()
        };
        setCurrentExercise(exercise);
        setShuffledEnglish(shuffleArray(exerciseData.pairs));
        setUserMatches({});
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

  const handleMatch = (germanIndex: number, englishIndex: number) => {
    if (showResults) return;
    
    setUserMatches(prev => ({
      ...prev,
      [germanIndex]: englishIndex
    }));
  };

  const checkAnswers = () => {
    if (!currentExercise) return;

    const updatedExercise = {
      ...currentExercise,
      userMatches,
      isCompleted: true
    };

    setPreviousExercises(prev => [...prev, updatedExercise]);
    setShowResults(true);
    
    toast({
      title: "Exercise completed!",
      description: "Your matches have been checked and saved.",
    });
  };

  const downloadPDF = () => {
    if (!currentExercise) return;
    
    const content = currentExercise.pairs.map(p => 
      `${p.germanWord} - ${p.englishWord}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matching-exercise.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMatchingResult = (germanIndex: number) => {
    if (!showResults || !currentExercise) return '';
    
    const userMatch = userMatches[germanIndex];
    if (userMatch === undefined) return '';
    
    const correctEnglishIndex = currentExercise.pairs.findIndex(p => p.pairOrder === germanIndex + 1);
    const userEnglishIndex = shuffledEnglish.findIndex(p => p.pairOrder === userMatch + 1);
    
    return correctEnglishIndex === userEnglishIndex ? 'correct' : 'incorrect';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Matching Exercise</h1>
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
            <CardTitle>Create New Matching Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add up to 20 German words or phrases. The exercise will create German-English matching pairs.
              </p>
              
              {words.map((word, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`German word ${index + 1}`}
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
              <CardTitle>Match German words with their English translations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium mb-4">German</h3>
                  {currentExercise.pairs.map((pair, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        showResults 
                          ? getMatchingResult(index) === 'correct' 
                            ? 'bg-green-100 border-green-300' 
                            : getMatchingResult(index) === 'incorrect'
                            ? 'bg-red-100 border-red-300'
                            : 'bg-gray-50'
                          : userMatches[index] !== undefined 
                          ? 'bg-blue-100 border-blue-300' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{index + 1}. {pair.germanWord}</span>
                      {userMatches[index] !== undefined && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          → {shuffledEnglish[userMatches[index]]?.englishWord}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium mb-4">English</h3>
                  {shuffledEnglish.map((pair, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => {
                        const germanIndex = Object.keys(userMatches).find(k => userMatches[parseInt(k)] === index);
                        if (germanIndex) {
                          const newMatches = { ...userMatches };
                          delete newMatches[parseInt(germanIndex)];
                          setUserMatches(newMatches);
                        }
                        // Find next unmatched German word
                        const nextUnmatched = currentExercise.pairs.findIndex((_, i) => userMatches[i] === undefined);
                        if (nextUnmatched !== -1) {
                          handleMatch(nextUnmatched, index);
                        }
                      }}
                      disabled={showResults}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + index)}. {pair.englishWord}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                {!showResults ? (
                  <>
                    <Button onClick={checkAnswers} disabled={Object.keys(userMatches).length !== currentExercise.pairs.length}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Check Matches
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShuffledEnglish(shuffleArray(shuffledEnglish));
                        setUserMatches({});
                      }}
                    >
                      <Shuffle className="h-4 w-4 mr-2" />
                      Shuffle
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => {
                    setCurrentExercise(null);
                    setShowResults(false);
                    setUserMatches({});
                    setShuffledEnglish([]);
                  }}>
                    New Exercise
                  </Button>
                )}
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
                      setShuffledEnglish(shuffleArray(exercise.pairs));
                      setUserMatches(exercise.userMatches);
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

export default Matching;
