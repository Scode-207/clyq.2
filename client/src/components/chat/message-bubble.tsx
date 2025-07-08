import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { Message } from "@shared/schema";
import HotelCard from "@/components/commerce/hotel-card";
import RestaurantCard from "@/components/commerce/restaurant-card";
import ProductCard from "@/components/commerce/product-card";
import { RestaurantCard as EnhancedRestaurantCard } from "./restaurant-card";
import { EnhancedRestaurantResults } from "./enhanced-restaurant-results";
import ThinkingBar from "./thinking-bar";
import { TypewriterText } from "./typewriter-text";
import { Brain, User, Image as ImageIcon } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

function formatMarkdown(text: string): React.ReactElement[] {
  if (!text || typeof text !== 'string') {
    return [<p key={0}>No content available</p>];
  }

  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];
  let key = 0;
  let currentList: React.ReactElement[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(<ul key={key++} className="list-disc ml-4 mb-4 space-y-1">{currentList}</ul>);
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={key++} className="text-lg font-semibold text-white mb-3 mt-6 first:mt-0">{trimmedLine.slice(4)}</h3>);
    } else if (trimmedLine.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={key++} className="text-xl font-bold text-white mb-4 mt-6 first:mt-0">{trimmedLine.slice(3)}</h2>);
    } else if (trimmedLine.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={key++} className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">{trimmedLine.slice(2)}</h1>);
    } else if (trimmedLine.startsWith('- ')) {
      const listContent = trimmedLine.slice(2);
      const formattedContent = listContent
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-text-secondary">$1</em>')
        .replace(/💰|⭐|📍|🚚/g, '<span class="text-gray-400">$&</span>');
      currentList.push(<li key={key++} className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedContent }} />);
    } else if (trimmedLine) {
      flushList();
      // Handle bold and italic formatting
      const formattedLine = trimmedLine
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-text-secondary">$1</em>')
        .replace(/🍽️|✈️|🛍️|🎯|💰|⭐|📍|🚚/g, '<span class="text-gray-400">$&</span>');
      elements.push(<p key={key++} className="mb-3 text-gray-300 text-[22px] font-thin text-left" dangerouslySetInnerHTML={{ __html: formattedLine }} />);
    } else if (elements.length > 0 && !currentList.length) {
      elements.push(<div key={key++} className="mb-2" />);
    }
  });

  // Flush any remaining list items
  flushList();

  return elements.length > 0 ? elements : [<p key={0}>No content to display</p>];
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const timeAgo = message.createdAt ? formatDistanceToNow(message.createdAt, { addSuffix: true }) : "";
  const suggestions = message.metadata?.suggestions || [];
  const thinking = message.metadata?.thinking || "";

  // Extract image from user message if present
  let displayContent = message.content;
  let imageData = null;
  
  if (isUser && message.content.includes("|||IMAGE:")) {
    const [textPart, base64Image] = message.content.split("|||IMAGE:");
    displayContent = textPart || "Shared an image";
    if (base64Image) {
      imageData = `data:image/jpeg;base64,${base64Image}`;
    }
  }

  // Check if this message contains enhanced restaurant results
  const hasEnhancedRestaurantData = suggestions.some(s => s.data && s.data.images && Array.isArray(s.data.images));
  
  const renderSuggestion = (suggestion: any, index: number) => {
    switch (suggestion.type) {
      case "hotel":
        return <HotelCard key={index} hotel={suggestion.data} />;
      case "restaurant":
        // Check if this is enhanced restaurant data with images
        if (suggestion.data && suggestion.data.images && Array.isArray(suggestion.data.images)) {
          return <EnhancedRestaurantCard key={index} restaurant={suggestion.data} />;
        }
        return <RestaurantCard key={index} restaurant={suggestion.data} />;
      case "product":
        return <ProductCard key={index} product={suggestion.data} />;
      default:
        return (
          <div key={index} className="glass-effect rounded-xl p-4 border border-electric-blue/20">
            <h4 className="font-semibold text-text-primary mb-2">{suggestion.title}</h4>
            <p className="text-text-secondary text-sm">{suggestion.description}</p>
          </div>
        );
    }
  };

  return (
    <div className={`w-full py-6 px-4 ${isUser ? "bg-transparent" : "bg-transparent"}`}>
      <div className="max-w-5xl mx-auto">
        {/* User Message */}
        {isUser ? (
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
              <User className="text-white" size={16} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-white text-sm mb-3">You</div>
              <div className="text-gray-300 whitespace-pre-wrap leading-7 max-w-5xl">
                {/* Display text content */}
                {formatMarkdown(displayContent)}
                
                {/* Display uploaded image if present */}
                {imageData && (
                  <div className="mt-3 max-w-md">
                    <div className="relative group">
                      <img 
                        src={imageData} 
                        alt="Uploaded image" 
                        className="w-full rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                      />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <ImageIcon size={12} />
                        Uploaded Image
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* AI Message */
          (<div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
              <Brain className="text-white" size={16} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-white text-sm mb-3">CLYQ</div>
              
              {/* Thinking Bar for AI messages */}
              {thinking && (
                <div className="mb-4">
                  <ThinkingBar thinking={thinking} isVisible={true} />
                </div>
              )}
              
              <div className="max-w-5xl">
                <div className="text-gray-300 leading-7">
                  {formatMarkdown(message.content)}
                  
                  {/* Suggestion Cards */}
                  {suggestions.length > 0 && (
                    <div className="mt-8 grid gap-6">
                      {suggestions.map((suggestion, index) => renderSuggestion(suggestion, index))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>)
        )}
        
        {/* Timestamp */}
        <div className="text-gray-500 text-xs mt-3 ml-12">
          {timeAgo}
        </div>
      </div>
    </div>
  );
}
