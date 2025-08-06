
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { LogOut } from "lucide-react";

const Index = () => {
  const { user, logout } = useAuth();
  const { languageSettings } = useLanguage();
  const { t } = useLocalization();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4 lg:p-6">
      <div className="text-center max-w-2xl space-y-4 sm:space-y-6 w-full">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex flex-col items-start justify-between gap-3 sm:gap-4 text-lg sm:text-xl">
              <span className="text-left w-full">{t('dashboard.welcomeUser', { name: user?.firstName || '' })}</span>
              <Button 
                variant="outline" 
                size="default"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full sm:w-auto min-h-[48px]"
              >
                <LogOut className="h-4 w-4" />
                {t('welcome.logout')}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-left text-sm sm:text-base">
              {t('welcome.loggedInAs')}: {user?.email}
            </p>
          </CardContent>
        </Card>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
          {t('welcome.title', { language: languageSettings.targetLanguage.nativeName })}
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground px-2">
          {t('welcome.subtitle', { language: languageSettings.targetLanguage.nativeName })} {t('welcome.navigation')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8 px-2">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">{t('welcome.currentPath')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {languageSettings.nativeLanguage.nativeName} → {languageSettings.targetLanguage.nativeName}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">{t('welcome.quickStart')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t('welcome.sidebarAccess')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
