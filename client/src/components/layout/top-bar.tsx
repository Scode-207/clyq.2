import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, Bell, Brain, Network } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useVoice } from "@/hooks/use-voice";

interface TopBarProps {
  onToggleKnowledgeGraph: () => void;
}

export default function TopBar({ onToggleKnowledgeGraph }: TopBarProps) {
  const { isListening, startListening, stopListening } = useVoice();
  
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="bg-dark-primary/60 backdrop-blur-md border-b border-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {/* Agent avatar with gradient ring when active */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-deep-purple p-0.5">
            <div className="w-full h-full rounded-full bg-dark-primary flex items-center justify-center">
              <Brain className="text-electric-blue" size={16} />
            </div>
          </div>
          {/* Active indicator */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-electric-blue to-deep-purple opacity-75 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Good evening, {user?.name || 'User'}!
          </h2>
          <p className="text-text-secondary text-sm">
            Ready to explore your personalized recommendations?
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Voice input toggle */}
        <Button
          variant="ghost"
          size="icon"
          className={`w-10 h-10 rounded-full transition-all duration-300 ${
            isListening 
              ? "bg-electric-blue/30 text-electric-blue pulse-ring" 
              : "bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30"
          }`}
          onClick={handleVoiceToggle}
        >
          <Mic size={16} />
        </Button>
        
        {/* Knowledge Graph toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full text-text-secondary hover:text-electric-blue hover:bg-electric-blue/20 transition-all duration-300"
          onClick={onToggleKnowledgeGraph}
        >
          <Brain size={16} />
        </Button>
        
        {/* Knowledge Graph Page Link */}
        <a href="/knowledge-graph">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full text-purple-400 hover:text-purple-300 hover:bg-purple-400/20 transition-all duration-300"
            title="Knowledge Graph"
          >
            <Network size={16} />
          </Button>
        </a>
        
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 rounded-full text-text-secondary hover:text-electric-blue hover:bg-electric-blue/20 transition-all duration-300"
        >
          <Bell size={16} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-electric-blue rounded-full" />
        </Button>
        
        {/* User profile */}
        <Avatar className="w-8 h-8 bg-gradient-to-br from-electric-blue to-deep-purple">
          <AvatarFallback className="bg-gradient-to-br from-electric-blue to-deep-purple text-white text-sm font-semibold">
            {user?.firstName && user?.lastName ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 
             user?.username ? user.username.slice(0, 2).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
