
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Merge } from "lucide-react";

const Mixed = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mixed Exercises</h1>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Merge className="h-5 w-5" />
            Combined Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Practice various German language skills</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Mixed;
