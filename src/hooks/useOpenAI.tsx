
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai-api-key') || '');
  const { toast } = useToast();

  const saveApiKey = (key: string) => {
    localStorage.setItem('openai-api-key', key);
    setApiKey(key);
  };

  const callOpenAI = async (prompt: string, systemMessage: string = '') => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key first.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      console.log('Calling OpenAI API with prompt:', prompt);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            ...(systemMessage ? [{ role: 'system', content: systemMessage }] : []),
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('OpenAI API response:', data);
      
      return data.choices[0]?.message?.content || 'No response received';
    } catch (error) {
      console.error('OpenAI API error:', error);
      toast({
        title: "API Error",
        description: "Failed to connect to OpenAI. Please check your API key.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callOpenAI,
    isLoading,
    apiKey,
    saveApiKey,
  };
};
