import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Trash2, 
  Download, 
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Languages,
  Volume2,
  Eye,
  Unlink,
  Camera,
  EyeOff,
  Palette,
  Target,
  Trophy,
  Cloud,
  Smartphone,
  LogOut,
  History,
  ChevronDown,
  Upload,
  Settings,
  Clock,
  Award,
  BookOpen,
  BarChart3
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocalization();
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    location: '',
    dateOfBirth: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    learningReminders: true,
    progressReports: true,
    soundEffects: true,
    autoplay: false,
    darkMode: false,
    language: 'English'
  });

  const [socialConnections] = useState([
    { provider: 'Google', connected: true, email: user?.email },
    { provider: 'Facebook', connected: false, email: null },
    { provider: 'Twitter', connected: false, email: null },
    { provider: 'LinkedIn', connected: false, email: null }
  ]);

  // New state for extended features
  const [profilePicture, setProfilePicture] = useState<string>('/placeholder.svg');
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showProgress: true,
    showAchievements: true,
    allowMessages: true
  });
  
  const [interfaceLanguage, setInterfaceLanguage] = useState('English');
  const [themePreference, setThemePreference] = useState('system');
  
  const [learningGoals, setLearningGoals] = useState({
    dailyMinutes: 30,
    weeklyGoal: 5,
    targetLevel: 'B2',
    focusAreas: ['vocabulary', 'grammar']
  });
  
  const [achievementSettings, setAchievementSettings] = useState({
    showBadges: true,
    shareAchievements: false,
    celebrateStreaks: true
  });
  
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    cloudSync: true,
    exportFormat: 'json'
  });
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const [activeSessions] = useState([
    { id: '1', device: 'Chrome on Windows', location: 'New York, US', lastActive: '5 minutes ago', current: true },
    { id: '2', device: 'Safari on iPhone', location: 'New York, US', lastActive: '2 hours ago', current: false },
    { id: '3', device: 'Firefox on Mac', location: 'Boston, US', lastActive: '1 day ago', current: false }
  ]);

  const [learningHistory] = useState([
    { date: '2024-06-12', wordsLearned: 15, timeSpent: 45, exercisesCompleted: 8, accuracy: 85 },
    { date: '2024-06-11', wordsLearned: 12, timeSpent: 30, exercisesCompleted: 6, accuracy: 92 },
    { date: '2024-06-10', wordsLearned: 18, timeSpent: 60, exercisesCompleted: 10, accuracy: 78 },
    { date: '2024-06-09', wordsLearned: 10, timeSpent: 25, exercisesCompleted: 5, accuracy: 88 }
  ]);

  // Handler functions
  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = () => {
    toast({
      title: "Personal information updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password changed",
      description: "Your password has been successfully updated.",
    });
    
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleSocialDisconnect = (provider: string) => {
    toast({
      title: "Social account disconnected",
      description: `Your ${provider} account has been disconnected.`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data export initiated",
      description: "You will receive an email with your data shortly.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "Please check your email to confirm account deletion.",
      variant: "destructive",
    });
  };

  const getSocialIcon = (provider: string) => {
    switch (provider) {
      case 'Facebook': return <Facebook className="h-4 w-4" />;
      case 'Twitter': return <Twitter className="h-4 w-4" />;
      case 'LinkedIn': return <Linkedin className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  // New handler functions
  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been successfully changed.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrivacyChange = (field: string, value: string | boolean) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLearningGoalChange = (field: string, value: number | string | string[]) => {
    setLearningGoals(prev => ({ ...prev, [field]: value }));
  };

  const handleAchievementSettingChange = (field: string, value: boolean) => {
    setAchievementSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleBackupSettingChange = (field: string, value: boolean | string) => {
    setBackupSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSessionTermination = (sessionId: string) => {
    toast({
      title: "Session terminated",
      description: "The selected session has been terminated.",
    });
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "Two-factor authentication disabled" : "Two-factor authentication enabled",
      description: twoFactorEnabled ? "Your account is now less secure." : "Your account is now more secure.",
    });
  };

  const handleBackupNow = () => {
    toast({
      title: "Backup initiated",
      description: "Your learning data is being backed up to the cloud.",
    });
  };

  const languageOptions = ['English', 'German', 'Spanish', 'French', 'Italian', 'Portuguese'];
  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ];
  const privacyOptions = [
    { value: 'public', label: 'Public' },
    { value: 'friends', label: 'Friends Only' },
    { value: 'private', label: 'Private' }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <User className="h-6 sm:h-8 w-6 sm:w-8" />
        <h1 className="text-2xl sm:text-3xl font-bold">{t('profile.title')}</h1>
      </div>

      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {t('profile.profilePicture')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
              />
              <label className="absolute -bottom-1 -right-1 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90">
                <Camera className="h-3 w-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</p>
              <p className="text-sm text-muted-foreground">{t('profile.clickCameraToChange')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('profile.personalInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('profile.firstName')}</Label>
              <Input
                id="firstName"
                value={personalInfo.firstName}
                onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('profile.lastName')}</Label>
              <Input
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('profile.email')}</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('profile.phone')}</Label>
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t('profile.location')}</Label>
              <Input
                id="location"
                value={personalInfo.location}
                onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">{t('profile.dateOfBirth')}</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={personalInfo.dateOfBirth}
                onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleSavePersonalInfo} className="w-full sm:w-auto">
            {t('profile.saveChanges')}
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {t('profile.privacySettings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.profileVisibility')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.whoCanSeeProfile')}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-32">
                  {privacyOptions.find(opt => opt.value === privacySettings.profileVisibility)?.label}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {privacyOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handlePrivacyChange('profileVisibility', option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.showLearningProgress')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.displayProgressPublicly')}</p>
            </div>
            <Switch
              checked={privacySettings.showProgress}
              onCheckedChange={(checked) => handlePrivacyChange('showProgress', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.showAchievements')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.displayBadgesAchievements')}</p>
            </div>
            <Switch
              checked={privacySettings.showAchievements}
              onCheckedChange={(checked) => handlePrivacyChange('showAchievements', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.allowMessages')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.letUsersMessage')}</p>
            </div>
            <Switch
              checked={privacySettings.allowMessages}
              onCheckedChange={(checked) => handlePrivacyChange('allowMessages', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Interface & Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t('profile.interfaceTheme')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.interfaceLanguage')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.languageForMenus')}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-32">
                  {interfaceLanguage}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languageOptions.map((language) => (
                  <DropdownMenuItem
                    key={language}
                    onClick={() => setInterfaceLanguage(language)}
                  >
                    {language}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.themePreference')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.chooseAppearance')}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-32">
                  {themeOptions.find(opt => opt.value === themePreference)?.label}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {themeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setThemePreference(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Learning Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('profile.learningGoals')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('profile.dailyStudyMinutes')}</Label>
              <Input
                type="number"
                value={learningGoals.dailyMinutes}
                onChange={(e) => handleLearningGoalChange('dailyMinutes', parseInt(e.target.value))}
                min="5"
                max="180"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('profile.weeklySessionsGoal')}</Label>
              <Input
                type="number"
                value={learningGoals.weeklyGoal}
                onChange={(e) => handleLearningGoalChange('weeklyGoal', parseInt(e.target.value))}
                min="1"
                max="14"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('profile.targetLevel')}</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  {learningGoals.targetLevel}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                  <DropdownMenuItem
                    key={level}
                    onClick={() => handleLearningGoalChange('targetLevel', level)}
                  >
                    {level}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-2">
            <Label>{t('profile.focusAreas')}</Label>
            <div className="flex flex-wrap gap-2">
              {['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing'].map((area) => (
                <Badge
                  key={area}
                  variant={learningGoals.focusAreas.includes(area) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const newFocus = learningGoals.focusAreas.includes(area)
                      ? learningGoals.focusAreas.filter(f => f !== area)
                      : [...learningGoals.focusAreas, area];
                    handleLearningGoalChange('focusAreas', newFocus);
                  }}
                >
                  {area.charAt(0).toUpperCase() + area.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('profile.currentProgress')}</Label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('profile.dailyGoalProgress')}</span>
                <span>23/30 minutes</span>
              </div>
              <Progress value={77} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {t('profile.achievementSettings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.showAchievementBadges')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.displayBadgesOnProfile')}</p>
            </div>
            <Switch
              checked={achievementSettings.showBadges}
              onCheckedChange={(checked) => handleAchievementSettingChange('showBadges', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.shareAchievements')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.autoShareAchievements')}</p>
            </div>
            <Switch
              checked={achievementSettings.shareAchievements}
              onCheckedChange={(checked) => handleAchievementSettingChange('shareAchievements', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.celebrateStreaks')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.showCelebrationsForStreaks')}</p>
            </div>
            <Switch
              checked={achievementSettings.celebrateStreaks}
              onCheckedChange={(checked) => handleAchievementSettingChange('celebrateStreaks', checked)}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 border rounded-lg">
              <Award className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm font-medium">7-Day Streak</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">100 Words</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium">Level Up</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t('profile.passwordSecurity')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('profile.confirmNewPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <Button onClick={handleChangePassword} className="w-full md:w-auto">
            {t('profile.changePassword')}
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('profile.twoFactorAuth')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.enableTwoFactor')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('profile.extraSecurityLayer')}
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>
          {twoFactorEnabled && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm">
                {t('profile.twoFactorEnabled')}
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                {t('profile.viewRecoveryCodes')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {t('profile.activeSessions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.location} • {session.lastActive}
                    </p>
                  </div>
                  {session.current && (
                    <Badge variant="secondary">Current</Badge>
                  )}
                </div>
                {!session.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSessionTermination(session.id)}
                    className="flex items-center gap-1"
                  >
                    <LogOut className="h-3 w-3" />
                    {t('profile.endSession')}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backup & Sync */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            {t('profile.backupSync')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.automaticBackup')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.autoBackupProgress')}</p>
            </div>
            <Switch
              checked={backupSettings.autoBackup}
              onCheckedChange={(checked) => handleBackupSettingChange('autoBackup', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.cloudSync')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.syncDataAcrossDevices')}</p>
            </div>
            <Switch
              checked={backupSettings.cloudSync}
              onCheckedChange={(checked) => handleBackupSettingChange('cloudSync', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('profile.manualBackup')}</Label>
              <p className="text-sm text-muted-foreground">{t('profile.createBackupNow')}</p>
            </div>
            <Button variant="outline" onClick={handleBackupNow} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {t('profile.backupNow')}
            </Button>
          </div>
          <div className="p-3 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{t('profile.lastBackup', { time: '2 hours ago' })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t('profile.learningHistory')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {learningHistory.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {day.timeSpent} minutes • {day.exercisesCompleted} exercises
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{day.wordsLearned} words</p>
                  <p className="text-sm text-muted-foreground">{day.accuracy}% accuracy</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View Full History
          </Button>
        </CardContent>
      </Card>

      {/* Social Media Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Social Media Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socialConnections.map((connection) => (
              <div key={connection.provider} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getSocialIcon(connection.provider)}
                  <div>
                    <p className="font-medium">{connection.provider}</p>
                    {connection.connected && connection.email && (
                      <p className="text-sm text-muted-foreground">{connection.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {connection.connected ? (
                    <>
                      <span className="text-sm text-green-600 font-medium">Connected</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSocialDisconnect(connection.provider)}
                        className="flex items-center gap-1"
                      >
                        <Unlink className="h-3 w-3" />
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Learning Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <Label>Learning Reminders</Label>
            </div>
            <Switch
              checked={preferences.learningReminders}
              onCheckedChange={(checked) => handlePreferenceChange('learningReminders', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Label>Progress Reports</Label>
            </div>
            <Switch
              checked={preferences.progressReports}
              onCheckedChange={(checked) => handlePreferenceChange('progressReports', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <Label>Sound Effects</Label>
            </div>
            <Switch
              checked={preferences.soundEffects}
              onCheckedChange={(checked) => handlePreferenceChange('soundEffects', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <Label>Autoplay Videos</Label>
            </div>
            <Switch
              checked={preferences.autoplay}
              onCheckedChange={(checked) => handlePreferenceChange('autoplay', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive browser notifications</p>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Export Data</Label>
              <p className="text-sm text-muted-foreground">Download all your learning data</p>
            </div>
            <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-destructive">Delete Account</Label>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="destructive" onClick={handleDeleteAccount} className="flex-1 min-w-0">
                      Yes, delete my account
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
