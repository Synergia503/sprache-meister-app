
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenText, Target, PenTool, Shuffle } from "lucide-react";

const All = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Exercises</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenText className="h-5 w-5" />
              Describe a Picture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Practice describing images in German</p>
            <Button variant="outline" className="w-full">Start Exercise</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Grammar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Practice German grammar rules</p>
            <Button variant="outline" className="w-full">Start Exercise</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5" />
              Mixed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Mixed exercises for comprehensive practice</p>
            <Button variant="outline" className="w-full">Start Exercise</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Vocabulary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Vocabulary-focused exercises</p>
            <Button variant="outline" className="w-full">Start Exercise</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default All;
