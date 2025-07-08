import { useEffect, useState } from 'react';
import { Brain, Zap } from 'lucide-react';
import { useUserLearning } from '@/hooks/use-user-learning';

export function LearningIndicator() {
  const { isLearning } = useUserLearning();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (isLearning) {
      setShowIndicator(true);
    } else {
      // Hide indicator after a delay to show completion
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLearning]);

  if (!showIndicator) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 flex items-center space-x-2 animate-pulse">
        <div className="relative">
          <Brain className="h-4 w-4 text-blue-400" />
          {isLearning && (
            <div className="absolute -top-1 -right-1">
              <Zap className="h-3 w-3 text-yellow-400 animate-bounce" />
            </div>
          )}
        </div>
        <span className="text-xs text-blue-300 font-medium">
          {isLearning ? 'Learning patterns...' : 'Pattern learned!'}
        </span>
      </div>
    </div>
  );
}