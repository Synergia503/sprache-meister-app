import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { BookOpen, Target, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ComponentType<any>;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { languageSettings } = useLanguage();
  const { words } = useVocabulary();
  const { t } = useLocalization();

  // Calculate statistics
  const totalWords = words.length;
  const favoriteWords = words.filter(word => word.isFavorite).length;
  const wordsWithHistory = words.filter(word => word.learningHistory.length > 0).length;
  const averageSuccessRate = wordsWithHistory > 0 
    ? Math.round(words.reduce((sum, word) => {
        if (word.learningHistory.length === 0) return sum;
        const successCount = word.learningHistory.filter(h => h.success).length;
        return sum + (successCount / word.learningHistory.length) * 100;
      }, 0) / wordsWithHistory)
    : 0;

  const recentActivity = words
    .filter(word => word.lastLearningDate)
    .sort((a, b) => (b.lastLearningDate?.getTime() || 0) - (a.lastLearningDate?.getTime() || 0))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.dashboard')}</h1>
        <p className="text-muted-foreground">
          {t('dashboard.learningProgressOverview', { language: languageSettings.targetLanguage.nativeName })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title={t('dashboard.totalWords')}
          value={totalWords.toString()}
          description={t('dashboard.vocabularyWords', { language: languageSettings.targetLanguage.nativeName })}
          icon={BookOpen}
        />
        <DashboardCard
          title={t('dashboard.favoriteWords')}
          value={favoriteWords.toString()}
          description={t('dashboard.wordsMarkedFavorite')}
          icon={Target}
        />
        <DashboardCard
          title={t('dashboard.wordsPracticed')}
          value={wordsWithHistory.toString()}
          description={t('dashboard.wordsWithHistory')}
          icon={CheckCircle}
        />
        <DashboardCard
          title={t('dashboard.successRate')}
          value={`${averageSuccessRate}%`}
          description={t('dashboard.averageSuccessRate')}
          icon={TrendingUp}
        />
      </div>

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Vocabulary Mastery</span>
                <span>{Math.round((wordsWithHistory / Math.max(totalWords, 1)) * 100)}%</span>
              </div>
              <Progress value={(wordsWithHistory / Math.max(totalWords, 1)) * 100} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Exercise Completion</span>
                <span>{averageSuccessRate}%</span>
              </div>
              <Progress value={averageSuccessRate} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((word) => (
                  <div key={word.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{word.targetWord}</div>
                      <div className="text-sm text-muted-foreground">
                        {word.learningHistory.length} exercises completed
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {word.lastLearningDate?.toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">Add New Words</div>
              <div className="text-sm text-muted-foreground">Expand your vocabulary</div>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">Start Exercise</div>
              <div className="text-sm text-muted-foreground">Practice what you've learned</div>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">View Progress</div>
              <div className="text-sm text-muted-foreground">Track your improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
