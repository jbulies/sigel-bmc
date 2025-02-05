import { Card } from "@/components/ui/card";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const stats = [
    {
      label: "Total Reports",
      value: "156",
      icon: ClipboardList,
      color: "text-primary",
    },
    {
      label: "In Progress",
      value: "23",
      icon: Clock,
      color: "text-status-inProgress",
    },
    {
      label: "Resolved",
      value: "89",
      icon: CheckCircle2,
      color: "text-status-resolved",
    },
    {
      label: "Pending",
      value: "44",
      icon: AlertCircle,
      color: "text-status-pending",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your report management system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-full bg-background", stat.color)}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
          <div className="space-y-4">
            {/* Add recent reports list here */}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
          <div className="space-y-4">
            {/* Add activity feed here */}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;