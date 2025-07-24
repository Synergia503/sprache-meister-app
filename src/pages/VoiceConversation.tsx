
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from "lucide-react";

const VoiceConversation = () => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Voice Conversation</h1>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Practice Speaking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Improve your German pronunciation and conversation skills</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceConversation;
