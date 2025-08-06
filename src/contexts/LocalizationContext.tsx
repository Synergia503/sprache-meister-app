import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SupportedLocale = 'en' | 'de' | 'es' | 'fr' | 'it' | 'pt' | 'ru' | 'ja' | 'ko' | 'zh' | 'ar' | 'hi' | 'pl';

interface LocalizationContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getAvailableLocales: () => Array<{ code: SupportedLocale; name: string; nativeName: string }>;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

// Translation keys and their values for each language
const translations: Record<SupportedLocale, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.vocabulary': 'Vocabulary',
    'nav.vocabulary.categorized': 'Categorized',
    'nav.vocabulary.custom': 'Custom',
    'nav.exercises': 'Exercises',
    'nav.exercises.all': 'All',
    'nav.exercises.gapFill': 'Gap-Fill',
    'nav.exercises.multipleChoice': 'Multiple Choice',
    'nav.exercises.translation': 'Translation',
    'nav.exercises.matching': 'Matching',
    'nav.exercises.wordFormation': 'Word Formation',
    'nav.exercises.oppositeMeaning': 'Opposite Meaning',
    'nav.exercises.sameMeaning': 'Same Meaning',
    'nav.exercises.wordDefinition': 'Word Definition',
    'nav.exercises.describePicture': 'Describe a Picture',
    'nav.exercises.grammar': 'Grammar',
    'nav.exercises.mixed': 'Mixed',
    'nav.flashcards': 'Flashcards',
    'nav.voiceConversation': 'Voice Conversation',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',

    // Common actions
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.selectAll': 'Select All',
    'common.deselectAll': 'Deselect All',
    'common.generate': 'Generate',
    'common.start': 'Start',
    'common.restart': 'Restart',
    'common.continue': 'Continue',
    'common.finish': 'Finish',
    'common.submit': 'Submit',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',

    // Authentication
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.welcomeBack': 'Welcome Back',
    'auth.signInToAccount': 'Sign in to your account',
    'auth.createAccount': 'Create Account',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.signIn': 'Sign in',
    'auth.signUp': 'Sign up',
    'auth.demoCredentials': 'Demo credentials',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPassword': 'Enter your password',
    'auth.signingIn': 'Signing In...',
    'auth.loggedInAs': 'Logged in as',

    // Dashboard
    'dashboard.welcome': 'Welcome to {language} Learning',
    'dashboard.welcomeUser': 'Welcome, {name}!',
    'dashboard.startJourney': 'Start your journey to master the {language} language with our comprehensive learning tools.',
    'dashboard.navigateUsingSidebar': 'Navigate through different sections using the sidebar menu.',
    'dashboard.totalWords': 'Total Words',
    'dashboard.favoriteWords': 'Favorite Words',
    'dashboard.wordsPracticed': 'Words Practiced',
    'dashboard.successRate': 'Success Rate',
    'dashboard.learningProgress': 'Learning Progress',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.addNewWords': 'Add New Words',
    'dashboard.expandVocabulary': 'Expand your vocabulary',
    'dashboard.startExercise': 'Start Exercise',
    'dashboard.practiceWhatLearned': 'Practice what you\'ve learned',
    'dashboard.viewProgress': 'View Progress',
    'dashboard.trackImprovement': 'Track your improvement',
    'dashboard.currentLearningPath': 'Current Learning Path',
    'dashboard.quickStart': 'Quick Start',
    'dashboard.useSidebarToAccess': 'Use the sidebar to access vocabulary, exercises, and flashcards.',
    'dashboard.learningProgressOverview': 'Your {language} learning progress overview',
    'dashboard.vocabularyWords': '{language} vocabulary words',
    'dashboard.wordsMarkedFavorite': 'Words marked as favorite',
    'dashboard.wordsWithHistory': 'Words with learning history',
    'dashboard.averageSuccessRate': 'Average exercise success rate',

    // Vocabulary
    'vocabulary.title': 'Vocabulary',
    'vocabulary.custom': 'Custom Vocabulary',
    'vocabulary.categorized': 'Categorized Vocabulary',
    'vocabulary.managePersonalCollection': 'Manage your personal vocabulary collection',
    'vocabulary.addWord': 'Add Word',
    'vocabulary.addNewWord': 'Add New Word',
    'vocabulary.targetWord': '{language} Word',
    'vocabulary.nativeWord': '{language} Translation',
    'vocabulary.categories': 'Categories',
    'vocabulary.sampleSentence': 'Sample Sentence',
    'vocabulary.searchWords': 'Search words...',
    'vocabulary.allCategories': 'All categories',
    'vocabulary.sortBy': 'Sort by',
    'vocabulary.dateAdded': 'Date Added',
    'vocabulary.learningProgress': 'Learning Progress',
    'vocabulary.lastLearned': 'Last Learned',
    'vocabulary.successRate': 'Success: {rate}%',
    'vocabulary.exercisesCount': '{count} exercises',
    'vocabulary.noSampleSentence': 'No sample sentence provided',
    'vocabulary.enterTargetWord': 'Enter {language} word',
    'vocabulary.enterNativeWord': 'Enter {language} translation',

    // Exercises
    'exercises.title': 'Exercises',
    'exercises.allExercises': 'All Exercises',
    'exercises.gapFill': 'Gap-Fill',
    'exercises.gapFillDesc': 'Fill in the blanks with correct words',
    'exercises.multipleChoice': 'Multiple Choice',
    'exercises.multipleChoiceDesc': 'Choose the correct answer from multiple options',
    'exercises.translation': 'Translation',
    'exercises.translationDesc': 'Translate between languages',
    'exercises.matching': 'Matching',
    'exercises.matchingDesc': 'Match words with their translations',
    'exercises.wordFormation': 'Word Formation',
    'exercises.wordFormationDesc': 'Practice creating words with prefixes and suffixes',
    'exercises.oppositeMeaning': 'Opposite Meaning',
    'exercises.oppositeMeaningDesc': 'Find words with opposite meanings (antonyms)',
    'exercises.sameMeaning': 'Same Meaning',
    'exercises.sameMeaningDesc': 'Find words with similar meanings (synonyms)',
    'exercises.wordDefinition': 'Word Definition',
    'exercises.wordDefinitionDesc': 'Write the word that matches the given definition',
    'exercises.describePicture': 'Describe a Picture',
    'exercises.describePictureDesc': 'Practice describing images',
    'exercises.grammar': 'Grammar',
    'exercises.grammarDesc': 'Practice grammar rules',
    'exercises.mixed': 'Mixed',
    'exercises.mixedDesc': 'Mixed exercises for comprehensive practice',
    'exercises.startExercise': 'Start Exercise',
    'exercises.checkAnswers': 'Check Answers',
    'exercises.showHint': 'Show Hint',
    'exercises.hideHint': 'Hide Hint',
    'exercises.correctAnswer': 'Correct answer:',
    'exercises.yourAnswer': 'Your answer',
    'exercises.hint': 'Hint:',
    'exercises.explanation': 'Explanation:',
    'exercises.newExercise': 'New Exercise',
    'exercises.restartExercise': 'Restart Same Exercise',
    'exercises.practiceMistakes': 'Practice Mistakes',

    // Exercise specific
    'exercises.gapFill.title': '{language} Gap-Fill Exercise',
    'exercises.gapFill.instructions': 'Fill in the blanks with the correct words.',
    'exercises.multipleChoice.title': '{language} Multiple Choice Exercise',
    'exercises.multipleChoice.instructions': 'Choose the correct answer for each question.',
    'exercises.translation.title': '{language} to {nativeLanguage} Translation',
    'exercises.translation.instructions': 'Translate the following sentences.',
    'exercises.matching.title': '{language} - {nativeLanguage} Matching',
    'exercises.matching.instructions': 'Match words with their translations.',
    'exercises.wordFormation.title': '{language} Word Formation Exercise',
    'exercises.wordFormation.instructions': 'Create new words using prefixes and suffixes',
    'exercises.oppositeMeaning.title': '{language} Opposite Meaning Exercise',
    'exercises.oppositeMeaning.instructions': 'Find the opposite meaning (antonym) for each word',
    'exercises.sameMeaning.title': '{language} Same Meaning Exercise',
    'exercises.sameMeaning.instructions': 'Find words with the same meaning (synonym) for each word',
    'exercises.wordDefinition.title': 'Word Definition Exercise',
    'exercises.wordDefinition.instructions': 'Write the word that matches each definition',

    // Vocabulary Selector
    'vocabularySelector.useExistingVocabulary': 'Use Existing Vocabulary',
    'vocabularySelector.selectCategory': 'Select a category from your vocabulary to practice with.',
    'vocabularySelector.selectCategoryPlaceholder': 'Select a category',
    'vocabularySelector.useSelectedCategory': 'Use Selected Category',
    'vocabularySelector.wordsCount': '{count} words',

    // Word Input Form
    'wordInputForm.createNewExercise': 'Create New {exerciseType} Exercise',
    'wordInputForm.addWords': 'Add up to 20 {language} words or phrases.',
    'wordInputForm.addWord': 'Add Word',
    'wordInputForm.generateExercise': 'Generate Exercise',

    // Settings
    'settings.title': 'Settings',
    'settings.languageSettings': 'Language Settings',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy & Security',
    'settings.interfaceLanguage': 'Interface Language',
    'settings.languageForMenus': 'Language for menus and buttons',
    'settings.theme': 'Theme',
    'settings.chooseTheme': 'Choose your preferred theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',

    // Profile
    'profile.title': 'Profile Settings',
    'profile.personalInfo': 'Personal Information',
    'profile.profilePicture': 'Profile Picture',
    'profile.clickCameraToChange': 'Click the camera icon to change your picture',
    'profile.phone': 'Phone',
    'profile.location': 'Location',
    'profile.dateOfBirth': 'Date of Birth',
    'profile.saveChanges': 'Save Changes',

    // Toasts and messages
    'toast.exerciseGenerated': 'Exercise Generated',
    'toast.exerciseStarted': 'Exercise started!',
    'toast.exerciseCompleted': 'Exercise completed!',
    'toast.wordAdded': 'Word added!',
    'toast.wordDeleted': 'Word deleted',
    'toast.apiKeyRequired': 'API Key Required',
    'toast.configureApiKey': 'Please configure your OpenAI API key in settings.',
    'toast.noWordsFound': 'No words found',
    'toast.categoryHasNoWords': 'This category has no words. Please add some words first.',
    'toast.exerciseLoadedFromCategory': 'Using vocabulary from {category}',

    // Errors
    'error.missingInformation': 'Missing information',
    'error.fillBothWords': 'Please fill in both {targetLanguage} and {nativeLanguage} words.',
    'error.noWordsProvided': 'No words provided',
    'error.addAtLeastOneWord': 'Please add at least one word to generate an exercise.',

    // Settings
    'settings.currentInterface': 'Current interface',
  },

  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.dashboard': 'Dashboard',
    'nav.vocabulary': 'Vokabular',
    'nav.vocabulary.categorized': 'Kategorisiert',
    'nav.vocabulary.custom': 'Benutzerdefiniert',
    'nav.exercises': 'Übungen',
    'nav.exercises.all': 'Alle',
    'nav.exercises.gapFill': 'Lückentext',
    'nav.exercises.multipleChoice': 'Multiple Choice',
    'nav.exercises.translation': 'Übersetzung',
    'nav.exercises.matching': 'Zuordnung',
    'nav.exercises.wordFormation': 'Wortbildung',
    'nav.exercises.oppositeMeaning': 'Gegenteil',
    'nav.exercises.sameMeaning': 'Gleiche Bedeutung',
    'nav.exercises.wordDefinition': 'Wortdefinition',
    'nav.exercises.describePicture': 'Bild beschreiben',
    'nav.exercises.grammar': 'Grammatik',
    'nav.exercises.mixed': 'Gemischt',
    'nav.flashcards': 'Karteikarten',
    'nav.voiceConversation': 'Sprachkonversation',
    'nav.profile': 'Profil',
    'nav.settings': 'Einstellungen',

    // Common actions
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.add': 'Hinzufügen',
    'common.remove': 'Entfernen',
    'common.close': 'Schließen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.loading': 'Lädt...',
    'common.search': 'Suchen',
    'common.filter': 'Filter',
    'common.sort': 'Sortieren',
    'common.selectAll': 'Alle auswählen',
    'common.deselectAll': 'Alle abwählen',
    'common.generate': 'Generieren',
    'common.start': 'Starten',
    'common.restart': 'Neu starten',
    'common.continue': 'Fortfahren',
    'common.finish': 'Beenden',
    'common.submit': 'Absenden',
    'common.confirm': 'Bestätigen',
    'common.yes': 'Ja',
    'common.no': 'Nein',

    // Authentication
    'auth.login': 'Anmelden',
    'auth.logout': 'Abmelden',
    'auth.register': 'Registrieren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort bestätigen',
    'auth.firstName': 'Vorname',
    'auth.lastName': 'Nachname',
    'auth.rememberMe': 'Angemeldet bleiben',
    'auth.forgotPassword': 'Passwort vergessen?',
    'auth.welcomeBack': 'Willkommen zurück',
    'auth.signInToAccount': 'Melden Sie sich in Ihrem Konto an',
    'auth.createAccount': 'Konto erstellen',
    'auth.alreadyHaveAccount': 'Haben Sie bereits ein Konto?',
    'auth.dontHaveAccount': 'Haben Sie noch kein Konto?',
    'auth.signIn': 'Anmelden',
    'auth.signUp': 'Registrieren',
    'auth.demoCredentials': 'Demo-Anmeldedaten',
    'auth.enterEmail': 'E-Mail eingeben',
    'auth.enterPassword': 'Passwort eingeben',
    'auth.signingIn': 'Anmelden...',
    'auth.loggedInAs': 'Angemeldet als',

    // Dashboard
    'dashboard.welcome': 'Willkommen zum {language} Lernen',
    'dashboard.welcomeUser': 'Willkommen, {name}!',
    'dashboard.startJourney': 'Beginnen Sie Ihre Reise, um die {language} Sprache mit unseren umfassenden Lerntools zu meistern.',
    'dashboard.navigateUsingSidebar': 'Navigieren Sie durch verschiedene Bereiche mit dem Seitenmenü.',
    'dashboard.totalWords': 'Gesamte Wörter',
    'dashboard.favoriteWords': 'Lieblingswörter',
    'dashboard.wordsPracticed': 'Geübte Wörter',
    'dashboard.successRate': 'Erfolgsrate',
    'dashboard.learningProgress': 'Lernfortschritt',
    'dashboard.recentActivity': 'Letzte Aktivität',
    'dashboard.quickActions': 'Schnellaktionen',
    'dashboard.addNewWords': 'Neue Wörter hinzufügen',
    'dashboard.expandVocabulary': 'Erweitern Sie Ihren Wortschatz',
    'dashboard.startExercise': 'Übung starten',
    'dashboard.practiceWhatLearned': 'Üben Sie das Gelernte',
    'dashboard.viewProgress': 'Fortschritt anzeigen',
    'dashboard.trackImprovement': 'Verfolgen Sie Ihre Verbesserung',
    'dashboard.currentLearningPath': 'Aktueller Lernpfad',
    'dashboard.quickStart': 'Schnellstart',
    'dashboard.useSidebarToAccess': 'Verwenden Sie die Seitenleiste, um auf Vokabular, Übungen und Karteikarten zuzugreifen.',
    'dashboard.learningProgressOverview': 'Ihr {language} Lernfortschritt-Überblick',
    'dashboard.vocabularyWords': '{language} Vokabelwörter',
    'dashboard.wordsMarkedFavorite': 'Als Favorit markierte Wörter',
    'dashboard.wordsWithHistory': 'Wörter mit Lernhistorie',
    'dashboard.averageSuccessRate': 'Durchschnittliche Erfolgsrate bei Übungen',

    // Vocabulary
    'vocabulary.title': 'Vokabular',
    'vocabulary.custom': 'Benutzerdefiniertes Vokabular',
    'vocabulary.categorized': 'Kategorisiertes Vokabular',
    'vocabulary.managePersonalCollection': 'Verwalten Sie Ihre persönliche Vokabelsammlung',
    'vocabulary.addWord': 'Wort hinzufügen',
    'vocabulary.addNewWord': 'Neues Wort hinzufügen',
    'vocabulary.targetWord': '{language} Wort',
    'vocabulary.nativeWord': '{language} Übersetzung',
    'vocabulary.categories': 'Kategorien',
    'vocabulary.sampleSentence': 'Beispielsatz',
    'vocabulary.searchWords': 'Wörter suchen...',
    'vocabulary.allCategories': 'Alle Kategorien',
    'vocabulary.sortBy': 'Sortieren nach',
    'vocabulary.dateAdded': 'Hinzugefügt am',
    'vocabulary.learningProgress': 'Lernfortschritt',
    'vocabulary.lastLearned': 'Zuletzt gelernt',
    'vocabulary.successRate': 'Erfolg: {rate}%',
    'vocabulary.exercisesCount': '{count} Übungen',
    'vocabulary.noSampleSentence': 'Kein Beispielsatz vorhanden',
    'vocabulary.enterTargetWord': '{language} Wort eingeben',
    'vocabulary.enterNativeWord': '{language} Übersetzung eingeben',

    // Exercises
    'exercises.title': 'Übungen',
    'exercises.allExercises': 'Alle Übungen',
    'exercises.gapFill': 'Lückentext',
    'exercises.gapFillDesc': 'Füllen Sie die Lücken mit den richtigen Wörtern',
    'exercises.multipleChoice': 'Multiple Choice',
    'exercises.multipleChoiceDesc': 'Wählen Sie die richtige Antwort aus mehreren Optionen',
    'exercises.translation': 'Übersetzung',
    'exercises.translationDesc': 'Übersetzen Sie zwischen Sprachen',
    'exercises.matching': 'Zuordnung',
    'exercises.matchingDesc': 'Ordnen Sie Wörter ihren Übersetzungen zu',
    'exercises.wordFormation': 'Wortbildung',
    'exercises.wordFormationDesc': 'Üben Sie das Erstellen von Wörtern mit Präfixen und Suffixen',
    'exercises.oppositeMeaning': 'Gegenteil',
    'exercises.oppositeMeaningDesc': 'Finden Sie Wörter mit entgegengesetzter Bedeutung (Antonyme)',
    'exercises.sameMeaning': 'Gleiche Bedeutung',
    'exercises.sameMeaningDesc': 'Finden Sie Wörter mit ähnlicher Bedeutung (Synonyme)',
    'exercises.wordDefinition': 'Wortdefinition',
    'exercises.wordDefinitionDesc': 'Schreiben Sie das Wort, das zur gegebenen Definition passt',
    'exercises.describePicture': 'Bild beschreiben',
    'exercises.describePictureDesc': 'Üben Sie das Beschreiben von Bildern',
    'exercises.grammar': 'Grammatik',
    'exercises.grammarDesc': 'Üben Sie Grammatikregeln',
    'exercises.mixed': 'Gemischt',
    'exercises.mixedDesc': 'Gemischte Übungen für umfassendes Üben',
    'exercises.startExercise': 'Übung starten',
    'exercises.checkAnswers': 'Antworten überprüfen',
    'exercises.showHint': 'Hinweis anzeigen',
    'exercises.hideHint': 'Hinweis ausblenden',
    'exercises.correctAnswer': 'Richtige Antwort:',
    'exercises.yourAnswer': 'Ihre Antwort',
    'exercises.hint': 'Hinweis:',
    'exercises.explanation': 'Erklärung:',
    'exercises.newExercise': 'Neue Übung',
    'exercises.restartExercise': 'Gleiche Übung wiederholen',
    'exercises.practiceMistakes': 'Fehler üben',

    // Exercise specific
    'exercises.gapFill.title': '{language} Lückentext-Übung',
    'exercises.gapFill.instructions': 'Füllen Sie die Lücken mit den richtigen Wörtern.',
    'exercises.multipleChoice.title': '{language} Multiple Choice Übung',
    'exercises.multipleChoice.instructions': 'Wählen Sie die richtige Antwort für jede Frage.',
    'exercises.translation.title': '{language} zu {nativeLanguage} Übersetzung',
    'exercises.translation.instructions': 'Übersetzen Sie die folgenden Sätze.',
    'exercises.matching.title': '{language} - {nativeLanguage} Zuordnung',
    'exercises.matching.instructions': 'Ordnen Sie Wörter ihren Übersetzungen zu.',
    'exercises.wordFormation.title': '{language} Wortbildungs-Übung',
    'exercises.wordFormation.instructions': 'Erstellen Sie neue Wörter mit Präfixen und Suffixen',
    'exercises.oppositeMeaning.title': '{language} Gegenteil-Übung',
    'exercises.oppositeMeaning.instructions': 'Finden Sie die entgegengesetzte Bedeutung (Antonym) für jedes Wort',
    'exercises.sameMeaning.title': '{language} Gleiche Bedeutung-Übung',
    'exercises.sameMeaning.instructions': 'Finden Sie Wörter mit der gleichen Bedeutung (Synonym) für jedes Wort',
    'exercises.wordDefinition.title': 'Wortdefinitions-Übung',
    'exercises.wordDefinition.instructions': 'Schreiben Sie das Wort, das zu jeder Definition passt',

    // Vocabulary Selector
    'vocabularySelector.useExistingVocabulary': 'Vorhandenes Vokabular verwenden',
    'vocabularySelector.selectCategory': 'Wählen Sie eine Kategorie aus Ihrem Vokabular zum Üben.',
    'vocabularySelector.selectCategoryPlaceholder': 'Kategorie auswählen',
    'vocabularySelector.useSelectedCategory': 'Ausgewählte Kategorie verwenden',
    'vocabularySelector.wordsCount': '{count} Wörter',

    // Word Input Form
    'wordInputForm.createNewExercise': 'Neue {exerciseType} Übung erstellen',
    'wordInputForm.addWords': 'Fügen Sie bis zu 20 {language} Wörter oder Phrasen hinzu.',
    'wordInputForm.addWord': 'Wort hinzufügen',
    'wordInputForm.generateExercise': 'Übung generieren',

    // Settings
    'settings.title': 'Einstellungen',
    'settings.languageSettings': 'Spracheinstellungen',
    'settings.appearance': 'Erscheinungsbild',
    'settings.notifications': 'Benachrichtigungen',
    'settings.privacy': 'Datenschutz & Sicherheit',
    'settings.interfaceLanguage': 'Oberflächensprache',
    'settings.languageForMenus': 'Sprache für Menüs und Schaltflächen',
    'settings.theme': 'Design',
    'settings.chooseTheme': 'Wählen Sie Ihr bevorzugtes Design',
    'settings.light': 'Hell',
    'settings.dark': 'Dunkel',
    'settings.system': 'System',

    // Profile
    'profile.title': 'Profil-Einstellungen',
    'profile.personalInfo': 'Persönliche Informationen',
    'profile.profilePicture': 'Profilbild',
    'profile.clickCameraToChange': 'Klicken Sie auf das Kamera-Symbol, um Ihr Bild zu ändern',
    'profile.phone': 'Telefon',
    'profile.location': 'Standort',
    'profile.dateOfBirth': 'Geburtsdatum',
    'profile.saveChanges': 'Änderungen speichern',

    // Toasts and messages
    'toast.exerciseGenerated': 'Übung generiert',
    'toast.exerciseStarted': 'Übung gestartet!',
    'toast.exerciseCompleted': 'Übung abgeschlossen!',
    'toast.wordAdded': 'Wort hinzugefügt!',
    'toast.wordDeleted': 'Wort gelöscht',
    'toast.apiKeyRequired': 'API-Schlüssel erforderlich',
    'toast.configureApiKey': 'Bitte konfigurieren Sie Ihren OpenAI API-Schlüssel in den Einstellungen.',
    'toast.noWordsFound': 'Keine Wörter gefunden',
    'toast.categoryHasNoWords': 'Diese Kategorie hat keine Wörter. Bitte fügen Sie zuerst einige Wörter hinzu.',
    'toast.exerciseLoadedFromCategory': 'Verwende Vokabular aus {category}',

    // Errors
    'error.missingInformation': 'Fehlende Informationen',
    'error.fillBothWords': 'Bitte füllen Sie sowohl {targetLanguage} als auch {nativeLanguage} Wörter aus.',
    'error.noWordsProvided': 'Keine Wörter angegeben',
    'error.addAtLeastOneWord': 'Bitte fügen Sie mindestens ein Wort hinzu, um eine Übung zu generieren.',

    // Settings
    'settings.currentInterface': 'Aktuelle Oberfläche',
  },

  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel',
    'nav.vocabulary': 'Vocabulario',
    'nav.vocabulary.categorized': 'Categorizado',
    'nav.vocabulary.custom': 'Personalizado',
    'nav.exercises': 'Ejercicios',
    'nav.exercises.all': 'Todos',
    'nav.exercises.gapFill': 'Rellenar espacios',
    'nav.exercises.multipleChoice': 'Opción múltiple',
    'nav.exercises.translation': 'Traducción',
    'nav.exercises.matching': 'Emparejar',
    'nav.exercises.wordFormation': 'Formación de palabras',
    'nav.exercises.oppositeMeaning': 'Significado opuesto',
    'nav.exercises.sameMeaning': 'Mismo significado',
    'nav.exercises.wordDefinition': 'Definición de palabra',
    'nav.exercises.describePicture': 'Describir imagen',
    'nav.exercises.grammar': 'Gramática',
    'nav.exercises.mixed': 'Mixto',
    'nav.flashcards': 'Tarjetas',
    'nav.voiceConversation': 'Conversación por voz',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configuración',

    // Common actions
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Añadir',
    'common.remove': 'Quitar',
    'common.close': 'Cerrar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.loading': 'Cargando...',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.selectAll': 'Seleccionar todo',
    'common.deselectAll': 'Deseleccionar todo',
    'common.generate': 'Generar',
    'common.start': 'Iniciar',
    'common.restart': 'Reiniciar',
    'common.continue': 'Continuar',
    'common.finish': 'Terminar',
    'common.submit': 'Enviar',
    'common.confirm': 'Confirmar',
    'common.yes': 'Sí',
    'common.no': 'No',

    // Add more Spanish translations...
    'auth.login': 'Iniciar sesión',
    'auth.logout': 'Cerrar sesión',
    'dashboard.welcome': 'Bienvenido al aprendizaje de {language}',
    'vocabulary.title': 'Vocabulario',
    'exercises.title': 'Ejercicios',
    'settings.title': 'Configuración',
    'profile.title': 'Configuración del perfil',
  },

  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.vocabulary': 'Vocabulaire',
    'nav.exercises': 'Exercices',
    'nav.flashcards': 'Cartes mémoire',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',

    // Common actions
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',

    // Add more French translations...
    'auth.login': 'Se connecter',
    'auth.logout': 'Se déconnecter',
    'dashboard.welcome': 'Bienvenue à l\'apprentissage du {language}',
    'vocabulary.title': 'Vocabulaire',
    'exercises.title': 'Exercices',
    'settings.title': 'Paramètres',
    'profile.title': 'Paramètres du profil',
  },

  it: {
    // Add Italian translations...
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.vocabulary': 'Vocabolario',
    'nav.exercises': 'Esercizi',
    'auth.login': 'Accedi',
    'auth.logout': 'Esci',
    'dashboard.welcome': 'Benvenuto all\'apprendimento del {language}',
    'vocabulary.title': 'Vocabolario',
    'exercises.title': 'Esercizi',
    'settings.title': 'Impostazioni',
    'profile.title': 'Impostazioni profilo',
  },

  pt: {
    // Add Portuguese translations...
    'nav.home': 'Início',
    'nav.dashboard': 'Painel',
    'nav.vocabulary': 'Vocabulário',
    'nav.exercises': 'Exercícios',
    'auth.login': 'Entrar',
    'auth.logout': 'Sair',
    'dashboard.welcome': 'Bem-vindo ao aprendizado de {language}',
    'vocabulary.title': 'Vocabulário',
    'exercises.title': 'Exercícios',
    'settings.title': 'Configurações',
    'profile.title': 'Configurações do perfil',
  },

  ru: {
    // Add Russian translations...
    'nav.home': 'Главная',
    'nav.dashboard': 'Панель',
    'nav.vocabulary': 'Словарь',
    'nav.exercises': 'Упражнения',
    'auth.login': 'Войти',
    'auth.logout': 'Выйти',
    'dashboard.welcome': 'Добро пожаловать в изучение {language}',
    'vocabulary.title': 'Словарь',
    'exercises.title': 'Упражнения',
    'settings.title': 'Настройки',
    'profile.title': 'Настройки профиля',
  },

  ja: {
    // Add Japanese translations...
    'nav.home': 'ホーム',
    'nav.dashboard': 'ダッシュボード',
    'nav.vocabulary': '語彙',
    'nav.exercises': '練習',
    'auth.login': 'ログイン',
    'auth.logout': 'ログアウト',
    'dashboard.welcome': '{language}学習へようこそ',
    'vocabulary.title': '語彙',
    'exercises.title': '練習',
    'settings.title': '設定',
    'profile.title': 'プロフィール設定',
  },

  ko: {
    // Add Korean translations...
    'nav.home': '홈',
    'nav.dashboard': '대시보드',
    'nav.vocabulary': '어휘',
    'nav.exercises': '연습',
    'auth.login': '로그인',
    'auth.logout': '로그아웃',
    'dashboard.welcome': '{language} 학습에 오신 것을 환영합니다',
    'vocabulary.title': '어휘',
    'exercises.title': '연습',
    'settings.title': '설정',
    'profile.title': '프로필 설정',
  },

  zh: {
    // Add Chinese translations...
    'nav.home': '首页',
    'nav.dashboard': '仪表板',
    'nav.vocabulary': '词汇',
    'nav.exercises': '练习',
    'auth.login': '登录',
    'auth.logout': '登出',
    'dashboard.welcome': '欢迎学习{language}',
    'vocabulary.title': '词汇',
    'exercises.title': '练习',
    'settings.title': '设置',
    'profile.title': '个人资料设置',
  },

  ar: {
    // Add Arabic translations...
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.vocabulary': 'المفردات',
    'nav.exercises': 'التمارين',
    'auth.login': 'تسجيل الدخول',
    'auth.logout': 'تسجيل الخروج',
    'dashboard.welcome': 'مرحباً بك في تعلم {language}',
    'vocabulary.title': 'المفردات',
    'exercises.title': 'التمارين',
    'settings.title': 'الإعدادات',
    'profile.title': 'إعدادات الملف الشخصي',
  },

  hi: {
    // Add Hindi translations...
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.vocabulary': 'शब्दावली',
    'nav.exercises': 'अभ्यास',
    'auth.login': 'लॉग इन',
    'auth.logout': 'लॉग आउट',
    'dashboard.welcome': '{language} सीखने में आपका स्वागत है',
    'vocabulary.title': 'शब्दावली',
    'exercises.title': 'अभ्यास',
    'settings.title': 'सेटिंग्स',
    'profile.title': 'प्रोफ़ाइल सेटिंग्स',
  },

  pl: {
    // Add Polish translations...
    'nav.home': 'Strona główna',
    'nav.dashboard': 'Panel',
    'nav.vocabulary': 'Słownictwo',
    'nav.exercises': 'Ćwiczenia',
    'auth.login': 'Zaloguj się',
    'auth.logout': 'Wyloguj się',
    'dashboard.welcome': 'Witamy w nauce {language}',
    'vocabulary.title': 'Słownictwo',
    'exercises.title': 'Ćwiczenia',
    'settings.title': 'Ustawienia',
    'profile.title': 'Ustawienia profilu',
  },
};

