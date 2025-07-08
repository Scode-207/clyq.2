import { Star, MapPin, Phone, Clock, ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ImageWithFallback from "@/components/image-with-fallback";

interface RestaurantImage {
  url: string;
  title: string;
  source: string;
  type: 'interior' | 'exterior' | 'food' | 'general';
}

interface RestaurantCardProps {
  restaurant: {
    name: string;
    rating?: number;
    priceRange?: string;
    cuisine?: string;
    address: string;
    phone?: string;
    hours?: string;
    website?: string;
    description: string;
    features: string[];
    reviews: string[];
    images: RestaurantImage[];
  };
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const primaryImage = restaurant.images?.[0];
  const additionalImages = restaurant.images?.slice(1, 3) || [];

  const handleDirections = () => {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address}`);
    window.open(`https://maps.google.com/?q=${query}`, '_blank');
  };

  const handleCall = () => {
    if (restaurant.phone) {
      window.open(`tel:${restaurant.phone}`, '_self');
    }
  };

  const handleWebsite = () => {
    if (restaurant.website) {
      window.open(restaurant.website, '_blank');
    }
  };

  return (
    <Card className="overflow-hidden border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{restaurant.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              {restaurant.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-300">{restaurant.rating}</span>
                </div>
              )}
              {restaurant.priceRange && (
                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                  {restaurant.priceRange}
                </Badge>
              )}
              {restaurant.cuisine && (
                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                  {restaurant.cuisine}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDirections}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <MapPin className="w-4 h-4" />
            </Button>
            {restaurant.phone && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCall}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}
            {restaurant.website && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleWebsite}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Image */}
        {primaryImage && (
          <div className="relative overflow-hidden rounded-lg">
            <ImageWithFallback
              src={primaryImage.url}
              alt={primaryImage.title || restaurant.name}
              className="w-full h-48 object-cover"
              width={400}
              height={192}
            />
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-black/70 text-white text-xs">
                {primaryImage.type}
              </Badge>
            </div>
          </div>
        )}

        {/* Additional Images */}
        {additionalImages.length > 0 && (
          <div className="flex gap-2">
            {additionalImages.map((image, index) => (
              <div key={index} className="relative flex-1 overflow-hidden rounded-md">
                <ImageWithFallback
                  src={image.url}
                  alt={image.title || `${restaurant.name} photo`}
                  className="w-full h-20 object-cover"
                  width={80}
                  height={80}
                />
              </div>
            ))}
          </div>
        )}

        {/* Restaurant Info */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{restaurant.address}</span>
          </div>

          {restaurant.hours && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{restaurant.hours}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {restaurant.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Features</h4>
            <div className="flex flex-wrap gap-1">
              {restaurant.features.slice(0, 6).map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-gray-800 text-gray-300"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {restaurant.description && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400 line-clamp-3">
              {restaurant.description}
            </p>
          </div>
        )}

        {/* Reviews Preview */}
        {restaurant.reviews.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Recent Reviews</h4>
            <div className="space-y-1">
              {restaurant.reviews.slice(0, 2).map((review, index) => (
                <blockquote
                  key={index}
                  className="text-xs text-gray-400 italic border-l-2 border-gray-700 pl-2"
                >
                  "{review}"
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={handleDirections}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Directions
          </Button>
          {restaurant.website && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleWebsite}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Website
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}