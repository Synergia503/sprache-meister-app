
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Image, Loader2, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface ExtractedWord {
  german: string;
  english: string;
  categories?: string[];
}

interface PhotoWordExtractorProps {
  onWordsExtracted: (words: ExtractedWord[]) => void;
}

const PhotoWordExtractor = ({ onWordsExtracted }: PhotoWordExtractorProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedWords, setExtractedWords] = useState<ExtractedWord[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [wordCategoryStates, setWordCategoryStates] = useState<{[key: number]: string[]}>({});
  const { toast } = useToast();

  // Simulated German words that could be extracted from photos with suggested categories
  const sampleGermanWords = [
    { german: 'der Tisch', english: 'table', categories: ['furniture', 'home'] },
    { german: 'das Buch', english: 'book', categories: ['objects', 'education'] },
    { german: 'die Lampe', english: 'lamp', categories: ['furniture', 'lighting'] },
    { german: 'der Stuhl', english: 'chair', categories: ['furniture'] },
    { german: 'das Fenster', english: 'window', categories: ['architecture', 'home'] },
    { german: 'die Tür', english: 'door', categories: ['architecture', 'home'] },
    { german: 'der Computer', english: 'computer', categories: ['technology', 'electronics'] },
    { german: 'das Handy', english: 'mobile phone', categories: ['technology', 'communication'] },
    { german: 'die Brille', english: 'glasses', categories: ['clothing', 'accessories'] },
    { german: 'der Kaffee', english: 'coffee', categories: ['food', 'drinks'] },
    { german: 'das Auto', english: 'car', categories: ['transport', 'vehicles'] },
    { german: 'die Blume', english: 'flower', categories: ['nature', 'plants'] },
    { german: 'der Hund', english: 'dog', categories: ['animals', 'pets'] },
    { german: 'die Katze', english: 'cat', categories: ['animals', 'pets'] },
    { german: 'das Haus', english: 'house', categories: ['architecture', 'buildings'] }
  ];

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate 5-8 random words
    const numberOfWords = Math.floor(Math.random() * 4) + 5; // 5-8 words
    const shuffled = [...sampleGermanWords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, numberOfWords);
    
    setExtractedWords(selectedWords);
    
    // Initialize category states for each word
    const initialCategoryStates: {[key: number]: string[]} = {};
    selectedWords.forEach((word, index) => {
      initialCategoryStates[index] = [...(word.categories || [])];
    });
    setWordCategoryStates(initialCategoryStates);
    
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis complete!",
      description: `Extracted ${selectedWords.length} German words with suggested categories.`,
    });
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setExtractedWords([]);
    setWordCategoryStates({});
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExtractedWords([]);
    setWordCategoryStates({});
  };

  const toggleCategory = (wordIndex: number, category: string) => {
    setWordCategoryStates(prev => {
      const currentCategories = prev[wordIndex] || [];
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter(c => c !== category)
        : [...currentCategories, category];
      
      return {
        ...prev,
        [wordIndex]: newCategories
      };
    });
  };

  const addWordsToVocabulary = () => {
    const wordsWithSelectedCategories = extractedWords.map((word, index) => ({
      ...word,
      categories: wordCategoryStates[index] || []
    }));
    
    onWordsExtracted(wordsWithSelectedCategories);
    toast({
      title: "Words added!",
      description: `${extractedWords.length} words have been added to your custom vocabulary.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Extract Words from Photo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!imagePreview ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">Drop your image here</p>
                <p className="text-muted-foreground">or choose from the options below</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('camera-input')?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Selected"
                className="w-full max-h-64 object-contain rounded-lg border"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={simulateAnalysis}
                disabled={isAnalyzing}
                className="flex-1 min-w-0"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  'Analyze Image'
                )}
              </Button>
            </div>
          </div>
        )}

        {extractedWords.length > 0 && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-3">Extracted German Words with Suggested Categories:</h3>
              <div className="grid gap-4">
                {extractedWords.map((word, index) => (
                  <div key={index} className="p-3 bg-background rounded border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{word.german}</span>
                      <span className="text-muted-foreground">{word.english}</span>
                    </div>
                    
                    {word.categories && word.categories.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Suggested categories:</p>
                        <div className="flex flex-wrap gap-2">
                          {word.categories.map((category, catIndex) => (
                            <Button
                              key={catIndex}
                              variant={wordCategoryStates[index]?.includes(category) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleCategory(index, category)}
                              className="text-xs h-6"
                            >
                              {category}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Click to select/deselect categories for this word
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={addWordsToVocabulary} className="w-full">
              Add Selected Words with Categories to Vocabulary
            </Button>
          </div>
        )}

        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <input
          id="camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default PhotoWordExtractor;
