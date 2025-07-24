
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, FolderOpen, MessageCircle, CheckCircle } from "lucide-react";

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
  <Card className="hover:shadow-lg transition-shadow">
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
  // This would typically come from a data source/API
  const dashboardData = {
    learningFlashcards: 24,
    totalFlashcards: 100,
    learningCategories: 5,
    conversationsCount: 12,
    doneExercises: 45
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Learning Flashcards"
          value={`${dashboardData.learningFlashcards}/${dashboardData.totalFlashcards}`}
          description="Currently learning / Total flashcards"
          icon={CreditCard}
        />
        <DashboardCard
          title="Learning Categories"
          value={dashboardData.learningCategories.toString()}
          description="Active learning categories"
          icon={FolderOpen}
        />
        <DashboardCard
          title="All Conversations"
          value={dashboardData.conversationsCount.toString()}
          description="Total conversations completed"
          icon={MessageCircle}
        />
        <DashboardCard
          title="Done Exercises"
          value={dashboardData.doneExercises.toString()}
          description="Completed exercises"
          icon={CheckCircle}
        />
      </div>
    </div>
  );
};

export default Dashboard;
