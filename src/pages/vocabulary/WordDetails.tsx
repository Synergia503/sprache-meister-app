import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, Save, X, Star, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVocabulary } from "@/contexts/VocabularyContext";
import { CustomWord } from "@/types/vocabulary";
import { useLanguage } from "@/contexts/LanguageContext";

const WordDetails = () => {
  const { wordId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageSettings } = useLanguage();
  const { getWordById, updateWord, toggleFavorite } = useVocabulary();

  const [word, setWord] = useState<CustomWord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    targetWord: "",
    nativeWord: "",
    categories: [] as string[],
    sampleSentence: "",
  });
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const foundWord = getWordById(wordId || "");
    if (foundWord) {
      setWord(foundWord);
      setEditForm({
        targetWord: foundWord.targetWord,
        nativeWord: foundWord.nativeWord,
        categories: [...foundWord.categories],
        sampleSentence: foundWord.sampleSentence,
      });
    }
  }, [wordId, getWordById]);

  const calculateSuccessRate = () => {
    if (!word?.learningHistory.length) return 0;
    const successCount = word.learningHistory.filter((h) => h.success).length;
    return Math.round((successCount / word.learningHistory.length) * 100);
  };

  const handleSave = () => {
    if (!word) return;

    // Update word with edit form data
    const updatedWord = {
      ...word,
      targetWord: editForm.targetWord,
      nativeWord: editForm.nativeWord,
      categories: editForm.categories,
      sampleSentence: editForm.sampleSentence,
    };

    setWord(updatedWord);
    updateWord(updatedWord);
    setIsEditing(false);

    toast({
      title: "Word updated!",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.trim() || editForm.categories.length >= 5) return;

    if (!editForm.categories.includes(newCategory.trim())) {
      setEditForm((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
      }));
    }
    setNewCategory("");
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setEditForm((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
    }));
  };

  if (!word) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/vocabulary/custom")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vocabulary
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Word not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/vocabulary/custom")}
          className="w-full sm:w-auto min-h-[48px]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vocabulary
        </Button>
        <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
          <Button
            variant="ghost"
            onClick={() => toggleFavorite(word.id)}
            className="flex-1 sm:flex-none min-h-[48px] px-3"
          >
            <Heart
              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                word.isFavorite
                  ? "text-red-500 fill-current"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 sm:flex-none min-h-[48px] px-3"
          >
            {isEditing ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Edit className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {/* Word Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              {isEditing ? (
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="target-word" className="text-sm font-medium">
                      {languageSettings.targetLanguage.nativeName} Word
                    </Label>
                    <Input
                      id="target-word"
                      value={editForm.targetWord}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          targetWord: e.target.value,
                        }))
                      }
                      className="min-h-[48px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="native-word" className="text-sm font-medium">
                      {languageSettings.nativeLanguage.nativeName} Translation
                    </Label>
                    <Input
                      id="native-word"
                      value={editForm.nativeWord}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          nativeWord: e.target.value,
                        }))
                      }
                      className="min-h-[48px]"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span className="font-bold text-primary">
                    {word.targetWord}
                  </span>
                  <span className="text-muted-foreground hidden sm:inline">—</span>
                  <span className="break-words">{word.nativeWord}</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {/* Categories */}
            <div>
              <Label className="text-sm font-medium">Categories</Label>
              {isEditing ? (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Add category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddCategory()
                      }
                      className="min-h-[48px] flex-1"
                    />
                    <Button
                      onClick={handleAddCategory}
                      disabled={!newCategory.trim()}
                      className="w-full sm:w-auto min-h-[48px]"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editForm.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {category}
                        <Button
                          variant="ghost"
                          className="h-4 w-4 p-0 min-h-0"
                          onClick={() => handleRemoveCategory(category)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {word.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Sample Sentence */}
            <div>
              <Label htmlFor="sample-sentence" className="text-sm font-medium">Sample Sentence</Label>
              {isEditing ? (
                <Textarea
                  id="sample-sentence"
                  placeholder={`Enter a sample sentence in ${languageSettings.targetLanguage.nativeName}`}
                  value={editForm.sampleSentence}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      sampleSentence: e.target.value,
                    }))
                  }
                  rows={3}
                  className="min-h-[48px]"
                />
              ) : (
                <p className="text-sm sm:text-base text-muted-foreground break-words">
                  {word.sampleSentence || "No sample sentence provided"}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleSave} className="w-full sm:w-auto min-h-[48px]">Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto min-h-[48px]">
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Learning Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-2 sm:p-3">
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  {calculateSuccessRate()}%
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
              <div className="text-center p-2 sm:p-3">
                <div className="text-xl sm:text-2xl font-bold">
                  {word.learningHistory.length}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Exercises Completed
                </div>
              </div>
              <div className="text-center p-2 sm:p-3">
                <div className="text-xl sm:text-2xl font-bold">
                  {word.learningHistory.filter((h) => h.success).length}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Correct Answers
                </div>
              </div>
              <div className="text-center p-2 sm:p-3">
                <div className="text-xl sm:text-2xl font-bold">
                  {word.lastLearningDate ? "Yes" : "No"}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Recently Practiced
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning History */}
        {word.learningHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Learning History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {word.learningHistory
                  .slice(-5)
                  .reverse()
                  .map((result, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded gap-2 sm:gap-0"
                    >
                      <div>
                        <div className="font-medium capitalize text-sm sm:text-base">
                          {result.exerciseType.replace("-", " ")}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {result.date.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Badge
                          variant={result.success ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {result.success ? "Correct" : "Incorrect"}
                        </Badge>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {result.timeSpent}s
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WordDetails;
