import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  Star,
  Loader2,
  BookOpen,
  X,
  Edit,
  Trash,
  List,
  ChevronRight,
  Filter,
  Search,
  ArrowUpDown,
  Heart,
  Clock,
  Target,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PhotoWordExtractor from "@/components/PhotoWordExtractor";
import ExerciseDropZone from "@/components/ExerciseDropZone";
import { useVocabulary } from "@/contexts/VocabularyContext";
import { ExtractedWord, CustomWord } from "@/types/vocabulary";

// Remove duplicate interfaces - they're now in types/vocabulary.ts

const Custom = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGermanWord, setNewGermanWord] = useState("");
  const [newEnglishWord, setNewEnglishWord] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showLearningHistoryOnly, setShowLearningHistoryOnly] = useState(false);
  const [draggedWord, setDraggedWord] = useState<CustomWord | null>(null);
  const [droppedWords, setDroppedWords] = useState<CustomWord[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const wordsPerPage = 10;

  const {
    getFilteredAndSortedWords,
    addWord,
    removeWord,
    toggleFavorite,
    filters,
    setFilters,
    sortOption,
    setSortOption,
    sortOrder,
    setSortOrder,
  } = useVocabulary();

  const { toast } = useToast();

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
    if (!newGermanWord.trim() || !newEnglishWord.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both German and English words.",
        variant: "destructive",
      });
      return;
    }

    const newWord: CustomWord = {
      id: Date.now().toString(),
      german: newGermanWord.trim(),
      english: newEnglishWord.trim(),
      categories: [],
      sampleSentence: "",
      dateAdded: new Date(),
      learningHistory: [],
      isFavorite: false,
    };

    addWord(newWord);
    setNewGermanWord("");
    setNewEnglishWord("");
    setShowAddForm(false);

    toast({
      title: "Word added!",
      description: `"${newWord.german}" has been added to your custom vocabulary.`,
    });
  };

  const handleDeleteWord = (id: string) => {
    removeWord(id);
    toast({
      title: "Word removed",
      description: "The word has been removed from your custom vocabulary.",
    });
  };

  const handleWordsExtracted = (extractedWords: ExtractedWord[]) => {
    const newWords: CustomWord[] = extractedWords.map((word) => ({
      id: Date.now().toString() + Math.random(),
      german: word.german,
      english: word.english,
      categories: word.categories || [],
      sampleSentence: "",
      dateAdded: new Date(),
      learningHistory: [],
      isFavorite: false,
    }));

    newWords.forEach((word) => addWord(word));
  };

  const handleWordClick = (wordId: string) => {
    navigate(`/vocabulary/custom/${wordId}`);
  };

  const handleDragStart = (
    word: CustomWord,
    isMultiSelect: boolean = false
  ) => {
    if (isMultiSelect) {
      // For multi-select, store all selected words
      const selectedWordObjects = paginatedWords.filter((w) =>
        selectedWords.has(w.id)
      );
      setDraggedWord({
        ...word,
        isMultiSelect: true,
        selectedWords: selectedWordObjects,
      } as any);
    } else {
      setDraggedWord(word);
    }
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
  };

  const handleDrop = (draggedData: any) => {
    if (draggedData.isMultiSelect && draggedData.selectedWords) {
      // Handle multi-select drop
      const newWords = draggedData.selectedWords.filter(
        (word: CustomWord) => !droppedWords.find((w) => w.id === word.id)
      );
      if (newWords.length > 0) {
        setDroppedWords((prev) => [...prev, ...newWords]);
      }
      setSelectedWords(new Set()); // Clear selection after drop
      setIsMultiSelectMode(false); // Exit multi-select mode
    } else {
      // Handle single word drop
      if (!droppedWords.find((w) => w.id === draggedData.id)) {
        setDroppedWords((prev) => [...prev, draggedData]);
      }
    }
  };

  const handleWordSelection = (wordId: string, ctrlKey: boolean) => {
    if (ctrlKey) {
      // Enter multi-select mode and toggle word selection
      setIsMultiSelectMode(true);
      setSelectedWords((prev) => {
        const newSelection = new Set(prev);
        if (newSelection.has(wordId)) {
          newSelection.delete(wordId);
        } else {
          newSelection.add(wordId);
        }
        return newSelection;
      });
    } else if (isMultiSelectMode) {
      // In multi-select mode, toggle word without Ctrl
      setSelectedWords((prev) => {
        const newSelection = new Set(prev);
        if (newSelection.has(wordId)) {
          newSelection.delete(wordId);
        } else {
          newSelection.add(wordId);
        }
        return newSelection;
      });
    } else {
      // Normal single selection - navigate to word details
      setSelectedWords(new Set()); // Clear any existing selections
      setIsMultiSelectMode(false);
      handleWordClick(wordId);
    }
  };

  const handleRemoveFromDropZone = (wordId: string) => {
    setDroppedWords((prev) => prev.filter((w) => w.id !== wordId));
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
  const paginatedWords = filteredWords.slice(
    (currentPage - 1) * wordsPerPage,
    currentPage * wordsPerPage
  );

  const favoriteWords = filteredWords
    .filter((word) => word.isFavorite)
    .slice(0, 3);
  const allCategories = [
    ...new Set(filteredWords.flatMap((word) => word.categories)),
  ].sort();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Custom Vocabulary</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Word
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Add Custom Word
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="german-word">German Word</Label>
                <Input
                  id="german-word"
                  placeholder="Enter German word"
                  value={newGermanWord}
                  onChange={(e) => setNewGermanWord(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="english-word">English Translation</Label>
                <Input
                  id="english-word"
                  placeholder="Enter English translation"
                  value={newEnglishWord}
                  onChange={(e) => setNewEnglishWord(e.target.value)}
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

      <div className="grid gap-6">
        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* All Words List - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  All Custom Words ({filteredWords.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters and Sorting Controls */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-60">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search words..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {allCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={sortOption}
                      onValueChange={(value) => setSortOption(value as any)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dateAdded">Date Added</SelectItem>
                        <SelectItem value="german">German (A-Z)</SelectItem>
                        <SelectItem value="english">English (A-Z)</SelectItem>
                        <SelectItem value="learningProgress">
                          Learning Progress
                        </SelectItem>
                        <SelectItem value="lastLearning">
                          Last Learning
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={showFavoritesOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    >
                      <Heart
                        className={`mr-2 h-4 w-4 ${
                          showFavoritesOnly ? "fill-current" : ""
                        }`}
                      />
                      Favorites Only
                    </Button>
                    <Button
                      variant={showLearningHistoryOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setShowLearningHistoryOnly(!showLearningHistoryOnly)
                      }
                    >
                      <Target className="mr-2 h-4 w-4" />
                      Has Learning History
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Always visible multi-select area */}
                  <div className="p-3 bg-muted/30 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant={isMultiSelectMode ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newMultiSelectMode = !isMultiSelectMode;
                            setIsMultiSelectMode(newMultiSelectMode);
                            if (!newMultiSelectMode) {
                              // When leaving multi-select mode, clear all selections
                              setSelectedWords(new Set());
                            }
                          }}
                        >
                          Multi-Select Mode
                        </Button>

                        {isMultiSelectMode && (
                          <span className="text-sm text-muted-foreground">
                            Click words to select/deselect •{" "}
                            {selectedWords.size} selected
                          </span>
                        )}
                      </div>

                      {isMultiSelectMode && selectedWords.size > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedWords(new Set())}
                        >
                          Clear Selection
                        </Button>
                      )}
                    </div>
                  </div>

                  {paginatedWords.map((word) => (
                    <div
                      key={word.id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer ${
                        selectedWords.has(word.id)
                          ? "bg-primary/20 border border-primary"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                      draggable
                      onDragStart={() => {
                        if (selectedWords.has(word.id)) {
                          handleDragStart(word, true);
                        } else {
                          handleDragStart(word, false);
                        }
                      }}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => handleWordSelection(word.id, e.ctrlKey)}
                      title={
                        isMultiSelectMode
                          ? "Click to select/deselect"
                          : "Ctrl+Click to start multi-select"
                      }
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">{word.german}</span>
                          <span className="text-muted-foreground">—</span>
                          <span>{word.english}</span>
                          {word.isFavorite && (
                            <Heart className="h-4 w-4 fill-current text-red-500" />
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                          {/* Learning Progress */}
                          <div className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Progress: {calculateSuccessRate(word)}%
                            </span>
                            <Progress
                              value={calculateSuccessRate(word)}
                              className="h-1 w-16"
                            />
                          </div>

                          {/* Last Learning Date */}
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Last:{" "}
                              {word.lastLearningDate
                                ? word.lastLearningDate.toLocaleDateString()
                                : "Never"}
                            </span>
                          </div>

                          {/* Date Added */}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Added: {word.dateAdded.toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {word.categories.map((category, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(word.id);
                          }}
                          className="h-8 w-8"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              word.isFavorite
                                ? "fill-current text-red-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWord(word.id);
                          }}
                          className="h-8 w-8"
                        >
                          <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}

                  {totalPages > 1 && (
                    <Pagination className="mt-6">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exercise Drop Zone - Takes 1 column */}
          <div className="lg:col-span-1">
            <div
              className="w-full"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedWord) {
                  handleDrop(draggedWord);
                }
              }}
            >
              <ExerciseDropZone
                droppedWords={droppedWords}
                onRemoveWord={handleRemoveFromDropZone}
                onClearAll={handleClearDropZone}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                My Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Your starred vocabulary words
              </p>
              <div className="space-y-2">
                {favoriteWords.map((word) => (
                  <div
                    key={word.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleWordClick(word.id)}
                  >
                    <div className="flex-1">
                      <div className="mb-1">
                        <span className="font-medium">{word.german}</span> -{" "}
                        {word.english}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {word.categories.slice(0, 3).map((category, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {category}
                          </Badge>
                        ))}
                        {word.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{word.categories.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWord(word.id);
                        }}
                        className="h-6 w-6"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="h-fit">
            <PhotoWordExtractor onWordsExtracted={handleWordsExtracted} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom;
