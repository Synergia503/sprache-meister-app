import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLocalization } from '@/contexts/LocalizationContext';

export const InterfaceLanguageSelector = () => {
  const { locale, setLocale, getAvailableLocales, t } = useLocalization();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">{t('settings.interfaceLanguage')}</Label>
          <p className="text-sm text-muted-foreground">
            {t('settings.languageForMenus')}
          </p>
        </div>
        <Select value={locale} onValueChange={setLocale}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {getAvailableLocales().map((language) => (
              <SelectItem key={language.code} value={language.code}>
                {language.nativeName} ({language.name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>
          {t('settings.currentInterface')}: <strong>{getAvailableLocales().find(l => l.code === locale)?.nativeName}</strong>
        </p>
      </div>
    </div>
  );
};