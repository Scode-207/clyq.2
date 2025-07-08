import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Brain, 
  ShoppingBag, 
  Plane, 
  Utensils, 
  Stethoscope,
  Settings,
  LogOut,
  User,
  Network,
  Users
} from "lucide-react";
import { LearningNotificationCenter } from "@/components/learning/learning-notification";

type ActiveSection = 'chat' | 'marketplace';

interface SidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logoutMutation } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navigationItems = [
    { id: 'chat' as const, icon: MessageCircle, label: 'Conversations' },
    { id: 'marketplace' as const, icon: ShoppingBag, label: 'Marketplace' },
  ];

  const externalLinks = [
    { href: '/knowledge-graph', icon: Network, label: 'Knowledge Graph' },
    { href: '/travel-agents', icon: Users, label: 'Travel Agents' },
  ];

  return (
    <div 
      className={cn(
        "h-full bg-background flex flex-col border-r border-border transition-all duration-300 ease-in-out",
        isExpanded ? "w-72" : "w-16"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center">
          <Logo size="md" />
          
          {/* Expandable Text */}
          <div className={cn(
            "ml-3 transition-all duration-300 ease-in-out overflow-hidden",
            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
          )}>
            <h1 className="text-foreground font-semibold text-lg whitespace-nowrap">CLYQ</h1>
            <p className="text-muted-foreground text-sm whitespace-nowrap">Commerce AI</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Section */}
      <div className="flex-1 px-2 py-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center rounded-xl transition-all duration-200 text-left group relative",
                  isExpanded ? "px-4 py-3 space-x-3" : "px-3 py-3 justify-center",
                  isActive 
                    ? "bg-primary/20 text-primary border border-primary/30 neural-glow" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent"
                )}
              >
                <Icon size={20} className="flex-shrink-0" />
                
                {/* Expandable Label */}
                <span className={cn(
                  "font-medium text-sm transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap",
                  isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                )}>
                  {item.label}
                </span>
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
          
          {/* External Links */}
          <div className="mt-6 space-y-2">
            {externalLinks.map((link) => {
              const Icon = link.icon;
              
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "w-full flex items-center rounded-xl transition-all duration-200 text-left group relative",
                    isExpanded ? "px-4 py-3 space-x-3" : "px-3 py-3 justify-center",
                    "text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent"
                  )}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  
                  {/* Expandable Label */}
                  <span className={cn(
                    "font-medium text-sm transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap",
                    isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                  )}>
                    {link.label}
                  </span>
                  
                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {link.label}
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        </nav>
      </div>
      
      {/* User Profile & Logout at bottom */}
      <div className="p-2 border-t border-border space-y-2">
        {/* User Profile */}
        <div className={cn(
          "w-full flex items-center rounded-xl transition-all duration-200 text-left text-white relative",
          isExpanded ? "px-4 py-3 space-x-3" : "px-3 py-3 justify-center"
        )}>
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-electric-blue text-white">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          
          {/* User Info - Expandable */}
          <div className={cn(
            "flex-1 transition-all duration-300 ease-in-out overflow-hidden",
            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
          )}>
            <div className="font-medium text-sm text-white">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-gray-400">
              @{user?.username}
            </div>
          </div>
          
          {/* Learning Notification Center */}
          <div className="flex-shrink-0">
            <LearningNotificationCenter />
          </div>
          
          {/* Tooltip for collapsed state */}
          {!isExpanded && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {user?.firstName} {user?.lastName}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          variant="ghost"
          className={cn(
            "w-full flex items-center rounded-xl transition-all duration-200 text-left group text-gray-400 hover:text-white hover:bg-red-900/20 hover:border-red-500/20 relative",
            isExpanded ? "px-4 py-3 space-x-3 justify-start" : "px-3 py-3 justify-center"
          )}
        >
          <LogOut size={20} className="flex-shrink-0" />
          
          {/* Expandable Label */}
          <span className={cn(
            "font-medium text-sm transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap",
            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
          )}>
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </span>
          
          {/* Tooltip for collapsed state */}
          {!isExpanded && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}