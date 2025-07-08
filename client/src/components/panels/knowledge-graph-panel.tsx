import { Button } from "@/components/ui/button";
import { X, Heart, Clock, Brain, MapPin, Utensils, ShoppingBag, Plane } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

interface KnowledgeGraphPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KnowledgeGraphPanel({ isOpen, onClose }: KnowledgeGraphPanelProps) {
  const { user } = useAuth();

  const recentActivities = [
    {
      id: 1,
      type: "food",
      action: "Ordered from Green Table",
      time: "2 days ago",
      icon: "🥗",
      color: "green"
    },
    {
      id: 2,
      type: "travel",
      action: "Booked Seattle trip",
      time: "1 week ago",
      icon: "✈️",
      color: "blue"
    },
    {
      id: 3,
      type: "shopping",
      action: "Bought Patagonia backpack",
      time: "2 weeks ago",
      icon: "🎒",
      color: "purple"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-dark-surface border-l border-gray-800 flex flex-col">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Your Profile</h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-text-secondary hover:text-electric-blue transition-colors"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </div>
        
        {/* User Preferences */}
        <div className="space-y-4">
          <div className="glass-effect rounded-xl p-4">
            <h4 className="font-medium mb-3 flex items-center text-text-primary">
              <Heart className="text-electric-blue mr-2" size={16} />
              Preferences
            </h4>
            <div className="space-y-3">
              {/* Location */}
              {user?.location && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary flex items-center gap-2">
                    <MapPin size={14} />
                    Location
                  </span>
                  <span className="text-sm text-electric-blue">
                    {user.location.city}, {user.location.state}
                  </span>
                </div>
              )}
              
              {/* Food Preferences */}
              {user?.foodPreferences && (
                <div className="space-y-1">
                  <span className="text-sm text-text-secondary flex items-center gap-2">
                    <Utensils size={14} />
                    Food Preferences
                  </span>
                  {user.foodPreferences.favoriteCuisines?.length > 0 && (
                    <div className="ml-6 text-xs text-electric-blue">
                      Cuisines: {user.foodPreferences.favoriteCuisines.join(', ')}
                    </div>
                  )}
                  {user.foodPreferences.dietaryRestrictions?.length > 0 && (
                    <div className="ml-6 text-xs text-electric-blue">
                      Dietary: {user.foodPreferences.dietaryRestrictions.join(', ')}
                    </div>
                  )}
                  {user.foodPreferences.spicePreference && (
                    <div className="ml-6 text-xs text-electric-blue">
                      Spice: {user.foodPreferences.spicePreference}
                    </div>
                  )}
                </div>
              )}
              
              {/* Travel Preferences */}
              {user?.travelPreferences && (
                <div className="space-y-1">
                  <span className="text-sm text-text-secondary flex items-center gap-2">
                    <Plane size={14} />
                    Travel Preferences
                  </span>
                  {user.travelPreferences.accommodationType?.length > 0 && (
                    <div className="ml-6 text-xs text-electric-blue">
                      Stay: {user.travelPreferences.accommodationType.join(', ')}
                    </div>
                  )}
                  {user.travelPreferences.preferredDestinations?.length > 0 && (
                    <div className="ml-6 text-xs text-electric-blue">
                      Destinations: {user.travelPreferences.preferredDestinations.join(', ')}
                    </div>
                  )}
                  {user.travelPreferences.budget && (
                    <div className="ml-6 text-xs text-electric-blue">
                      Budget: {user.travelPreferences.budget}
                    </div>
                  )}
                </div>
              )}
              
              {/* Shopping Preferences */}
              {user?.shoppingPreferences && (
                <div className="space-y-1">
                  <span className="text-sm text-text-secondary flex items-center gap-2">
                    <ShoppingBag size={14} />
                    Shopping Preferences
                  </span>
                  {user.shoppingPreferences.favoriteCategories?.length > 0 && (
                    <div className="ml-6 text-xs text-electric-blue">
                      Categories: {user.shoppingPreferences.favoriteCategories.join(', ')}
                    </div>
                  )}
                  {user.shoppingPreferences.budgetRange && (
                    <div className="ml-6 text-xs text-electric-blue">
                      Budget: {user.shoppingPreferences.budgetRange}
                    </div>
                  )}
                  {user.shoppingPreferences.sustainabilityImportance && (
                    <div className="ml-6 text-xs text-electric-blue">
                      Sustainability: {user.shoppingPreferences.sustainabilityImportance}/10
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="glass-effect rounded-xl p-4">
            <h4 className="font-medium mb-3 flex items-center text-text-primary">
              <Clock className="text-electric-blue mr-2" size={16} />
              Recent Activity
            </h4>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-${activity.color}-500/20 flex items-center justify-center`}>
                    <span className="text-sm">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">{activity.action}</p>
                    <p className="text-xs text-text-placeholder">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Knowledge Graph Visualization */}
          <div className="glass-effect rounded-xl p-4">
            <h4 className="font-medium mb-3 flex items-center text-text-primary">
              <Brain className="text-electric-blue mr-2" size={16} />
              Knowledge Graph
            </h4>
            <div className="h-32 bg-dark-primary rounded-lg flex items-center justify-center border border-electric-blue/20">
              <div className="text-center">
                <Brain className="text-electric-blue mx-auto mb-2" size={24} />
                <p className="text-text-placeholder text-sm">Interactive graph visualization</p>
                <p className="text-text-placeholder text-xs mt-1">
                  {user?.knowledgeGraph?.nodes?.length || 0} nodes, {user?.knowledgeGraph?.edges?.length || 0} connections
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
