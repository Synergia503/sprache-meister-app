
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

const Flashcards = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Flashcards</h1>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Study with Flashcards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Learn German vocabulary with interactive flashcards</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Flashcards;
