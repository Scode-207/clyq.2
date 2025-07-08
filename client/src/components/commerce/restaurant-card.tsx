import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, Leaf, Heart } from "lucide-react";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    location: string;
    rating: number;
    reviews: number;
    priceRange: string;
    dietary?: string[];
    description: string;
    delivery: boolean;
  };
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-400"} 
      />
    ));
  };

  const getDietaryIcon = (dietary: string) => {
    if (dietary.toLowerCase().includes('vegan') || dietary.toLowerCase().includes('vegetarian')) {
      return <Leaf size={10} />;
    }
    if (dietary.toLowerCase().includes('healthy') || dietary.toLowerCase().includes('organic')) {
      return <Heart size={10} />;
    }
    return null;
  };

  return (
    <div className="glass-effect rounded-xl p-3 border border-electric-blue/20">
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-medium text-text-primary">{restaurant.name}</h5>
        <div className="flex items-center space-x-2">
          <span className="text-electric-blue text-sm">{restaurant.priceRange}</span>
          <div className="flex items-center">
            <div className="flex mr-1">
              {renderStars(restaurant.rating)}
            </div>
            <span className="text-electric-blue text-sm">{restaurant.rating}★</span>
          </div>
        </div>
      </div>
      
      <p className="text-text-secondary text-xs mb-2">{restaurant.cuisine}</p>
      <p className="text-text-secondary text-xs mb-2">{restaurant.location}</p>
      
      {restaurant.dietary && restaurant.dietary.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {restaurant.dietary.slice(0, 3).map((diet, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
              {getDietaryIcon(diet)}
              <span className="ml-1">{diet}</span>
            </Badge>
          ))}
        </div>
      )}
      
      <p className="text-text-secondary text-xs mb-3">{restaurant.description}</p>
      
      <div className="flex items-center justify-between">
        {restaurant.delivery && (
          <div className="flex items-center text-electric-blue text-xs">
            <Truck size={10} className="mr-1" />
            Delivery
          </div>
        )}
        <Button 
          size="sm"
          variant="outline"
          className="text-electric-blue border-electric-blue hover:bg-electric-blue hover:text-white transition-colors text-xs"
          onClick={() => {
            // TODO: Implement restaurant exploration
            console.log("Exploring restaurant:", restaurant.id);
          }}
        >
          Explore
        </Button>
      </div>
    </div>
  );
}
