
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Vocabulary = () => {
  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Vocabulary</h1>
        <Button className="w-full sm:w-auto min-h-[48px]">
          <Plus className="mr-2 h-4 w-4" />
          Add Word
        </Button>
      </div>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Basic Words</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-muted-foreground">Common everyday German words</p>
            <div className="mt-3 sm:mt-4 space-y-1">
              <p className="text-sm sm:text-base"><span className="font-medium">Hallo</span> - Hello</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Danke</span> - Thank you</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Bitte</span> - Please</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Phrases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-muted-foreground">Common German phrases</p>
            <div className="mt-3 sm:mt-4 space-y-1">
              <p className="text-sm sm:text-base"><span className="font-medium">Wie geht's?</span> - How are you?</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Guten Tag</span> - Good day</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Auf Wiedersehen</span> - Goodbye</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vocabulary;
