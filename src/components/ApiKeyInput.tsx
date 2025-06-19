
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiKeySchema, checkRateLimit, sanitizeInput } from '@/lib/validation';
import type { z } from 'zod';

interface ApiKeyInputProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

type ApiKeyFormData = {
  apiKey: string;
};

const apiKeyFormSchema = z.object({
  apiKey: apiKeySchema
});

export const ApiKeyInput = ({ apiKey, onSaveApiKey }: ApiKeyInputProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      apiKey: apiKey
    }
  });

  const onSubmit = async (data: ApiKeyFormData) => {
    // Rate limiting check
    if (!checkRateLimit('api_key_save', 10, 60000)) { // 10 saves per minute
      toast({
        title: "Too many attempts",
        description: "Please wait before saving the API key again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Sanitize and validate the API key
      const sanitizedKey = sanitizeInput(data.apiKey);
      
      onSaveApiKey(sanitizedKey);
      
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved securely.",
      });
    } catch (error) {
      console.error('API key save error:', error);
      toast({
        title: "Save Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>OpenAI API Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your API key is stored locally in your browser and never sent to our servers.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              {...register('apiKey')}
              aria-invalid={errors.apiKey ? 'true' : 'false'}
            />
            {errors.apiKey && (
              <p className="text-sm text-destructive" role="alert">
                {errors.apiKey.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter your OpenAI API key starting with "sk-"
            </p>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save API Key'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
