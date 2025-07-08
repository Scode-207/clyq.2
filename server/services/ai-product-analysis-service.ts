import { GoogleGenerativeAI } from '@google/generative-ai';

interface ProductComparison {
  productId: string;
  productName: string;
  analysis: {
    priceComparison: {
      amazon: number;
      flipkart: number;
      myntra?: number;
      ajio?: number;
      bestPrice: {
        platform: string;
        price: number;
        savings: number;
      };
    };
    featuresAnalysis: {
      pros: string[];
      cons: string[];
      uniqueFeatures: string[];
      rating: number;
    };
    competitorAnalysis: {
      similarProducts: Array<{
        name: string;
        brand: string;
        price: number;
        platform: string;
        rating: number;
        whyBetter: string;
        whyWorse: string;
      }>;
    };
    aiInsights: {
      recommendation: 'HIGHLY_RECOMMENDED' | 'RECOMMENDED' | 'CONSIDER_ALTERNATIVES' | 'NOT_RECOMMENDED';
      reasoning: string;
      bestUseCase: string;
      targetAudience: string[];
      seasonalTrends: string;
      futureOutlook: string;
    };
    marketIntelligence: {
      priceHistory: Array<{
        date: string;
        price: number;
        platform: string;
      }>;
      demandAnalysis: string;
      competitivePosition: string;
      marketShare: string;
    };
  };
}

interface MultiPlatformSearch {
  query: string;
  platforms: {
    amazon: ProductSearchResult[];
    flipkart: ProductSearchResult[];
    myntra: ProductSearchResult[];
    ajio: ProductSearchResult[];
  };
  aiSummary: {
    bestOverallDeal: {
      productName: string;
      platform: string;
      price: number;
      reasoning: string;
    };
    categoryInsights: string;
    trendingFeatures: string[];
    priceRangeAnalysis: string;
  };
}

interface ProductSearchResult {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  brand: string;
  imageUrl: string;
  features: string[];
  platform: string;
  inStock: boolean;
  prime?: boolean;
  sustainable?: boolean;
}

export class AIProductAnalysisService {
  private ai: GoogleGenerativeAI;
  
