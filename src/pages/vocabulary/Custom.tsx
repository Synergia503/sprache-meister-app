import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Search,
  Plus,
  Trash2,
  Edit,
  Star,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVocabulary } from "@/contexts/VocabularyContext";
import { CustomWord, ExtractedWord, SortOption } from "@/types/vocabulary";
import ExerciseDropZone from "@/components/ExerciseDropZone";
import PhotoWordExtractor from "@/components/PhotoWordExtractor";
import { AnkiExport } from "@/components/AnkiExport";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

interface DraggedData {
  type: "word";
  word: CustomWord;
}

const Custom = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { languageSettings } = useLanguage();
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTargetWord, setNewTargetWord] = useState("");
  const [newNativeWord, setNewNativeWord] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showLearningHistoryOnly, setShowLearningHistoryOnly] = useState(false);
  const [draggedWord, setDraggedWord] = useState<CustomWord | null>(null);
  const [droppedWords, setDroppedWords] = useState<CustomWord[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [touchStarted, setTouchStarted] = useState<string | null>(null);
  const wordsPerPage = 10;

  const {
    getFilteredAndSortedWords,
    addWord,
    removeWord,
    toggleFavorite,
    setFilters,
    sortOption,
    setSortOption,
    sortOrder,
    setSortOrder,
  } = useVocabulary();

  // Apply filters when local state changes
  React.useEffect(() => {
    setFilters({
      searchTerm: searchTerm || undefined,
      category:
        selectedCategory && selectedCategory !== "all"
          ? selectedCategory
          : undefined,
      favorites: showFavoritesOnly || undefined,
      hasLearningHistory: showLearningHistoryOnly || undefined,
    });
  }, [
    searchTerm,
    selectedCategory,
    showFavoritesOnly,
    showLearningHistoryOnly,
    setFilters,
  ]);

  const handleAddCustomWord = () => {
    if (!newTargetWord.trim() || !newNativeWord.trim()) {
      toast({
        title: "Missing information",
        description: `Please fill in both ${languageSettings.targetLanguage.nativeName} and ${languageSettings.nativeLanguage.nativeName} words.`,
        variant: "destructive",
      });
      return;
    }

    const newWord: CustomWord = {
      id: Date.now().toString(),
      targetLanguage: languageSettings.targetLanguage,
      nativeLanguage: languageSettings.nativeLanguage,
      targetWord: newTargetWord.trim(),
      nativeWord: newNativeWord.trim(),
      categories: [],
      sampleSentence: "",
      dateAdded: new Date(),
      learningHistory: [],
      isFavorite: false,
    };

    addWord(newWord);
    setNewTargetWord("");
    setNewNativeWord("");
    setShowAddForm(false);

    toast({
      title: "Word added!",
      description: `"${newWord.targetWord}" has been added to your custom vocabulary.`,
    });
  };

  const handleDeleteWord = (id: string) => {
    removeWord(id);
    toast({
      title: "Word deleted",
      description: "The word has been removed from your vocabulary.",
    });
  };

  const handleWordsExtracted = (extractedWords: ExtractedWord[]) => {
    extractedWords.forEach((extractedWord) => {
      const newWord: CustomWord = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        targetLanguage: languageSettings.targetLanguage,
        nativeLanguage: languageSettings.nativeLanguage,
        targetWord: extractedWord.targetWord,
        nativeWord: extractedWord.nativeWord,
        categories: extractedWord.categories || [],
        sampleSentence: "",
        dateAdded: new Date(),
        learningHistory: [],
        isFavorite: false,
      };
      addWord(newWord);
    });

    toast({
      title: "Words extracted!",
      description: `${extractedWords.length} words have been added to your vocabulary.`,
    });
  };

  const handleWordClick = (wordId: string) => {
    navigate(`/vocabulary/custom/${wordId}`);
  };

  const handleDragStart = (
    word: CustomWord,
    isMultiSelect: boolean = false
  ) => {
    if (isMultiSelect) {
      setDraggedWord(word);
    } else {
      setDraggedWord(word);
    }
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
  };

  const handleDrop = (draggedData: DraggedData) => {
    if (draggedData && draggedData.type === "word") {
      const word = draggedData.word as CustomWord;
      if (!droppedWords.find((w) => w.id === word.id)) {
        setDroppedWords((prev) => [...prev, word]);
        toast({
          title: "Word added to exercise",
          description: `${word.targetWord} has been added to the exercise.`,
        });
      }
    }
  };

  const handleTouchStart = (wordId: string) => {
    setTouchStarted(wordId);
    touchTimeoutRef.current = setTimeout(() => {
      setIsMultiSelectMode(true);
      setSelectedWords((prev) => new Set([...prev, wordId]));
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    setTouchStarted(null);
  };

  const handleWordSelection = (wordId: string, ctrlKey: boolean) => {
    if (isMultiSelectMode || ctrlKey) {
      setSelectedWords((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(wordId)) {
          newSet.delete(wordId);
        } else {
          newSet.add(wordId);
        }
        return newSet;
      });
    } else {
      handleWordClick(wordId);
    }
  };

  const handleAddToExercise = () => {
    const selectedWordsList = getFilteredAndSortedWords().filter((word) =>
      selectedWords.has(word.id)
    );

    if (selectedWordsList.length === 0) {
      toast({
        title: "No words selected",
        description: "Please select at least one word to add to the exercise.",
        variant: "destructive",
      });
      return;
    }

    setDroppedWords((prev) => [...prev, ...selectedWordsList]);
    setSelectedWords(new Set());
    setIsMultiSelectMode(false);

    toast({
      title: "Words added to exercise",
      description: `${selectedWordsList.length} words have been added to the exercise.`,
    });
  };

  const handleRemoveFromDropZone = (wordId: string) => {
    setDroppedWords((prev) => prev.filter((word) => word.id !== wordId));
  };

  const handleClearDropZone = () => {
    setDroppedWords([]);
  };

  const calculateSuccessRate = (word: CustomWord) => {
    if (!word.learningHistory.length) return 0;
    const successCount = word.learningHistory.filter((h) => h.success).length;
    return Math.round((successCount / word.learningHistory.length) * 100);
  };

  const filteredWords = getFilteredAndSortedWords();
  const totalPages = Math.ceil(filteredWords.length / wordsPerPage);
  const startIndex = (currentPage - 1) * wordsPerPage;
  const endIndex = startIndex + wordsPerPage;
  const currentWords = filteredWords.slice(startIndex, endIndex);

  const getAnkiItems = () => {
    return droppedWords.map((word) => ({
      front: word.targetWord,
      back: `${word.nativeWord}${
        word.sampleSentence ? `\n\n${word.sampleSentence}` : ""
      }`,
      tags: ["custom-vocabulary", ...word.categories],
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Custom Vocabulary</h1>
          <p className="text-muted-foreground">
            Manage your personal vocabulary collection
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Word
        </Button>
      </div>

      {/* Add Word Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Word</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target-word">
                  {languageSettings.targetLanguage.nativeName} Word
                </Label>
                <Input
                  id="target-word"
                  placeholder={`Enter ${languageSettings.targetLanguage.nativeName} word`}
                  value={newTargetWord}
                  onChange={(e) => setNewTargetWord(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="native-word">
                  {languageSettings.nativeLanguage.nativeName} Translation
                </Label>
                <Input
                  id="native-word"
                  placeholder={`Enter ${languageSettings.nativeLanguage.nativeName} translation`}
                  value={newNativeWord}
                  onChange={(e) => setNewNativeWord(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCustomWord}>Add Word</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search words..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {/* Add categories dynamically */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort">Sort by</Label>
              <Select
                value={sortOption}
                onValueChange={(value: SortOption) => setSortOption(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateAdded">Date Added</SelectItem>
                  <SelectItem value="targetWord">
                    {languageSettings.targetLanguage.nativeName} (A-Z)
                  </SelectItem>
                  <SelectItem value="nativeWord">
                    {languageSettings.nativeLanguage.nativeName} (A-Z)
                  </SelectItem>
                  <SelectItem value="learningProgress">
                    Learning Progress
                  </SelectItem>
                  <SelectItem value="lastLearning">Last Learned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Words Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentWords.map((word) => (
          <Card
            key={word.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedWords.has(word.id) ? "ring-2 ring-primary" : ""
            }`}
            draggable
            onDragStart={() => handleDragStart(word)}
            onDragEnd={handleDragEnd}
            onTouchStart={() => handleTouchStart(word.id)}
            onTouchEnd={handleTouchEnd}
            onClick={() => handleWordSelection(word.id, false)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    <span className="font-medium">{word.targetWord}</span> -{" "}
                    <span className="text-muted-foreground">
                      {word.nativeWord}
                    </span>
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  {word.isFavorite && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(word.id);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        word.isFavorite
                          ? "text-red-500 fill-current"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {word.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {word.categories.slice(0, 3).map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs"
                      >
                        {category}
                      </Badge>
                    ))}
                    {word.categories.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{word.categories.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Success: {calculateSuccessRate(word)}%</span>
                  <span>{word.learningHistory.length} exercises</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Exercise Drop Zone */}
      {droppedWords.length > 0 && (
        <ExerciseDropZone
          droppedWords={droppedWords}
          onRemoveWord={handleRemoveFromDropZone}
          onClearAll={handleClearDropZone}
        />
      )}

      {/* Anki Export */}
      {droppedWords.length > 0 && (
        <AnkiExport
          items={getAnkiItems()}
          defaultDeckName={`${languageSettings.targetLanguage.nativeName} Vocabulary`}
        />
      )}

      {/* Photo Word Extractor */}
      <PhotoWordExtractor onWordsExtracted={handleWordsExtracted} />
    </div>
  );
};

export default Custom;
