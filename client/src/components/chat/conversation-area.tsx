import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import MessageBubble from "./message-bubble";
import InputArea from "./input-area";
import { Button } from "@/components/ui/button";
import { Brain, Utensils, Plane, ShoppingBag, Stethoscope, BarChart3 } from "lucide-react";
import { LearningIndicator } from "@/components/learning/learning-indicator";
import { useUserLearning } from "@/hooks/use-user-learning";
import { useAuth } from "@/hooks/use-auth";

interface ConversationAreaProps {
  conversationId: number | null;
  domain?: "food" | "travel" | "marketplace" | "medical";
}

export default function ConversationArea({ conversationId, domain }: ConversationAreaProps) {
  const { messages, isLoading, isError, error, isTyping, sendMessage } = useChat(conversationId);
  const { learnFromInteraction } = useUserLearning();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages]);

  const handleSendMessage = async (content: string, type: "text" | "voice" | "image" = "text") => {
    setShowWelcome(false);
    
    // Learn from user interaction
    learnFromInteraction(content, {
      domain,
      timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening',
      responseTime: Date.now()
    });
    
    await sendMessage(content, type, domain);
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      'find-restaurants': "Show me healthy restaurants near me",
      'book-hotel': "Help me find a pet-friendly hotel",
      'search-products': "Find sustainable outdoor gear",
      'plan-trip': "Plan a weekend trip to San Francisco",
      'find-doctors': "Find doctors and medical facilities near me",
      'search-pharmacy': "Find pharmacies with medication prices",
      'compare-options': "Compare restaurants by price, rating, and reviews",
      'compare-hotels': "Compare hotels with pricing and amenities",
      'compare-products': "Compare product prices across different stores"
    };
    
    const message = actionMessages[action as keyof typeof actionMessages];
    if (message) {
      handleSendMessage(message);
    }
  };

  // Debug logging
  console.log('ConversationArea Debug:', {
    conversationId,
    messagesLength: messages?.length || 0,
    isLoading,
    isError,
    error: error?.message,
    messages: messages?.slice(0, 2) // Show first 2 messages for debugging
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-text-secondary">Loading conversation...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-400">Error loading messages: {error?.message || 'Unknown error'}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#151515]">
      {/* Learning Indicator */}
      <LearningIndicator />
      
      {/* Messages Container - Scrollable */}
      <div className="flex-1 overflow-y-auto conversation-scroll px-4 py-8" style={{ scrollBehavior: 'smooth' }}>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Welcome Message */}
          {showWelcome && (
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0 neural-glow">
                <Brain className="text-primary-foreground" size={18} />
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="glass-card ambient-glow rounded-2xl rounded-tl-sm p-6 border border-primary/20">
                  <p className="text-foreground mb-4 text-base leading-7">
                    Hi {user?.firstName ? `${user.firstName}` : user?.username || 'there'}! I'm your personal commerce agent. I can help you with:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="glass-card rounded-xl p-4 border border-primary/20 hover:border-primary/40 transition-all duration-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Utensils className="text-primary neural-glow" size={18} />
                        <span className="font-semibold text-foreground">Food Ordering</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-6">Restaurant discovery, menu browsing, personalized recommendations</p>
                    </div>
                    <div className="glass-card rounded-xl p-4 border border-primary/20 hover:border-primary/40 transition-all duration-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Plane className="text-primary neural-glow" size={18} />
                        <span className="font-semibold text-foreground">Travel Planning</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-6">Flight searches, hotel bookings, itinerary management</p>
                    </div>
                    <div className="glass-card rounded-xl p-4 border border-primary/20 hover:border-primary/40 transition-all duration-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <ShoppingBag className="text-primary neural-glow" size={18} />
                        <span className="font-semibold text-foreground">Marketplace</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-6">Product discovery, price comparison, authentic reviews</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mt-4">
                    Based on your preferences, I notice you prefer healthy options and sustainable brands. What can I help you with today?
                  </p>
                </div>
                <span className="text-muted-foreground text-xs ml-4 mt-2 block">Just now</span>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-8">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0 neural-glow">
                <Brain className="text-primary-foreground" size={18} />
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="glass-card ambient-glow rounded-2xl rounded-tl-sm p-4 border border-primary/20">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce neural-glow"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce neural-glow" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce neural-glow" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-muted-foreground text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0">
        <InputArea 
          onSendMessage={handleSendMessage}
          onQuickAction={handleQuickAction}
        />
      </div>
    </div>
  );
}
