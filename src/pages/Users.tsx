import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

const Users = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage system users and their roles
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Invite User
        </Button>
      </div>

      <Card className="p-6">
        {/* Add users table here */}
      </Card>
    </div>
  );
};

export default Users;