import { Card } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and system preferences
        </p>
      </div>

      <Card className="p-6">
        {/* Add settings form here */}
      </Card>
    </div>
  );
};

export default Settings;