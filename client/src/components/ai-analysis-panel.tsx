import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, Target, Award, TrendingDown, CheckCircle, AlertTriangle, Zap, Star, DollarSign, Users, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ProductAnalysis {
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
  };
}

interface AIAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  analysis: ProductAnalysis | null;
  isLoading: boolean;
}

export function AIAnalysisPanel({ isOpen, onClose, productName, analysis, isLoading }: AIAnalysisPanelProps) {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'HIGHLY_RECOMMENDED': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'RECOMMENDED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'CONSIDER_ALTERNATIVES': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'NOT_RECOMMENDED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'HIGHLY_RECOMMENDED': return <Award className="w-5 h-5" />;
      case 'RECOMMENDED': return <CheckCircle className="w-5 h-5" />;
      case 'CONSIDER_ALTERNATIVES': return <AlertTriangle className="w-5 h-5" />;
      case 'NOT_RECOMMENDED': return <TrendingDown className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Product Analysis</h2>
                    <p className="text-gray-400 text-sm">{productName}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-400">Analyzing product across multiple platforms...</p>
                  </div>
                </div>
              ) : analysis ? (
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
                    <TabsTrigger value="pricing" className="data-[state=active]:bg-blue-600">Price Analysis</TabsTrigger>
                    <TabsTrigger value="features" className="data-[state=active]:bg-blue-600">Features</TabsTrigger>
                    <TabsTrigger value="competitors" className="data-[state=active]:bg-blue-600">Competitors</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* AI Recommendation */}
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Zap className="w-6 h-6 text-yellow-400" />
                          <CardTitle className="text-white">AI Recommendation</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className={`flex items-center gap-3 p-4 rounded-lg border ${getRecommendationColor(analysis.analysis.aiInsights.recommendation)}`}>
                          {getRecommendationIcon(analysis.analysis.aiInsights.recommendation)}
                          <span className="font-semibold">{analysis.analysis.aiInsights.recommendation.replace('_', ' ')}</span>
                        </div>
                        <p className="text-gray-300">{analysis.analysis.aiInsights.reasoning}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div className="bg-gray-900/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 font-semibold">Best Use Case</span>
                            </div>
                            <p className="text-gray-300 text-sm">{analysis.analysis.aiInsights.bestUseCase}</p>
                          </div>
                          
                          <div className="bg-gray-900/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 font-semibold">Target Audience</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {analysis.analysis.aiInsights.targetAudience.map((audience, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {audience}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Market Intelligence */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            <CardTitle className="text-white text-lg">Seasonal Trends</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 text-sm">{analysis.analysis.aiInsights.seasonalTrends}</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <CardTitle className="text-white text-lg">Future Outlook</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 text-sm">{analysis.analysis.aiInsights.futureOutlook}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-400" />
                          Multi-Platform Price Comparison
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(analysis.analysis.priceComparison).filter(([key]) => key !== 'bestPrice').map(([platform, price]) => (
                            <div key={platform} className={`p-4 rounded-lg border ${
                              platform === analysis.analysis.priceComparison.bestPrice.platform 
                                ? 'border-green-400 bg-green-400/10' 
                                : 'border-gray-600 bg-gray-800/30'
                            }`}>
                              <div className="text-center">
                                <p className="text-gray-400 text-sm capitalize">{platform}</p>
                                <p className="text-white font-bold text-lg">${typeof price === 'number' ? price.toFixed(2) : '---'}</p>
                                {platform === analysis.analysis.priceComparison.bestPrice.platform && (
                                  <Badge className="mt-1 bg-green-600 text-white">Best Price</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-semibold">Best Deal Found</span>
                          </div>
                          <p className="text-white">
                            Save <span className="font-bold text-green-400">${analysis.analysis.priceComparison.bestPrice.savings.toFixed(2)}</span> by buying from {analysis.analysis.priceComparison.bestPrice.platform}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-green-400 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Pros
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.analysis.featuresAnalysis.pros.map((pro, index) => (
                              <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-red-400 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Cons
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.analysis.featuresAnalysis.cons.map((con, index) => (
                              <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-blue-400 flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Unique Features
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.analysis.featuresAnalysis.uniqueFeatures.map((feature, index) => (
                              <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400" />
                          Overall Rating
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-white">
                            {analysis.analysis.featuresAnalysis.rating.toFixed(1)}
                          </div>
                          <div className="flex-1">
                            <Progress 
                              value={analysis.analysis.featuresAnalysis.rating * 20} 
                              className="h-3"
                            />
                          </div>
                          <div className="text-gray-400">
                            {analysis.analysis.featuresAnalysis.rating >= 4.5 ? 'Excellent' : 
                             analysis.analysis.featuresAnalysis.rating >= 4.0 ? 'Very Good' :
                             analysis.analysis.featuresAnalysis.rating >= 3.5 ? 'Good' : 'Average'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="competitors" className="space-y-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Similar Products Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analysis.analysis.competitorAnalysis.similarProducts.map((product, index) => (
                            <div key={index} className="border border-gray-600 rounded-lg p-4 bg-gray-900/30">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="text-white font-semibold">{product.name}</h4>
                                  <p className="text-gray-400 text-sm">{product.brand} • {product.platform}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-white font-bold text-lg">${product.price.toFixed(2)}</p>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-gray-300 text-sm">{product.rating.toFixed(1)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-green-900/20 p-3 rounded border border-green-700">
                                  <p className="text-green-400 font-semibold mb-1">Why it's better:</p>
                                  <p className="text-gray-300">{product.whyBetter}</p>
                                </div>
                                <div className="bg-red-900/20 p-3 rounded border border-red-700">
                                  <p className="text-red-400 font-semibold mb-1">Why it's worse:</p>
                                  <p className="text-gray-300">{product.whyWorse}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400">No analysis data available</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}