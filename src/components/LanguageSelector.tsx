import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/types/languages";

export const LanguageSelector = () => {
  const {
    languageSettings,
    setTargetLanguage,
    setNativeLanguage,
    swapLanguages,
  } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Language Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="native-language">Native Language</Label>
            <Select
              value={languageSettings.nativeLanguage.code}
              onValueChange={(value) => {
                const language = SUPPORTED_LANGUAGES.find(
                  (lang) => lang.code === value
                );
                if (language) setNativeLanguage(language);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select native language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.nativeName} ({language.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-language">Target Language</Label>
            <Select
              value={languageSettings.targetLanguage.code}
              onValueChange={(value) => {
                const language = SUPPORTED_LANGUAGES.find(
                  (lang) => lang.code === value
                );
                if (language) setTargetLanguage(language);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.nativeName} ({language.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button variant="outline" onClick={swapLanguages} className="w-full">
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          Swap Languages
        </Button>

        <div className="text-sm text-muted-foreground">
          <p>
            Learning:{" "}
            <strong>{languageSettings.targetLanguage.nativeName}</strong>
          </p>
          <p>
            From: <strong>{languageSettings.nativeLanguage.nativeName}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
