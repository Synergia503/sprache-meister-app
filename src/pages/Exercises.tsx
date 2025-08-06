
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenText } from "lucide-react";

const Exercises = () => {
  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Exercises</h1>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BookOpenText className="h-5 w-5" />
              Word Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">Practice German sentence structure</p>
            <Button variant="outline" className="w-full min-h-[48px]">Start Exercise</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BookOpenText className="h-5 w-5" />
              Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">Learn when to use der, die, das</p>
            <Button variant="outline" className="w-full min-h-[48px]">Start Exercise</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Exercises;
