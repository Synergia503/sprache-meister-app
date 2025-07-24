
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenText } from "lucide-react";

const Exercises = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Exercises</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenText className="h-5 w-5" />
              Word Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Practice German sentence structure</p>
            <Button variant="outline" className="w-full">Start Exercise</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenText className="h-5 w-5" />
              Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Learn when to use der, die, das</p>
            <Button variant="outline" className="w-full">Start Exercise</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Exercises;
