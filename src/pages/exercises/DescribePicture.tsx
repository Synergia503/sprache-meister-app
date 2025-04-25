
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";

const DescribePicture = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Describe a Picture</h1>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Picture Description Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Practice describing images in German</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DescribePicture;
