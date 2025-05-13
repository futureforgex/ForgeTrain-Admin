
import React from 'react';
import { 
  BarChart, 
  Users, 
  FileQuestion, 
  Calendar,
  Award, 
  BookOpen,
  UserCheck,
  Clock,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import mockUsers from '@/data/mockUsers';
import mockModules from '@/data/mockModules';
import mockQuizzes from '@/data/mockQuizzes';
import mockDrives from '@/data/mockDrives';
import { userRegistrationData } from '@/data/mockAnalytics';

const Dashboard = () => {
  // Calculate statistics
  const activeUsers = mockUsers.filter(user => user.status === 'active').length;
  const totalUsers = mockUsers.length;
  const activeModules = mockModules.filter(module => module.status === 'published').length;
  const activeQuizzes = mockQuizzes.filter(quiz => quiz.status === 'published').length;
  const upcomingDrives = mockDrives.filter(drive => drive.status === 'upcoming').length;
  
  // Recent data for charts (last 7 days)
  const recentRegistrationData = userRegistrationData[0].data.slice(-7);
  
  const StatCard = ({ title, value, icon: Icon, description, trend, color }: any) => (
    <Card className="admin-card-stat hover-lift">
      <CardContent className="p-0">
        <div className="flex justify-between items-start p-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-3xl font-bold">{value}</h2>
            {description && (
              <div className="flex items-center text-sm">
                {trend === 'up' ? (
                  <span className={`flex items-center text-admin-success`}>
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    {description}
                  </span>
                ) : trend === 'down' ? (
                  <span className={`flex items-center text-admin-danger`}>
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                    {description}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Last updated:</span>
          <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={totalUsers}
          description="15% increase" 
          trend="up"
          icon={Users} 
          color="bg-admin-primary"
        />
        <StatCard 
          title="Active Modules" 
          value={activeModules} 
          description="3 new this month"
          icon={BookOpen} 
          color="bg-admin-secondary"
        />
        <StatCard 
          title="Active Quizzes" 
          value={activeQuizzes} 
          description="2 pending review"
          icon={FileQuestion} 
          color="bg-admin-accent"
        />
        <StatCard 
          title="Upcoming Drives" 
          value={upcomingDrives}
          description="Next drive: June 15" 
          icon={Calendar} 
          color="bg-admin-success"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="admin-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>User Registrations</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>Daily new user registrations</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={recentRegistrationData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`${value} users`, 'Registrations']}
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorRegistrations)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-4">
          <Card className="admin-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Quick Stats</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Users</span>
                    <UserCheck className="h-4 w-4 text-admin-success" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{activeUsers}</p>
                  <p className="text-xs text-muted-foreground mt-1">Out of {totalUsers} total users</p>
                </div>
                
                <div className="flex flex-col border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Session</span>
                    <Clock className="h-4 w-4 text-admin-primary" />
                  </div>
                  <p className="text-2xl font-bold mt-2">42m</p>
                  <p className="text-xs text-muted-foreground mt-1">14% increase this week</p>
                </div>
                
                <div className="flex flex-col border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Quiz Completion</span>
                    <FileQuestion className="h-4 w-4 text-admin-secondary" />
                  </div>
                  <p className="text-2xl font-bold mt-2">76%</p>
                  <p className="text-xs text-muted-foreground mt-1">5% increase this week</p>
                </div>
                
                <div className="flex flex-col border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Badges Awarded</span>
                    <Award className="h-4 w-4 text-admin-warning" />
                  </div>
                  <p className="text-2xl font-bold mt-2">152</p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="admin-card">
            <CardHeader className="pb-2">
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="h-8 w-8 rounded-full bg-admin-primary/10 flex items-center justify-center text-admin-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">9 new user registrations</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="h-8 w-8 rounded-full bg-admin-secondary/10 flex items-center justify-center text-admin-secondary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New module "Advanced Algorithms" published</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-admin-success/10 flex items-center justify-center text-admin-success">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">TechSolutions drive registration started</p>
                    <p className="text-xs text-muted-foreground">Yesterday at 10:15 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
