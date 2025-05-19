import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  BookOpen,
  FileQuestion,
  Calendar,
  Award,
  Bell,
  BarChart,
  Settings,
  Video,
  ClipboardList,
  Library,
  Layers,
  Plus,
  School,
} from 'lucide-react';
import { Tooltip } from "@/components/ui/tooltip";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Colleges', href: '/admin/colleges', icon: School },
  { name: 'Modules', href: '/admin/modules', icon: Layers },
  { name: 'Text Tutorials', href: '/admin/text-tutorials', icon: BookOpen },
  { name: 'Video Tutorials', href: '/admin/video-tutorials', icon: Video },
  { name: 'Quizzes', href: '/admin/quizzes', icon: FileQuestion },
  { name: 'Code Challenges', href: '/admin/code-challenges', icon: FileQuestion },
  { name: 'Project Tasks', href: '/admin/project-tasks', icon: ClipboardList },
  { name: 'Placement Drives', href: '/admin/drives', icon: Calendar },
  { name: 'Leaderboards', href: '/admin/leaderboards', icon: Award },
  { name: 'Announcements', href: '/admin/announcements', icon: Bell },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const AdminSidebar = ({ collapsed = false, onToggleCollapse }: AdminSidebarProps) => {
  const location = useLocation();

  return (
    <aside className={cn(
      "bg-sidebar h-full flex-shrink-0 border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo / Header */}
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-sidebar-border",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center text-white font-bold">FT</div>
              <span className="text-sidebar-foreground font-semibold text-lg">ForgeTrain</span>
            </Link>
          )}
          {collapsed && (
            <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center text-white font-bold">FT</div>
          )}
          {!collapsed && (
            <Tooltip content="Collapse sidebar" side="right">
              <button 
                onClick={onToggleCollapse} 
                className="text-sidebar-foreground hover:bg-sidebar-accent rounded-md p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            </Tooltip>
          )}
          {collapsed && (
            <Tooltip content="Expand sidebar" side="right">
              <button 
                onClick={onToggleCollapse}
                className="absolute left-16 top-5 bg-sidebar rounded-r-md border border-l-0 border-sidebar-border p-1 text-sidebar-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </Tooltip>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 relative group",
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center"
                    )}
                    style={{
                      boxShadow: isActive ? "0 2px 8px 0 rgba(0,0,0,0.04)" : undefined,
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-md" />
                    )}
                    <item.icon size={20} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn(
            "flex items-center gap-3",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground">
              A
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">Admin User</span>
                <span className="text-xs text-sidebar-foreground/70">admin@forgetrain.com</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
