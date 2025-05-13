
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="max-w-3xl p-8 space-y-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="bg-primary rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-foreground">FT</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground animate-fade-in">
            ForgeTrain Admin Portal
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your coding & placement prep hub for Indian engineering colleges
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <Link to="/admin">
            <Button size="lg" className="px-8">
              Enter Admin Portal
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            The comprehensive admin interface for ForgeTrain platform administrators and college placement officers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-border hover-lift">
            <h3 className="text-lg font-medium mb-2">Manage Users</h3>
            <p className="text-muted-foreground text-sm">
              Control student profiles, assign roles, and manage account permissions.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-border hover-lift">
            <h3 className="text-lg font-medium mb-2">Learning Content</h3>
            <p className="text-muted-foreground text-sm">
              Create and edit modules in Syntax Bootcamp, DSA tracks, and Projects.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-border hover-lift">
            <h3 className="text-lg font-medium mb-2">Placement Drives</h3>
            <p className="text-muted-foreground text-sm">
              Schedule new drives, set eligibility criteria, and manage registrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
