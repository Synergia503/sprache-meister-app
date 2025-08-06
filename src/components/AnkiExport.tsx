
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Loader2, Plus } from 'lucide-react';
import { ankiConnect } from '@/utils/ankiConnect';
import { useToast } from '@/hooks/use-toast';

interface AnkiExportProps {
  items: Array<{
    front: string;
    back: string;
    tags?: string[];
  }>;
  defaultDeckName?: string;
}

export const AnkiExport = ({ items, defaultDeckName = 'German Learning' }: AnkiExportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [decks, setDecks] = useState<string[]>([]);
  const [selectedDeck, setSelectedDeck] = useState(defaultDeckName);
  const [newDeckName, setNewDeckName] = useState('');
  const [showNewDeck, setShowNewDeck] = useState(false);
  const { toast } = useToast();

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await ankiConnect.isConnected();
      setIsConnected(connected);
      
      if (connected) {
        const deckNames = await ankiConnect.getDeckNames();
        setDecks(deckNames);
        toast({
          title: "Connected to Anki",
          description: "Successfully connected to AnkiConnect",
        });
      } else {
        toast({
          title: "Connection failed",
          description: "Could not connect to AnkiConnect. Make sure Anki is running with AnkiConnect addon installed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnected(false);
      toast({
        title: "Connection error",
        description: "Failed to connect to AnkiConnect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDeck = async () => {
    if (!newDeckName.trim()) return;
    
    setIsLoading(true);
    try {
      await ankiConnect.createDeck(newDeckName);
      const updatedDecks = await ankiConnect.getDeckNames();
      setDecks(updatedDecks);
      setSelectedDeck(newDeckName);
      setNewDeckName('');
      setShowNewDeck(false);
      toast({
        title: "Deck created",
        description: `Created deck "${newDeckName}"`,
      });
    } catch (error) {
      console.error('Create deck error:', error);
      toast({
        title: "Error creating deck",
        description: "Failed to create new deck",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToAnki = async () => {
    if (!selectedDeck || items.length === 0) return;
    
    setIsLoading(true);
    try {
      await ankiConnect.addNotes(selectedDeck, items);
      toast({
        title: "Export successful",
        description: `Exported ${items.length} cards to "${selectedDeck}"`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export cards to Anki",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <p className="text-sm sm:text-base text-muted-foreground text-center">No items available for export</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Download className="h-5 w-5" />
          Export to Anki ({items.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {isConnected === null && (
          <Button onClick={checkConnection} disabled={isLoading} className="w-full min-h-[48px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect to Anki'
            )}
          </Button>
        )}

        {isConnected === false && (
          <div className="text-sm sm:text-base text-muted-foreground space-y-2">
            <p>Could not connect to AnkiConnect.</p>
            <p>Make sure:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Anki is running</li>
              <li>AnkiConnect addon is installed</li>
              <li>AnkiConnect is enabled</li>
            </ul>
            <Button onClick={checkConnection} className="mt-3 w-full sm:w-auto min-h-[48px]">
              Try Again
            </Button>
          </div>
        )}

        {isConnected === true && (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="deck-select" className="text-sm font-medium">Select Deck</Label>
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <Select value={selectedDeck} onValueChange={setSelectedDeck}>
                  <SelectTrigger className="flex-1 min-w-0 min-h-[48px]">
                    <SelectValue placeholder="Select a deck" />
                  </SelectTrigger>
                  <SelectContent>
                    {decks.map((deck) => (
                      <SelectItem key={deck} value={deck}>
                        {deck}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto min-h-[48px] px-4"
                  onClick={() => setShowNewDeck(!showNewDeck)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showNewDeck && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="New deck name"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  className="min-h-[48px]"
                />
                <Button onClick={createDeck} disabled={!newDeckName.trim()} className="w-full sm:w-auto min-h-[48px]">
                  Create
                </Button>
              </div>
            )}

            <Button 
              onClick={exportToAnki} 
              disabled={!selectedDeck || isLoading}
              className="w-full min-h-[48px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export to Anki
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
