
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { checkRateLimit, sanitizeInput } from '@/lib/validation';

export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai-api-key') || '');
  const { toast } = useToast();

  const saveApiKey = (key: string) => {
    try {
      const sanitizedKey = sanitizeInput(key);
      localStorage.setItem('openai-api-key', sanitizedKey);
      setApiKey(sanitizedKey);
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Storage Error",
        description: "Failed to save API key to local storage.",
        variant: "destructive",
      });
    }
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

    // Rate limiting check for API calls
    if (!checkRateLimit('openai_api_calls', 10, 60000)) { // 10 calls per minute
      toast({
        title: "Rate Limit Exceeded",
        description: "Too many API calls. Please wait a minute before trying again.",
        variant: "destructive",
      });
      return null;
    }

    // Input validation and sanitization
    if (!prompt || prompt.trim().length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please provide a valid prompt.",
        variant: "destructive",
      });
      return null;
    }

    const sanitizedPrompt = sanitizeInput(prompt);
    const sanitizedSystemMessage = systemMessage ? sanitizeInput(systemMessage) : '';

    if (sanitizedPrompt.length > 4000) {
      toast({
        title: "Input Too Long",
        description: "Please shorten your prompt to under 4000 characters.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      console.log('Calling OpenAI API with prompt length:', sanitizedPrompt.length);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            ...(sanitizedSystemMessage ? [{ role: 'system', content: sanitizedSystemMessage }] : []),
            { role: 'user', content: sanitizedPrompt }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', response.status, errorData);
        
        if (response.status === 401) {
          throw new Error('Invalid API key');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        } else if (response.status === 400) {
          throw new Error('Invalid request');
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('OpenAI API response received successfully');
      
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No response content received');
      }
      
      return content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "API Error",
        description: `Failed to connect to OpenAI: ${errorMessage}`,
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
