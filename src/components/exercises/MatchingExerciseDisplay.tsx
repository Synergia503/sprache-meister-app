import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shuffle, Download } from "lucide-react";
import { MatchingExercise, MatchingPair } from "@/types/exercises";
import { useLanguage } from "@/contexts/LanguageContext";

interface MatchingExerciseDisplayProps {
  exercise: MatchingExercise;
  userMatches: { [key: number]: number };
  showResults: boolean;
  shuffledNative: MatchingPair[];
  selectedTarget: number | null;
  selectedNative: number | null;
  onMatch: (targetIndex: number, nativeIndex: number) => void;
  onCheckAnswers: () => void;
  onShuffle: () => void;
  onNewExercise: () => void;
  onSelectTarget: (index: number) => void;
  onSelectNative: (index: number) => void;
  getMatchingResult: (targetIndex: number) => string;
  onDownload?: () => void;
}

export const MatchingExerciseDisplay = ({
  exercise,
  userMatches,
  showResults,
  shuffledNative,
  selectedTarget,
  selectedNative,
  onMatch,
  onCheckAnswers,
  onShuffle,
  onNewExercise,
  onSelectTarget,
  onSelectNative,
  getMatchingResult,
  onDownload,
}: MatchingExerciseDisplayProps) => {
  const { languageSettings } = useLanguage();
  
  const isEnglishWordUsed = (englishIndex: number) => {
    return Object.values(userMatches).includes(englishIndex);
  };

  const handleTargetClick = (targetIndex: number) => {
    if (showResults) return;

    // If this target word is already matched, clear the match
    if (userMatches[targetIndex] !== undefined) {
      onMatch(targetIndex, -1); // -1 indicates clearing the match
      return;
    }

    // If there's a selected native word, make the match
    if (selectedNative !== null) {
      onMatch(targetIndex, selectedNative);
      return;
    }

    // Otherwise, just select this target word
    onSelectTarget(targetIndex);
  };

  const handleNativeClick = (nativeIndex: number) => {
    if (showResults) return;

    // If this native word is already used in a match, clear that match
    if (isEnglishWordUsed(nativeIndex)) {
      const targetIndexUsingThis = Object.keys(userMatches).find(
        (key) => userMatches[parseInt(key)] === nativeIndex
      );
      if (targetIndexUsingThis) {
        onMatch(parseInt(targetIndexUsingThis), -1);
      }
      return;
    }

    // If there's a selected target word, make the match
    if (selectedTarget !== null) {
      onMatch(selectedTarget, nativeIndex);
      return;
    }

    // Otherwise, just select this native word
    onSelectNative(nativeIndex);
  };

  return (
    <Card>
              <CardHeader>
          <CardTitle>
            {`Match ${languageSettings.targetLanguage.nativeName} words with their ${languageSettings.nativeLanguage.nativeName} translations`}
          </CardTitle>
        </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium mb-4">{languageSettings.targetLanguage.nativeName}</h3>
            {exercise.pairs.map((pair, index) => (
              <div
                key={index}
                className={`p-3 border rounded cursor-pointer transition-colors min-h-[48px] flex items-center ${
                  showResults
                    ? getMatchingResult(index) === "correct"
                      ? "bg-green-100 border-green-300"
                      : getMatchingResult(index) === "incorrect"
                      ? "bg-red-100 border-red-300"
                      : "bg-gray-50"
                    : userMatches[index] !== undefined
                    ? "bg-blue-100 border-blue-300"
                    : selectedTarget === index
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleTargetClick(index)}
              >
                <span className="font-medium text-sm">
                  {index + 1}. {pair.targetWord}
                </span>
                {/* Show the user's match if available */}
                {userMatches[index] !== undefined && (
                  <span className="ml-2 text-sm text-gray-600">
                    → {shuffledNative[userMatches[index]].nativeWord}
                  </span>
                )}
                {/* Always show correct answer */}
                {showResults && (
                  <span className="ml-auto text-sm text-green-600 font-medium">
                    → {pair.nativeWord}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-medium mb-4">{languageSettings.nativeLanguage.nativeName}</h3>
            {shuffledNative.map((pair, index) => (
              <div
                key={index}
                className={`min-h-[48px] flex items-center p-3 border rounded cursor-pointer transition-colors ${
                  isEnglishWordUsed(index)
                    ? "bg-blue-100 border-blue-300"
                    : selectedNative === index
                    ? "bg-blue-50 border-blue-200"
                    : showResults
                    ? "border-gray-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleNativeClick(index)}
              >
                <span className="font-medium text-sm">
                  {String.fromCharCode(65 + index)}. {pair.nativeWord}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          {!showResults ? (
            <>
              <Button
                onClick={onCheckAnswers}
                disabled={
                  Object.keys(userMatches).length !== exercise.pairs.length
                }
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {languageSettings.nativeLanguage.code === 'pl' ? 'Sprawdź dopasowania' : 
                 languageSettings.nativeLanguage.code === 'de' ? 'Übereinstimmungen prüfen' :
                 languageSettings.nativeLanguage.code === 'es' ? 'Verificar coincidencias' :
                 languageSettings.nativeLanguage.code === 'fr' ? 'Vérifier les correspondances' :
                 languageSettings.nativeLanguage.code === 'it' ? 'Verifica corrispondenze' :
                 'Check Matches'}
              </Button>
              <Button variant="outline" onClick={onShuffle}>
                <Shuffle className="h-4 w-4 mr-2" />
                {languageSettings.nativeLanguage.code === 'pl' ? 'Przetasuj' : 
                 languageSettings.nativeLanguage.code === 'de' ? 'Mischen' :
                 languageSettings.nativeLanguage.code === 'es' ? 'Mezclar' :
                 languageSettings.nativeLanguage.code === 'fr' ? 'Mélanger' :
                 languageSettings.nativeLanguage.code === 'it' ? 'Mescola' :
                 'Shuffle'}
              </Button>
              {onDownload && (
                <Button variant="outline" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  {languageSettings.nativeLanguage.code === 'pl' ? 'Generuj PDF' : 
                   languageSettings.nativeLanguage.code === 'de' ? 'PDF generieren' :
                   languageSettings.nativeLanguage.code === 'es' ? 'Generar PDF' :
                   languageSettings.nativeLanguage.code === 'fr' ? 'Générer PDF' :
                   languageSettings.nativeLanguage.code === 'it' ? 'Genera PDF' :
                   'Generate PDF'}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button onClick={onNewExercise} variant="outline">
                {languageSettings.nativeLanguage.code === 'pl' ? 'Uruchom ponownie to samo ćwiczenie' : 
                 languageSettings.nativeLanguage.code === 'de' ? 'Gleiche Übung wiederholen' :
                 languageSettings.nativeLanguage.code === 'es' ? 'Reiniciar el mismo ejercicio' :
                 languageSettings.nativeLanguage.code === 'fr' ? 'Redémarrer le même exercice' :
                 languageSettings.nativeLanguage.code === 'it' ? 'Riavvia lo stesso esercizio' :
                 'Restart Same Exercise'}
              </Button>
              <Button onClick={() => window.location.reload()}>
                {languageSettings.nativeLanguage.code === 'pl' ? 'Nowe ćwiczenie' : 
                 languageSettings.nativeLanguage.code === 'de' ? 'Neue Übung' :
                 languageSettings.nativeLanguage.code === 'es' ? 'Nuevo ejercicio' :
                 languageSettings.nativeLanguage.code === 'fr' ? 'Nouvel exercice' :
                 languageSettings.nativeLanguage.code === 'it' ? 'Nuovo esercizio' :
                 'New Exercise'}
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
