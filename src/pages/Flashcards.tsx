
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookPlus, List } from "lucide-react";
import { FlashcardForm, Flashcard } from '@/components/FlashcardForm';
import { FlashcardList } from '@/components/FlashcardList';
import { useToast } from '@/hooks/use-toast';

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const { toast } = useToast();

  // Load flashcards from localStorage on component mount
  useEffect(() => {
    const savedFlashcards = localStorage.getItem('german-flashcards');
    if (savedFlashcards) {
      try {
        setFlashcards(JSON.parse(savedFlashcards));
      } catch (error) {
        console.error('Error parsing saved flashcards:', error);
      }
    }
  }, []);

  // Save flashcards to localStorage whenever flashcards change
  useEffect(() => {
    localStorage.setItem('german-flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const handleSave = (flashcardData: Omit<Flashcard, 'id'>) => {
    if (editingFlashcard) {
      // Update existing flashcard
      setFlashcards(prev => 
        prev.map(card => 
          card.id === editingFlashcard.id 
            ? { ...flashcardData, id: editingFlashcard.id }
            : card
        )
      );
      toast({
        title: "Flashcard updated",
        description: "Your flashcard has been successfully updated.",
      });
      setEditingFlashcard(undefined);
    } else {
      // Add new flashcard
      const newFlashcard: Flashcard = {
        ...flashcardData,
        id: generateId(),
      };
      setFlashcards(prev => [...prev, newFlashcard]);
      toast({
        title: "Flashcard added",
        description: "Your new flashcard has been added.",
      });
    }
    setShowForm(false);
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
    toast({
      title: "Flashcard deleted",
      description: "The flashcard has been removed.",
      variant: "destructive",
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFlashcard(undefined);
  };

  const handleAddNew = () => {
    setEditingFlashcard(undefined);
    setShowForm(true);
  };

  // Filter flashcards based on search term and category
  const filteredFlashcards = flashcards.filter(flashcard => {
    const matchesSearch = 
      flashcard.german.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flashcard.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flashcard.example.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || flashcard.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(flashcards.map(card => card.category))).sort();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <Button onClick={handleAddNew}>
          <BookPlus className="mr-2 h-4 w-4" />
          Add Flashcard
        </Button>
      </div>

      {showForm ? (
        <div className="mb-6">
          <FlashcardForm
            flashcard={editingFlashcard}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <>
          {/* Search and Filter Controls */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                My Flashcards ({filteredFlashcards.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search flashcards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-48">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <FlashcardList
                flashcards={filteredFlashcards}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Flashcards;
