
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookPlus, List } from "lucide-react";
import { FlashcardForm, Flashcard } from '@/components/FlashcardForm';
import { FlashcardList } from '@/components/FlashcardList';
import { AnkiExport } from '@/components/AnkiExport';
import { useToast } from '@/hooks/use-toast';

const sampleFlashcards: Flashcard[] = [
  {
    id: 'sample-1',
    german: 'der Hund',
    english: 'dog',
    example: 'Der Hund läuft im Park.',
    category: 'Animals'
  },
  {
    id: 'sample-2',
    german: 'das Haus',
    english: 'house',
    example: 'Das Haus ist sehr groß.',
    category: 'Home'
  },
  {
    id: 'sample-3',
    german: 'essen',
    english: 'to eat',
    example: 'Ich esse gerne Pizza.',
    category: 'Verbs'
  },
  {
    id: 'sample-4',
    german: 'die Schule',
    english: 'school',
    example: 'Die Schule beginnt um acht Uhr.',
    category: 'Education'
  },
  {
    id: 'sample-5',
    german: 'schön',
    english: 'beautiful',
    example: 'Das Wetter ist heute schön.',
    category: 'Adjectives'
  }
];

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAnkiExport, setShowAnkiExport] = useState(false);
  const { toast } = useToast();

  // Load flashcards from localStorage on component mount
  useEffect(() => {
    const savedFlashcards = localStorage.getItem('german-flashcards');
    if (savedFlashcards) {
      try {
        const parsedFlashcards = JSON.parse(savedFlashcards);
        setFlashcards(parsedFlashcards);
      } catch (error) {
        console.error('Error parsing saved flashcards:', error);
        // If there's an error, use sample flashcards
        setFlashcards(sampleFlashcards);
      }
    } else {
      // If no saved flashcards, use sample flashcards
      setFlashcards(sampleFlashcards);
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

  // Get Anki export items
  const getAnkiItems = () => {
    return filteredFlashcards.map(card => ({
      front: `${card.german}${card.example ? `\n\n${card.example}` : ''}`,
      back: card.english,
      tags: ['german-flashcards', card.category.toLowerCase().replace(/\s+/g, '-')]
    }));
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Flashcards</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setShowAnkiExport(!showAnkiExport)} className="w-full sm:w-auto min-h-[48px]">
            Export to Anki
          </Button>
          <Button onClick={handleAddNew} className="w-full sm:w-auto min-h-[48px]">
            <BookPlus className="mr-2 h-4 w-4" />
            Add Flashcard
          </Button>
        </div>
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
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <List className="h-5 w-5" />
                My Flashcards ({filteredFlashcards.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Search flashcards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="min-h-[48px]"
                  />
                </div>
                <div className="w-full sm:w-56">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="min-h-[48px]">
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

          {/* Anki Export Section */}
          {showAnkiExport && (
            <div className="mb-6">
              <AnkiExport 
                items={getAnkiItems()}
                defaultDeckName="German Flashcards"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Flashcards;
