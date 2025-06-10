
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";

const Custom = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Custom Vocabulary</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Word
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              My Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Your starred vocabulary words</p>
            <div className="mt-4">
              <p><span className="font-medium">Fernweh</span> - Wanderlust</p>
              <p><span className="font-medium">Gemütlichkeit</span> - Coziness</p>
              <p><span className="font-medium">Verschlimmbessern</span> - To make worse by trying to improve</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Additions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Recently added custom words</p>
            <div className="mt-4">
              <p><span className="font-medium">Schadenfreude</span> - Joy from others' misfortune</p>
              <p><span className="font-medium">Zeitgeist</span> - Spirit of the age</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Custom;
