
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenText, Target } from "lucide-react";

const Exercises = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Vocabulary Exercises</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenText className="h-5 w-5" />
              Word Matching
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Match German words with their English translations</p>
            <Button variant="outline" className="w-full">Start Exercise</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Fill in the Blanks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Complete sentences with the correct vocabulary</p>
            <Button variant="outline" className="w-full">Start Exercise</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenText className="h-5 w-5" />
              Multiple Choice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Choose the correct translation from options</p>
            <Button variant="outline" className="w-full">Start Exercise</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Exercises;
