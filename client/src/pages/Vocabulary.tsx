
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Vocabulary = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vocabulary</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Word
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Basic Words</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Common everyday German words</p>
            <div className="mt-4">
              <p><span className="font-medium">Hallo</span> - Hello</p>
              <p><span className="font-medium">Danke</span> - Thank you</p>
              <p><span className="font-medium">Bitte</span> - Please</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Phrases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Common German phrases</p>
            <div className="mt-4">
              <p><span className="font-medium">Wie geht's?</span> - How are you?</p>
              <p><span className="font-medium">Guten Tag</span> - Good day</p>
              <p><span className="font-medium">Auf Wiedersehen</span> - Goodbye</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vocabulary;
