import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

const Reports = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all reports
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Report
        </Button>
      </div>

      <Card className="p-6">
        {/* Add reports table/list here */}
      </Card>
    </div>
  );
};

export default Reports;