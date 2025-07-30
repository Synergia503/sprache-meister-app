import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, SUPPORTED_LANGUAGES, getLanguageByCode } from '@/types/languages';

interface LanguageSettings {
  targetLanguage: Language;
  nativeLanguage: Language;
}

interface LanguageContextType {
  languageSettings: LanguageSettings;
  setTargetLanguage: (language: Language) => void;
  setNativeLanguage: (language: Language) => void;
  swapLanguages: () => void;
  getLanguageDirection: () => 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const defaultSettings: LanguageSettings = {
  targetLanguage: getLanguageByCode('de') || SUPPORTED_LANGUAGES[1], // German
  nativeLanguage: getLanguageByCode('en') || SUPPORTED_LANGUAGES[0], // English
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [languageSettings, setLanguageSettings] = useState<LanguageSettings>(() => {
    const saved = localStorage.getItem('language-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const setTargetLanguage = (language: Language) => {
    const newSettings = { ...languageSettings, targetLanguage: language };
    setLanguageSettings(newSettings);
    localStorage.setItem('language-settings', JSON.stringify(newSettings));
  };

  const setNativeLanguage = (language: Language) => {
    const newSettings = { ...languageSettings, nativeLanguage: language };
    setLanguageSettings(newSettings);
    localStorage.setItem('language-settings', JSON.stringify(newSettings));
  };

  const swapLanguages = () => {
    const newSettings = {
      targetLanguage: languageSettings.nativeLanguage,
      nativeLanguage: languageSettings.targetLanguage,
    };
    setLanguageSettings(newSettings);
    localStorage.setItem('language-settings', JSON.stringify(newSettings));
  };

  const getLanguageDirection = (): 'ltr' | 'rtl' => {
    // Add RTL languages as needed
    const rtlLanguages = ['ar', 'he', 'fa'];
    return rtlLanguages.includes(languageSettings.targetLanguage.code) ? 'rtl' : 'ltr';
  };

  return (
    <LanguageContext.Provider
      value={{
        languageSettings,
        setTargetLanguage,
        setNativeLanguage,
        swapLanguages,
        getLanguageDirection,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};