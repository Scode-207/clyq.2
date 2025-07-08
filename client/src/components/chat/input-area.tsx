import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Image, Send, Utensils, Bed, Search, Route, BarChart3, X, Upload } from "lucide-react";
import { useVoice } from "@/hooks/use-voice";
import { useToast } from "@/hooks/use-toast";

interface InputAreaProps {
  onSendMessage: (content: string, type?: "text" | "voice" | "image") => void;
  onQuickAction: (action: string) => void;
}

export default function InputArea({ onSendMessage, onQuickAction }: InputAreaProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useVoice();
  const { toast } = useToast();

  // Handle voice transcript
  useEffect(() => {
    if (transcript && !isListening) {
      setMessage(transcript);
      clearTranscript();
    }
  }, [transcript, isListening, clearTranscript]);

  const handleSend = async () => {
    if (selectedImage) {
      // Handle image upload with optional text
      try {
        const base64Image = await convertImageToBase64(selectedImage);
        const content = message.trim() || "Please analyze this image";
        onSendMessage(`${content}|||IMAGE:${base64Image}`, "image");
        setMessage("");
        setSelectedImage(null);
        setImagePreview(null);
      } catch (error) {
        toast({
          title: "Error processing image",
          description: "Please try uploading a different image.",
          variant: "destructive",
        });
      }
    } else if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Extract base64 part (remove data:image/...;base64, prefix)
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const quickActions = [
    { id: 'find-restaurants', icon: Utensils, label: 'Find Restaurants' },
    { id: 'book-hotel', icon: Bed, label: 'Book Hotel' },
    { id: 'search-products', icon: Search, label: 'Search Products' },
    { id: 'compare-options', icon: BarChart3, label: 'Compare Options' },
  ];

  return (
    <div className="p-6 border-t border-border bg-black">
      <div className="max-w-5xl mx-auto">
        {/* Voice Input Status */}
        {isListening && (
          <div className="mb-3 flex items-center justify-center space-x-2 text-primary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm">Listening... speak now</span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
        )}
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-start gap-3">
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Upload preview" 
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-600 hover:bg-red-700 text-white rounded-full"
                  onClick={removeImage}
                >
                  <X size={12} />
                </Button>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-2">
                  <Upload className="w-4 h-4 inline mr-1" />
                  Ready to analyze: {selectedImage?.name}
                </p>
                <p className="text-xs text-gray-500">
                  Add a message or send as-is for AI analysis
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Input Container */}
        <div className="relative">
          <div className="gradient-border">
            <div className="gradient-border-inner flex items-center space-x-3">
              {/* Voice Input Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`w-10 h-10 rounded-full transition-all duration-300 ${
                  isListening 
                    ? "bg-primary/30 text-primary pulse-ring" 
                    : "bg-primary/20 text-primary hover:bg-primary/30"
                }`}
                onClick={handleVoiceToggle}
              >
                <Mic size={16} />
              </Button>
              
              {/* Text Input */}
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about food, travel, or shopping..."
                className="flex-1 bg-transparent border-none text-text-primary placeholder-text-placeholder outline-none focus-visible:ring-0 text-lg"
              />
              
              {/* Image Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                className={`w-10 h-10 rounded-full transition-all duration-300 ${
                  selectedImage 
                    ? "text-electric-blue bg-electric-blue/20" 
                    : "text-text-secondary hover:text-electric-blue hover:bg-electric-blue/20"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Image size={16} />
              </Button>
              
              {/* Send Button */}
              <Button
                size="icon"
                className="w-10 h-10 rounded-full bg-electric-blue hover:bg-electric-blue/80 transition-all duration-300 glow-hover"
                onClick={handleSend}
                disabled={!message.trim() && !selectedImage}
              >
                <Send className="text-white" size={16} />
              </Button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  className="text-text-secondary hover:text-electric-blue transition-colors"
                  onClick={() => onQuickAction(action.id)}
                >
                  <Icon size={14} className="mr-1" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
