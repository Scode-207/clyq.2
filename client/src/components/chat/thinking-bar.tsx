import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Brain, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThinkingBarProps {
  thinking: string;
  isVisible: boolean;
}

export default function ThinkingBar({ thinking, isVisible }: ThinkingBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible || !thinking) return null;

  return (
    <div className="mb-3 w-full">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between text-text-secondary hover:text-electric-blue hover:bg-electric-blue/10 transition-all duration-200 p-3 h-auto rounded-lg border border-electric-blue/20"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Brain size={16} className="text-electric-blue animate-pulse" />
          <Zap size={12} className="text-electric-blue/60" />
          <span className="text-sm font-medium">Groq AI Thinking Process</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-text-secondary/60">
            {isExpanded ? 'Hide' : 'Show'}
          </span>
          {isExpanded ? (
            <ChevronDown size={16} className="text-electric-blue" />
          ) : (
            <ChevronRight size={16} className="text-electric-blue" />
          )}
        </div>
      </Button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-500 ease-in-out",
        isExpanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
      )}>
        <div className="glass-effect rounded-lg p-4 border border-electric-blue/30 bg-dark-surface/50">
          <div className="text-text-secondary text-sm whitespace-pre-wrap font-mono leading-relaxed tracking-wide max-h-80 overflow-y-auto">
            {thinking}
          </div>
        </div>
      </div>
    </div>
  );
}