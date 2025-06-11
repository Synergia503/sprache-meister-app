
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApiKeyInputProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyInput = ({ apiKey, onSaveApiKey }: ApiKeyInputProps) => {
  const [inputKey, setInputKey] = useState(apiKey);

  const handleSave = () => {
    onSaveApiKey(inputKey);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>OpenAI API Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your OpenAI API key"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
          />
        </div>
        <Button onClick={handleSave}>Save API Key</Button>
      </CardContent>
    </Card>
  );
};
