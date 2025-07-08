import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  width,
  height
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getDefaultFallback = () => {
    const w = width || 400;
    const h = height || 300;
    
    // Use a generic gradient as ultimate fallback
    if (alt.toLowerCase().includes('person') || alt.toLowerCase().includes('user') || alt.toLowerCase().includes('avatar')) {
      return `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=${w}&h=${h}&fit=crop&crop=face`;
    } else if (alt.toLowerCase().includes('travel') || alt.toLowerCase().includes('trip')) {
      return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=${w}&h=${h}&fit=crop`;
    } else if (alt.toLowerCase().includes('food') || alt.toLowerCase().includes('restaurant')) {
      return `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=${w}&h=${h}&fit=crop`;
    } else if (alt.toLowerCase().includes('product') || alt.toLowerCase().includes('item')) {
      return `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=${w}&h=${h}&fit=crop`;
    }
    
    return `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=${w}&h=${h}&fit=crop`;
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const displaySrc = hasError ? (fallbackSrc || getDefaultFallback()) : src;

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded" />
      )}
      <img
        src={displaySrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onError={handleError}
        onLoad={handleLoad}
        width={width}
        height={height}
      />
    </div>
  );
};

export default ImageWithFallback;