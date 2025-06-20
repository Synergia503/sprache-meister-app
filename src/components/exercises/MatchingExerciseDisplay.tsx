
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shuffle } from "lucide-react";
import { MatchingExercise, MatchingPair } from "@/types/exercises";

interface MatchingExerciseDisplayProps {
  exercise: MatchingExercise;
  userMatches: { [key: number]: number };
  showResults: boolean;
  shuffledEnglish: MatchingPair[];
  onMatch: (germanIndex: number, englishIndex: number) => void;
  onCheckAnswers: () => void;
  onShuffle: () => void;
  onNewExercise: () => void;
  getMatchingResult: (germanIndex: number) => string;
}

export const MatchingExerciseDisplay = ({
  exercise,
  userMatches,
  showResults,
  shuffledEnglish,
  onMatch,
  onCheckAnswers,
  onShuffle,
  onNewExercise,
  getMatchingResult
}: MatchingExerciseDisplayProps) => {
  const isEnglishWordUsed = (englishIndex: number) => {
    return Object.values(userMatches).includes(englishIndex);
  };

  const handleGermanClick = (germanIndex: number) => {
    if (showResults) return;
    
    // If this German word is already matched, clear the match
    if (userMatches[germanIndex] !== undefined) {
      const newMatches = { ...userMatches };
      delete newMatches[germanIndex];
      onMatch(germanIndex, -1); // -1 indicates clearing the match
    }
  };

  const handleEnglishClick = (englishIndex: number) => {
    if (showResults) return;
    
    // Find if this English word is already matched to a German word
    const germanIndexUsingThis = Object.keys(userMatches).find(
      key => userMatches[parseInt(key)] === englishIndex
    );
    
    if (germanIndexUsingThis) {
      // Clear the existing match first
      const newMatches = { ...userMatches };
      delete newMatches[parseInt(germanIndexUsingThis)];
    }
    
    // Find the first unmatched German word
    const nextUnmatched = exercise.pairs.findIndex((_, i) => userMatches[i] === undefined);
    if (nextUnmatched !== -1) {
      onMatch(nextUnmatched, englishIndex);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match German words with their English translations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium mb-4">German</h3>
            {exercise.pairs.map((pair, index) => (
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
                    ? 'bg-blue-100 border-blue-300 opacity-60' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleGermanClick(index)}
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
                className={`w-full justify-start h-auto p-3 ${
                  isEnglishWordUsed(index) ? 'bg-blue-100 border-blue-300 opacity-60' : ''
                }`}
                onClick={() => handleEnglishClick(index)}
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
              <Button onClick={onCheckAnswers} disabled={Object.keys(userMatches).length !== exercise.pairs.length}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Check Matches
              </Button>
              <Button variant="outline" onClick={onShuffle}>
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Button>
            </>
          ) : (
            <Button onClick={onNewExercise}>
              New Exercise
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
