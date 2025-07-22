import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpenText, Loader2, Image } from "lucide-react";
import { useOpenAI } from '@/hooks/useOpenAI';

const DescribePicture = () => {
  const [scenario, setScenario] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { callOpenAI, isLoading, apiKey } = useOpenAI();

  const generateImageAndScenario = async () => {
    if (!apiKey) {
      return;
    }

    setIsGeneratingImage(true);
    
    try {
      // First, generate a scenario description
      const scenarioPrompt = "Create a detailed description of a scene that would be good for German language practice. Include specific objects, people, actions, and settings that would help students practice German vocabulary. Make it vivid and detailed.";
      const scenarioSystemMessage = "You are a German language teacher creating picture description exercises.";
      
      const scenarioResult = await callOpenAI(scenarioPrompt, scenarioSystemMessage);
      
      if (scenarioResult) {
        setScenario(scenarioResult);
        
        // Now generate an image based on the scenario
        const imagePrompt = `Create a realistic image for German language learning: ${scenarioResult}. The image should be clear, educational, and suitable for language practice.`;
        
        // Call OpenAI DALL-E API for image generation
        const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: imagePrompt,
            n: 1,
            size: '1024x1024',
            quality: 'standard'
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const generatedImageUrl = imageData.data[0].url;
          setImageUrl(generatedImageUrl);
        } else {
          console.error('Image generation failed:', imageResponse.status);
          // Fallback to a placeholder image
          setImageUrl('https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1024&h=1024&fit=crop');
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
      // Fallback to a placeholder image
      setImageUrl('https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1024&h=1024&fit=crop');
    } finally {
      setIsGeneratingImage(false);
      setDescription('');
      setFeedback('');
    }
  };

  const checkDescription = async () => {
    if (!scenario || !description) return;
    
    const prompt = `Picture scenario: ${scenario}\n\nStudent's German description: ${description}\n\nPlease evaluate this German description, check grammar, vocabulary usage, and provide constructive feedback in English.`;
    const systemMessage = "You are a German language teacher providing feedback on picture description exercises.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      setFeedback(result);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Describe a Picture</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenText className="h-5 w-5" />
            Picture Description Exercise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={generateImageAndScenario} 
            disabled={isLoading || isGeneratingImage || !apiKey}
            className="w-full"
          >
            {isLoading || isGeneratingImage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isGeneratingImage ? 'Generating Image...' : 'Generating...'}
              </>
            ) : (
              <>
                <Image className="mr-2 h-4 w-4" />
                Generate New Picture Scenario
              </>
            )}
          </Button>
          
          {imageUrl && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src={imageUrl} 
                  alt="Generated scene for description" 
                  className="max-w-full h-auto rounded-lg border shadow-lg max-h-96"
                />
              </div>
              
              {scenario && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Scene Description:</h3>
                  <div className="whitespace-pre-wrap text-sm">{scenario}</div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Your German Description:</label>
                <Textarea
                  placeholder="Beschreiben Sie das Bild auf Deutsch..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                />
              </div>
              
              <Button 
                onClick={checkDescription} 
                disabled={isLoading || !description.trim()}
                variant="outline"
              >
                Get Feedback
              </Button>
              
              {feedback && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium mb-2 text-green-800">Feedback:</h3>
                  <div className="whitespace-pre-wrap text-green-700">{feedback}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DescribePicture;