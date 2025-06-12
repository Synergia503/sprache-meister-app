
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
  Unlink
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
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

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={personalInfo.firstName}
                onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={personalInfo.location}
                onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={personalInfo.dateOfBirth}
                onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleSavePersonalInfo} className="w-full md:w-auto">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <Button onClick={handleChangePassword} className="w-full md:w-auto">
            Change Password
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

      {/* Notifications */}
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
                    <Button variant="destructive" onClick={handleDeleteAccount} className="flex-1">
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
