import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Edit, Save, X, Plus, Trash2, Target, Clock, Heart } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { CustomWord } from '@/types/vocabulary';

// Interfaces moved to types/vocabulary.ts

const WordDetails = () => {
  const { wordId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getWordById, updateWord, toggleFavorite } = useVocabulary();
  
  const [word, setWord] = useState<CustomWord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    german: '',
    english: '',
    categories: [] as string[],
    sampleSentence: ''
  });
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const foundWord = getWordById(wordId || '');
    if (foundWord) {
      setWord(foundWord);
      setEditForm({
        german: foundWord.german,
        english: foundWord.english,
        categories: [...foundWord.categories],
        sampleSentence: foundWord.sampleSentence
      });
    }
  }, [wordId, getWordById]);

  const calculateSuccessRate = () => {
    if (!word?.learningHistory.length) return 0;
    const successCount = word.learningHistory.filter(h => h.success).length;
    return Math.round((successCount / word.learningHistory.length) * 100);
  };

  const handleSave = () => {
    if (!word) return;
    
    // Update word with edit form data
    const updatedWord = {
      ...word,
      german: editForm.german,
      english: editForm.english,
      categories: editForm.categories,
      sampleSentence: editForm.sampleSentence
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
      setEditForm(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
    }
    setNewCategory('');
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryToRemove)
    }));
  };

  const exerciseTypeLabels = {
    'translation': 'Translation',
    'multiple-choice': 'Multiple Choice',
    'matching': 'Matching',
    'gap-fill': 'Gap Fill'
  };

  if (!word) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/vocabulary/custom')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vocabulary
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Word not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate('/vocabulary/custom')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vocabulary
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => toggleFavorite(word.id)}
          >
            <Heart className={`mr-2 h-4 w-4 ${word.isFavorite ? 'fill-current text-red-500' : ''}`} />
            {word.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            variant={isEditing ? "default" : "outline"}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Word
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Word Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="german">German Word</Label>
                    <Input
                      id="german"
                      value={editForm.german}
                      onChange={(e) => setEditForm(prev => ({ ...prev, german: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="english">English Translation</Label>
                    <Input
                      id="english"
                      value={editForm.english}
                      onChange={(e) => setEditForm(prev => ({ ...prev, english: e.target.value }))}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="font-bold text-primary">{word.german}</span>
                  <span className="text-muted-foreground">—</span>
                  <span>{word.english}</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Categories */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Categories</Label>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {editForm.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {category}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleRemoveCategory(category)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  {editForm.categories.length < 5 && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                        className="flex-1"
                      />
                      <Button onClick={handleAddCategory} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {word.categories.map((category, index) => (
                    <Badge key={index} variant="secondary">{category}</Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Sample Sentence */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Sample Sentence</Label>
              {isEditing ? (
                <Textarea
                  value={editForm.sampleSentence}
                  onChange={(e) => setEditForm(prev => ({ ...prev, sampleSentence: e.target.value }))}
                  placeholder="Enter a sample sentence in German"
                  className="min-h-20"
                />
              ) : (
                <p className="text-muted-foreground italic">
                  {word.sampleSentence || "No sample sentence available."}
                </p>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Added on {word.dateAdded.toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Success Rate</span>
                  <span className="text-sm text-muted-foreground">
                    {calculateSuccessRate()}% ({word.learningHistory.filter(h => h.success).length}/{word.learningHistory.length})
                  </span>
                </div>
                <Progress value={calculateSuccessRate()} className="h-2" />
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Exercise History
                </h4>
                <div className="space-y-2">
                  {word.learningHistory.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No exercises completed yet.</p>
                  ) : (
                    word.learningHistory.map((history, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-3">
                          <Badge variant={history.success ? "default" : "destructive"}>
                            {history.success ? "✓" : "✗"}
                          </Badge>
                          <span className="text-sm">{exerciseTypeLabels[history.exerciseType]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{history.timeSpent}s</span>
                          <span>{history.date.toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default WordDetails;