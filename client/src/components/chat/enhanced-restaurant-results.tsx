import { RestaurantCard } from "./restaurant-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search } from "lucide-react";

interface EnhancedRestaurantResultsProps {
  data: {
    query: string;
    location: string;
    summary: string;
    restaurants: Array<{
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
      images: Array<{
        url: string;
        title: string;
        source: string;
        type: 'interior' | 'exterior' | 'food' | 'general';
      }>;
    }>;
    followUpQuestions?: string[];
  };
}

export function EnhancedRestaurantResults({ data }: EnhancedRestaurantResultsProps) {
  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-lg text-white">
              Restaurant Search Results
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>Searching for "{data.query}" in {data.location}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 text-sm leading-relaxed">
            {data.summary}
          </p>
          {data.restaurants.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-700">
                {data.restaurants.length} restaurants found
              </Badge>
              <Badge variant="secondary" className="bg-blue-900/30 text-blue-400 border-blue-700">
                Real-time data + Images
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restaurant Cards */}
      {data.restaurants.length > 0 ? (
        <div className="space-y-4">
          {data.restaurants.map((restaurant, index) => (
            <RestaurantCard key={index} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <CardContent className="py-8 text-center">
            <p className="text-gray-400">
              No restaurants found for your search criteria. Try a different location or cuisine type.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Follow-up Questions */}
      {data.followUpQuestions && data.followUpQuestions.length > 0 && (
        <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white">Explore More</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.followUpQuestions.map((question, index) => (
                <button
                  key={index}
                  className="block w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-800/50 transition-colors"
                  onClick={() => {
                    // This would trigger a new search with the follow-up question
                    console.log('Follow-up question clicked:', question);
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}