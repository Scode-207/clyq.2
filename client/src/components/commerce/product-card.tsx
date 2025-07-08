import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Leaf, Award, Shield } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    category: string;
    brand: string;
    price: number;
    rating: number;
    reviews: number;
    sustainable: boolean;
    description: string;
    features?: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-400"} 
      />
    ));
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('recycled') || feature.toLowerCase().includes('sustainable')) {
      return <Leaf size={10} />;
    }
    if (feature.toLowerCase().includes('warranty') || feature.toLowerCase().includes('certified')) {
      return <Award size={10} />;
    }
    if (feature.toLowerCase().includes('bpa') || feature.toLowerCase().includes('safe')) {
      return <Shield size={10} />;
    }
    return null;
  };

  return (
    <div className="glass-effect rounded-xl p-4 border border-electric-blue/20">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-text-primary text-sm">{product.name}</h4>
        <span className="text-electric-blue font-bold">${product.price}</span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-secondary text-xs">{product.brand}</span>
        {product.sustainable && (
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            <Leaf size={8} className="mr-1" />
            Sustainable
          </Badge>
        )}
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex">
          {renderStars(product.rating)}
        </div>
        <span className="text-text-secondary text-xs">{product.rating} ({product.reviews.toLocaleString()})</span>
      </div>
      
      {product.features && product.features.length > 0 && (
        <div className="space-y-1 mb-3">
          {product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center space-x-1 text-xs text-text-secondary">
              {getFeatureIcon(feature)}
              <span>{feature}</span>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-text-secondary text-xs mb-3">{product.description}</p>
      
      <Button 
        className="w-full bg-electric-blue hover:bg-electric-blue/80 text-white transition-colors glow-hover text-sm"
        onClick={() => {
          // TODO: Implement product purchase
          console.log("Viewing product:", product.id);
        }}
      >
        View Product
      </Button>
    </div>
  );
}
