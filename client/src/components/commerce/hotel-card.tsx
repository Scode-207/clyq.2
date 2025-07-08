import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Wifi, Car, Dumbbell, PawPrint } from "lucide-react";
import { useLocation } from "wouter";

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    location: string;
    price: number;
    rating: number;
    reviews: number;
    petFriendly: boolean;
    amenities?: string[];
    description: string;
    image?: string;
  };
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const [, setLocation] = useLocation();

  const handleBookNow = () => {
    const hotelData = encodeURIComponent(JSON.stringify(hotel));
    setLocation(`/booking?hotel=${hotelData}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-400"} 
      />
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('fitness')) return <Dumbbell size={12} />;
    if (amenity.toLowerCase().includes('wifi')) return <Wifi size={12} />;
    if (amenity.toLowerCase().includes('parking')) return <Car size={12} />;
    if (amenity.toLowerCase().includes('pet')) return <PawPrint size={12} />;
    return null;
  };

  return (
    <div className="glass-effect rounded-xl p-4 border border-electric-blue/20">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-text-primary">{hotel.name}</h4>
        <span className="text-electric-blue font-bold">${hotel.price}/night</span>
      </div>
      
      <p className="text-text-secondary text-sm mb-2">{hotel.location}</p>
      
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex">
          {renderStars(hotel.rating)}
        </div>
        <span className="text-text-secondary text-sm">{hotel.rating} ({hotel.reviews.toLocaleString()} reviews)</span>
        {hotel.petFriendly && (
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            <PawPrint size={10} className="mr-1" />
            Pet-Friendly
          </Badge>
        )}
      </div>
      
      {hotel.amenities && hotel.amenities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center space-x-1 text-xs text-text-secondary">
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-text-secondary text-sm mb-3">{hotel.description}</p>
      
      <Button 
        className="w-full bg-electric-blue hover:bg-electric-blue/80 text-white transition-colors glow-hover"
        onClick={handleBookNow}
      >
        Book Now
      </Button>
    </div>
  );
}
