
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardCard = ({ title, value, description }: { title: string; value: string; description: string }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Flashcards Progress"
          value="24/100"
          description="Learning flashcards / Total"
        />
        <DashboardCard
          title="Categories"
          value="5"
          description="Active learning categories"
        />
        <DashboardCard
          title="Conversations"
          value="12"
          description="Total conversations completed"
        />
        <DashboardCard
          title="Exercises"
          value="45"
          description="Completed exercises"
        />
      </div>
    </div>
  );
};

export default Dashboard;
