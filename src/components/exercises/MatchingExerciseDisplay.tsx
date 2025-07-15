import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shuffle, Download } from "lucide-react";
import { MatchingExercise, MatchingPair } from "@/types/exercises";

interface MatchingExerciseDisplayProps {
  exercise: MatchingExercise;
  userMatches: { [key: number]: number };
  showResults: boolean;
  shuffledEnglish: MatchingPair[];
  selectedGerman: number | null;
  selectedEnglish: number | null;
  onMatch: (germanIndex: number, englishIndex: number) => void;
  onCheckAnswers: () => void;
  onShuffle: () => void;
  onNewExercise: () => void;
  onSelectGerman: (index: number) => void;
  onSelectEnglish: (index: number) => void;
  getMatchingResult: (germanIndex: number) => string;
  onDownload?: () => void;
}

export const MatchingExerciseDisplay = ({
  exercise,
  userMatches,
  showResults,
  shuffledEnglish,
  selectedGerman,
  selectedEnglish,
  onMatch,
  onCheckAnswers,
  onShuffle,
  onNewExercise,
  onSelectGerman,
  onSelectEnglish,
  getMatchingResult,
  onDownload
}: MatchingExerciseDisplayProps) => {
  const isEnglishWordUsed = (englishIndex: number) => {
    return Object.values(userMatches).includes(englishIndex);
  };

  const handleGermanClick = (germanIndex: number) => {
    if (showResults) return;
    
    // If this German word is already matched, clear the match
    if (userMatches[germanIndex] !== undefined) {
      onMatch(germanIndex, -1); // -1 indicates clearing the match
      return;
    }
    
    // If there's a selected English word, make the match
    if (selectedEnglish !== null) {
      onMatch(germanIndex, selectedEnglish);
      return;
    }
    
    // Otherwise, just select this German word
    onSelectGerman(germanIndex);
  };

  const handleEnglishClick = (englishIndex: number) => {
    if (showResults) return;
    
    // If this English word is already used in a match, clear that match
    if (isEnglishWordUsed(englishIndex)) {
      const germanIndexUsingThis = Object.keys(userMatches).find(
        key => userMatches[parseInt(key)] === englishIndex
      );
      if (germanIndexUsingThis) {
        onMatch(parseInt(germanIndexUsingThis), -1);
      }
      return;
    }
    
    // If there's a selected German word, make the match
    if (selectedGerman !== null) {
      onMatch(selectedGerman, englishIndex);
      return;
    }
    
    // Otherwise, just select this English word
    onSelectEnglish(englishIndex);
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
                className={`p-3 border rounded cursor-pointer transition-colors min-h-[48px] flex items-center ${
                  showResults 
                    ? getMatchingResult(index) === 'correct' 
                      ? 'bg-green-100 border-green-300' 
                      : getMatchingResult(index) === 'incorrect'
                      ? 'bg-red-100 border-red-300'
                      : 'bg-gray-50'
                    : userMatches[index] !== undefined 
                    ? 'bg-blue-100 border-blue-300'
                    : selectedGerman === index
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleGermanClick(index)}
              >
                <span className="font-medium text-sm">{index + 1}. {pair.germanWord}</span>
                {userMatches[index] !== undefined && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    → {shuffledEnglish[userMatches[index]]?.englishWord}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium mb-4">English</h3>
            {shuffledEnglish.map((pair, index) => (
              <div
                key={index}
                className={`min-h-[48px] flex items-center p-3 border rounded cursor-pointer transition-colors ${
                  isEnglishWordUsed(index) 
                    ? 'bg-blue-100 border-blue-300' 
                    : selectedEnglish === index
                    ? 'bg-blue-50 border-blue-200'
                    : showResults 
                    ? 'border-gray-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleEnglishClick(index)}
              >
                <span className="font-medium text-sm">{String.fromCharCode(65 + index)}. {pair.englishWord}</span>
              </div>
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
              {onDownload && (
                <Button variant="outline" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
              )}
            </>
          ) : (
            <>
              <Button onClick={onNewExercise} variant="outline">
                Restart Same Exercise
              </Button>
              <Button onClick={() => window.location.reload()}>
                New Exercise
              </Button>
              {onDownload && (
                <Button variant="outline" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