const AVAILABLE_LOCALES = [
  { code: 'en' as SupportedLocale, name: 'English', nativeName: 'English' },
  { code: 'de' as SupportedLocale, name: 'German', nativeName: 'Deutsch' },
  { code: 'es' as SupportedLocale, name: 'Spanish', nativeName: 'Español' },
  { code: 'fr' as SupportedLocale, name: 'French', nativeName: 'Français' },
  { code: 'it' as SupportedLocale, name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt' as SupportedLocale, name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru' as SupportedLocale, name: 'Russian', nativeName: 'Русский' },
  { code: 'ja' as SupportedLocale, name: 'Japanese', nativeName: '日本語' },
  { code: 'ko' as SupportedLocale, name: 'Korean', nativeName: '한국어' },
  { code: 'zh' as SupportedLocale, name: 'Chinese', nativeName: '中文' },
  { code: 'ar' as SupportedLocale, name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi' as SupportedLocale, name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'pl' as SupportedLocale, name: 'Polish', nativeName: 'Polski' },
];

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    const saved = localStorage.getItem('app-locale');
    return (saved as SupportedLocale) || 'en';
  });

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('app-locale', newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[locale]?.[key] || translations.en[key] || key;
    
    if (!params) return translation;
    
    // Replace parameters in the translation
    return Object.entries(params).reduce((text, [param, value]) => {
      return text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
    }, translation);
  };

  const getAvailableLocales = () => AVAILABLE_LOCALES;

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, t, getAvailableLocales }}>
      {children}
    </LocalizationContext.Provider>
  );
};