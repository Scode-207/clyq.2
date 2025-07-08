import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  className?: string;
}

export default function LoadingFallback({ 
  message = "Loading...", 
  className = "" 
}: LoadingFallbackProps) {
  return (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-electric-blue mx-auto mb-3" />
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  );
}

export function FullPageLoading({ message = "Loading application..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-electric-blue mx-auto mb-4" />
        <p className="text-white text-lg mb-2">CLYQ</p>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}