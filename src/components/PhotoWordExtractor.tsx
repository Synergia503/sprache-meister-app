
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Image, Loader2, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExtractedWord {
  targetWord: string;
  nativeWord: string;
  categories?: string[];
}

interface PhotoWordExtractorProps {
  onWordsExtracted: (words: ExtractedWord[]) => void;
}

const PhotoWordExtractor = ({ onWordsExtracted }: PhotoWordExtractorProps) => {
  const { t } = useLocalization();
  const { languageSettings } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedWords, setExtractedWords] = useState<ExtractedWord[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [wordCategoryStates, setWordCategoryStates] = useState<{[key: number]: string[]}>({});
  const { toast } = useToast();

  // Simulated target language words that could be extracted from photos with suggested categories
  const sampleTargetLanguageWords = [
    { targetWord: 'der Tisch', nativeWord: 'table', categories: ['furniture', 'home'] },
    { targetWord: 'das Buch', nativeWord: 'book', categories: ['objects', 'education'] },
    { targetWord: 'die Lampe', nativeWord: 'lamp', categories: ['furniture', 'lighting'] },
    { targetWord: 'der Stuhl', nativeWord: 'chair', categories: ['furniture'] },
    { targetWord: 'das Fenster', nativeWord: 'window', categories: ['architecture', 'home'] },
    { targetWord: 'die Tür', nativeWord: 'door', categories: ['architecture', 'home'] },
    { targetWord: 'der Computer', nativeWord: 'computer', categories: ['technology', 'electronics'] },
    { targetWord: 'das Handy', nativeWord: 'mobile phone', categories: ['technology', 'communication'] },
    { targetWord: 'die Brille', nativeWord: 'glasses', categories: ['clothing', 'accessories'] },
    { targetWord: 'der Kaffee', nativeWord: 'coffee', categories: ['food', 'drinks'] },
    { targetWord: 'das Auto', nativeWord: 'car', categories: ['transport', 'vehicles'] },
    { targetWord: 'die Blume', nativeWord: 'flower', categories: ['nature', 'plants'] },
    { targetWord: 'der Hund', nativeWord: 'dog', categories: ['animals', 'pets'] },
    { targetWord: 'die Katze', nativeWord: 'cat', categories: ['animals', 'pets'] },
    { targetWord: 'das Haus', nativeWord: 'house', categories: ['architecture', 'buildings'] }
  ];

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate 5-8 random words
    const numberOfWords = Math.floor(Math.random() * 4) + 5; // 5-8 words
    const shuffled = [...sampleTargetLanguageWords].sort(() => 0.5 - Math.random());
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
      title: t('vocabulary.analysisComplete'),
      description: t('vocabulary.extractedWordsCount', { 
        count: selectedWords.length, 
        language: languageSettings.targetLanguage.nativeName 
      }),
    });
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: t('vocabulary.invalidFileType'),
        description: t('vocabulary.selectImageFile'),
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
      title: t('toast.wordAdded'),
      description: `${extractedWords.length} words have been added to your custom vocabulary.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          {t('vocabulary.extractWordsFromPhoto')}
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
                <p className="text-lg font-medium">{t('vocabulary.dropImageHere')}</p>
                <p className="text-muted-foreground">{t('vocabulary.chooseFromOptions')}</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t('vocabulary.chooseFile')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('camera-input')?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {t('vocabulary.takePhoto')}
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
                    {t('vocabulary.analyzingImage')}
                  </>
                ) : (
                  t('vocabulary.analyzeImage')
                )}
              </Button>
            </div>
          </div>
        )}

        {extractedWords.length > 0 && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-3">{t('vocabulary.extractedWords', { language: languageSettings.targetLanguage.nativeName })}:</h3>
              <div className="grid gap-4">
                {extractedWords.map((word, index) => (
                  <div key={index} className="p-3 bg-background rounded border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{word.targetWord}</span>
                      <span className="text-muted-foreground">{word.nativeWord}</span>
                    </div>
                    
                    {word.categories && word.categories.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{t('vocabulary.suggestedCategories')}:</p>
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
                          {t('vocabulary.clickToSelectCategories')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={addWordsToVocabulary} className="w-full">
              {t('vocabulary.addSelectedWords')}
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
