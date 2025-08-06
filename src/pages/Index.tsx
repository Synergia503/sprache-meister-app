
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="text-center max-w-2xl space-y-6 w-full">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-left sm:text-center">{t('dashboard.welcomeUser', { name: user?.firstName || '' })}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4" />
                {t('welcome.logout')}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-left sm:text-center">
              {t('welcome.loggedInAs')}: {user?.email}
            </p>
          </CardContent>
        </Card>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          {t('welcome.title', { language: languageSettings.targetLanguage.nativeName })}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          {t('welcome.subtitle', { language: languageSettings.targetLanguage.nativeName })} {t('welcome.navigation')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">{t('welcome.currentPath')}</h3>
              <p className="text-sm text-muted-foreground">
                {languageSettings.nativeLanguage.nativeName} → {languageSettings.targetLanguage.nativeName}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">{t('welcome.quickStart')}</h3>
              <p className="text-sm text-muted-foreground">
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