  constructor() {
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.warn('GOOGLE_AI_API_KEY not set. AI analysis features will be limited.');
    } else {
      this.ai = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    }
  }

  async analyzeProductWithComparison(productId: string, productName: string): Promise<ProductComparison> {
    try {
      // Generate mock platform data with realistic pricing variations
      const platformPrices = this.generateMultiPlatformPricing(productName);
      const competitorProducts = this.generateCompetitorProducts(productName);
      
      if (!this.ai) {
        return this.generateMockAnalysis(productId, productName, platformPrices, competitorProducts);
      }

      const model = this.ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
      Analyze this product comprehensively: "${productName}"
      
      Platform Prices:
      - Amazon: $${platformPrices.amazon}
      - Flipkart: ₹${Math.round(platformPrices.flipkart * 83)} (≈$${platformPrices.flipkart})
      - Myntra: ₹${Math.round(platformPrices.myntra * 83)} (≈$${platformPrices.myntra})
      - Ajio: ₹${Math.round(platformPrices.ajio * 83)} (≈$${platformPrices.ajio})

      Provide a comprehensive analysis including:
      1. Price comparison insights
      2. Feature analysis (pros/cons)
      3. Market positioning
      4. AI-powered recommendations
      5. Target audience analysis
      6. Seasonal trends
      7. Future outlook
      
      Return structured analysis focusing on value proposition and market intelligence.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      return this.parseAIAnalysis(productId, productName, platformPrices, competitorProducts, response);
      
    } catch (error) {
      console.error('AI Analysis error:', error);
      const platformPrices = this.generateMultiPlatformPricing(productName);
      const competitorProducts = this.generateCompetitorProducts(productName);
      return this.generateMockAnalysis(productId, productName, platformPrices, competitorProducts);
    }
  }

  async searchMultiPlatform(query: string): Promise<MultiPlatformSearch> {
    const platforms = {
      amazon: this.generatePlatformResults(query, 'Amazon', 6),
      flipkart: this.generatePlatformResults(query, 'Flipkart', 6),
      myntra: this.generatePlatformResults(query, 'Myntra', 4),
      ajio: this.generatePlatformResults(query, 'Ajio', 4)
    };

    const allResults = [
      ...platforms.amazon,
      ...platforms.flipkart,
      ...platforms.myntra,
      ...platforms.ajio
    ];

    const bestDeal = allResults.reduce((best, current) => 
      current.price < best.price ? current : best
    );

    return {
      query,
      platforms,
      aiSummary: {
        bestOverallDeal: {
          productName: bestDeal.name,
          platform: bestDeal.platform,
          price: bestDeal.price,
          reasoning: `Best value with ${bestDeal.rating}★ rating and ${bestDeal.platform === 'Amazon' ? 'Prime delivery' : 'competitive pricing'}`
        },
        categoryInsights: this.generateCategoryInsights(query),
        trendingFeatures: this.getTrendingFeatures(query),
        priceRangeAnalysis: this.analyzePriceRange(allResults)
      }
    };
  }

  private generateMultiPlatformPricing(productName: string) {
    const basePrice = this.estimateBasePrice(productName);
    return {
      amazon: basePrice,
      flipkart: basePrice * (0.85 + Math.random() * 0.3), // Flipkart often has different pricing
      myntra: basePrice * (0.9 + Math.random() * 0.25),   // Myntra for fashion items
      ajio: basePrice * (0.88 + Math.random() * 0.28)     // Ajio competitive pricing
    };
  }

  private estimateBasePrice(productName: string): number {
    const lowerName = productName.toLowerCase();
    if (lowerName.includes('iphone') || lowerName.includes('macbook')) return 999 + Math.random() * 1500;
    if (lowerName.includes('samsung') || lowerName.includes('galaxy')) return 699 + Math.random() * 800;
    if (lowerName.includes('nike') || lowerName.includes('adidas')) return 80 + Math.random() * 200;
    if (lowerName.includes('headphones') || lowerName.includes('airpods')) return 150 + Math.random() * 400;
    if (lowerName.includes('laptop') || lowerName.includes('computer')) return 800 + Math.random() * 2000;
    return 50 + Math.random() * 500;
  }

  private generateCompetitorProducts(productName: string) {
    const category = this.detectProductCategory(productName);
    return this.getCompetitorsForCategory(category);
  }

  private detectProductCategory(productName: string): string {
    const lowerName = productName.toLowerCase();
    if (lowerName.includes('iphone') || lowerName.includes('phone') || lowerName.includes('smartphone')) return 'smartphones';
    if (lowerName.includes('laptop') || lowerName.includes('macbook') || lowerName.includes('computer')) return 'laptops';
    if (lowerName.includes('headphones') || lowerName.includes('airpods') || lowerName.includes('earbuds')) return 'audio';
    if (lowerName.includes('nike') || lowerName.includes('adidas') || lowerName.includes('sneakers')) return 'footwear';
    if (lowerName.includes('jacket') || lowerName.includes('shirt') || lowerName.includes('jeans')) return 'fashion';
    return 'general';
  }

  private getCompetitorsForCategory(category: string) {
    const competitors = {
      smartphones: [
        { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', basePrice: 1099 },
        { name: 'Google Pixel 8 Pro', brand: 'Google', basePrice: 899 },
        { name: 'OnePlus 12', brand: 'OnePlus', basePrice: 799 }
      ],
      laptops: [
        { name: 'Dell XPS 13', brand: 'Dell', basePrice: 1199 },
        { name: 'HP Spectre x360', brand: 'HP', basePrice: 1099 },
        { name: 'Lenovo ThinkPad X1', brand: 'Lenovo', basePrice: 1299 }
      ],
      audio: [
        { name: 'Bose QuietComfort 45', brand: 'Bose', basePrice: 329 },
        { name: 'Sennheiser Momentum 4', brand: 'Sennheiser', basePrice: 349 },
        { name: 'Audio-Technica ATH-M50x', brand: 'Audio-Technica', basePrice: 149 }
      ],
      footwear: [
        { name: 'Puma RS-X3', brand: 'Puma', basePrice: 120 },
        { name: 'New Balance 990v5', brand: 'New Balance', basePrice: 185 },
        { name: 'Vans Old Skool', brand: 'Vans', basePrice: 65 }
      ],
      fashion: [
        { name: 'Uniqlo Ultra Light Down', brand: 'Uniqlo', basePrice: 69 },
        { name: 'H&M Conscious Collection', brand: 'H&M', basePrice: 45 },
        { name: 'Zara Premium Denim', brand: 'Zara', basePrice: 89 }
      ],
      general: [
        { name: 'Generic Alternative A', brand: 'Brand A', basePrice: 99 },
        { name: 'Generic Alternative B', brand: 'Brand B', basePrice: 129 },
        { name: 'Generic Alternative C', brand: 'Brand C', basePrice: 79 }
      ]
    };

    return competitors[category] || competitors.general;
  }

  private generateMockAnalysis(productId: string, productName: string, platformPrices: any, competitors: any[]): ProductComparison {
    const bestPrice = Math.min(platformPrices.amazon, platformPrices.flipkart, platformPrices.myntra, platformPrices.ajio);
    const bestPlatform = Object.entries(platformPrices).find(([_, price]) => price === bestPrice)?.[0] || 'amazon';
    const savings = Math.max(...Object.values(platformPrices)) - bestPrice;

    return {
      productId,
      productName,
      analysis: {
        priceComparison: {
          amazon: platformPrices.amazon,
          flipkart: platformPrices.flipkart,
          myntra: platformPrices.myntra,
          ajio: platformPrices.ajio,
          bestPrice: {
            platform: bestPlatform,
            price: bestPrice,
            savings: savings
          }
        },
        featuresAnalysis: {
          pros: [
            "Premium build quality and materials",
            "Excellent performance benchmarks",
            "Strong brand reputation and warranty",
            "Positive user reviews and ratings"
          ],
          cons: [
            "Higher price point compared to alternatives",
            "Limited color/variant options",
            "May require additional accessories"
          ],
          uniqueFeatures: [
            "Industry-leading specifications",
            "Exclusive brand features",
            "Advanced technology integration"
          ],
          rating: 4.5 + Math.random() * 0.5
        },
        competitorAnalysis: {
          similarProducts: competitors.map(comp => ({
            name: comp.name,
            brand: comp.brand,
            price: comp.basePrice * (0.9 + Math.random() * 0.2),
            platform: ['Amazon', 'Flipkart'][Math.floor(Math.random() * 2)],
            rating: 4.0 + Math.random() * 1.0,
            whyBetter: "More affordable with similar features",
            whyWorse: "Lower brand recognition and build quality"
          }))
        },
        aiInsights: {
          recommendation: bestPrice < 200 ? 'HIGHLY_RECOMMENDED' : 'RECOMMENDED',
          reasoning: `Strong value proposition with competitive pricing across platforms. ${bestPlatform} offers the best deal with significant savings.`,
          bestUseCase: "Perfect for users seeking premium quality with reliable performance",
          targetAudience: ["Tech enthusiasts", "Professional users", "Quality-conscious consumers"],
          seasonalTrends: "Prices typically drop 15-20% during major sale events (Black Friday, Prime Day)",
          futureOutlook: "Expected to maintain value well with potential price improvements as newer models release"
        },
        marketIntelligence: {
          priceHistory: [
            { date: "2024-12", price: platformPrices.amazon * 1.1, platform: "Amazon" },
            { date: "2024-11", price: platformPrices.amazon * 1.05, platform: "Amazon" },
            { date: "2024-10", price: platformPrices.amazon, platform: "Amazon" }
          ],
          demandAnalysis: "High demand with consistent sales velocity across all platforms",
          competitivePosition: "Market leader in its category with strong differentiation",
          marketShare: "Holds 25-30% market share in premium segment"
        }
      }
    };
  }

  private parseAIAnalysis(productId: string, productName: string, platformPrices: any, competitors: any[], aiResponse: string): ProductComparison {
    // For now, return structured mock data - in production, this would parse the AI response
    return this.generateMockAnalysis(productId, productName, platformPrices, competitors);
  }

  private generatePlatformResults(query: string, platform: string, count: number): ProductSearchResult[] {
    const results: ProductSearchResult[] = [];
    const basePrice = this.estimateBasePrice(query);
    
    for (let i = 0; i < count; i++) {
      results.push({
        id: `${platform.toLowerCase()}-${query.replace(/\s+/g, '-')}-${i + 1}`,
        name: `${query} ${platform} Model ${i + 1}`,
        price: basePrice * (0.8 + Math.random() * 0.6),
        originalPrice: basePrice * (1.1 + Math.random() * 0.3),
        rating: 3.5 + Math.random() * 1.5,
        reviews: Math.floor(Math.random() * 50000) + 1000,
        brand: ['Samsung', 'Apple', 'Sony', 'LG', 'Nike', 'Adidas'][Math.floor(Math.random() * 6)],
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000000)}?w=400&h=400&fit=crop`,
        features: ["Feature 1", "Feature 2", "Feature 3"],
        platform,
        inStock: Math.random() > 0.1,
        prime: platform === 'Amazon' && Math.random() > 0.3,
        sustainable: Math.random() > 0.7
      });
    }
    
    return results;
  }

  private generateCategoryInsights(query: string): string {
    const insights = [
      `${query} category shows 23% growth in online sales this quarter`,
      `Premium models in ${query} segment seeing increased demand`,
      `Sustainable options in ${query} gaining 40% more interest`,
      `AI-powered features becoming standard in ${query} products`
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private getTrendingFeatures(query: string): string[] {
    const allFeatures = [
      "AI Integration", "Sustainable Materials", "Fast Charging", "Wireless Connectivity",
      "Smart Features", "Premium Build", "Long Battery Life", "Voice Control",
      "App Integration", "Cloud Sync", "Advanced Security", "Customizable Settings"
    ];
    return allFeatures.slice(0, 3 + Math.floor(Math.random() * 3));
  }

  private analyzePriceRange(results: ProductSearchResult[]): string {
    const prices = results.map(r => r.price).sort((a, b) => a - b);
    const min = prices[0];
    const max = prices[prices.length - 1];
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    return `Price range: $${min.toFixed(2)} - $${max.toFixed(2)} (Avg: $${avg.toFixed(2)}). Best deals found on Flipkart and Amazon.`;
  }
}

export const aiProductAnalysisService = new AIProductAnalysisService();