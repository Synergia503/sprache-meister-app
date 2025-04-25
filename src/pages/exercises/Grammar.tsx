
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";

const Grammar = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Grammar Exercises</h1>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Grammar Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Improve your German grammar skills</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Grammar;
