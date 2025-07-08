import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Network, 
  TrendingUp, 
  User, 
  Package, 
  Tag, 
  Award,
  Clock,
  BarChart3,
  Zap,
  Eye,
  RefreshCw
} from "lucide-react";

interface GraphNode {
  id: string;
  type: string;
  label: string;
  properties: any;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface GraphEdge {
  from: string;
  to: string;
  type: string;
  weight: number;
  properties: any;
  color: string;
  width: number;
}

interface UserProfile {
  interests: Array<{
    category: string;
    subcategory: string;
    strength: number;
  }>;
  recentBehavior: Array<{
    action: string;
    entityType: string;
    entityName: string;
    timestamp: string;
  }>;
  recommendations: Array<{
    type: string;
    category?: string;
    items: any[];
    reason: string;
  }>;
  behaviorPatterns: {
    mostActiveHours: string[];
    favoriteCategories: string[];
    purchasePatterns: string[];
    searchPatterns: string[];
  };
}

interface KnowledgeGraphVisualizationProps {
  userId: number;
  isVisible: boolean;
}

export function KnowledgeGraphVisualization({ userId, isVisible }: KnowledgeGraphVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[], edges: GraphEdge[] }>({ nodes: [], edges: [] });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const animationRef = useRef<number>(0);

  // Fetch knowledge graph data
  const fetchKnowledgeGraph = async () => {
    setIsLoading(true);
    try {
      const [graphResponse, profileResponse] = await Promise.all([
        fetch(`/api/knowledge-graph/visualization/${userId}`),
        fetch(`/api/knowledge-graph/profile/${userId}`)
      ]);

      if (graphResponse.ok && profileResponse.ok) {
        const graph = await graphResponse.json();
        const profile = await profileResponse.json();
        setGraphData(graph);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching knowledge graph:', error);
      setError('Failed to load knowledge graph data. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && userId) {
      fetchKnowledgeGraph();
    }
  }, [isVisible, userId]);

  // Canvas rendering and animation
  useEffect(() => {
    if (!isVisible || !canvasRef.current || graphData.nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Physics simulation variables
    let nodes = [...graphData.nodes];
    let edges = [...graphData.edges];
    
    // Apply forces and animate
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200 && distance > 0) {
            const force = 1000 / (distance * distance);
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            node1.x -= fx * 0.1;
            node1.y -= fy * 0.1;
            node2.x += fx * 0.1;
            node2.y += fy * 0.1;
          }
        }
      }

      // Apply attraction along edges
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        
        if (fromNode && toNode) {
          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const targetDistance = 150;
          
          if (distance > 0) {
            const force = (distance - targetDistance) * 0.1 * edge.weight;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            fromNode.x += fx * 0.1;
            fromNode.y += fy * 0.1;
            toNode.x -= fx * 0.1;
            toNode.y -= fy * 0.1;
          }
        }
      });

      // Keep nodes within bounds
      nodes.forEach(node => {
        node.x = Math.max(node.size, Math.min(canvas.width - node.size, node.x));
        node.y = Math.max(node.size, Math.min(canvas.height - node.size, node.y));
      });

      // Draw edges
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = edge.color + '80'; // Semi-transparent
          ctx.lineWidth = edge.width;
          ctx.stroke();
          
          // Draw edge labels for strong connections
          if (edge.weight > 2) {
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(edge.type, midX, midY);
          }
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = selectedNode?.id === node.id ? '#ffffff' : node.color;
        ctx.lineWidth = selectedNode?.id === node.id ? 3 : 1;
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.max(10, node.size / 3)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.size + 15);

        // Node type icon (simplified)
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        const icon = getNodeIcon(node.type);
        ctx.fillText(icon, node.x, node.y + 3);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle canvas clicks
    const handleCanvasClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const clickedNode = nodes.find(node => {
        const dx = x - node.x;
        const dy = y - node.y;
        return Math.sqrt(dx * dx + dy * dy) <= node.size;
      });
      
      setSelectedNode(clickedNode || null);
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleCanvasClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [graphData, isVisible, selectedNode]);

  const getNodeIcon = (nodeType: string): string => {
    const icons = {
      'user': '👤',
      'product': '📦',
      'category': '🏷️',
      'brand': '🏢',
      'feature': '⭐'
    };
    return icons[nodeType] || '●';
  };

  const getInterestColor = (strength: number): string => {
    if (strength >= 7) return 'bg-green-500';
    if (strength >= 4) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Knowledge Graph</h2>
            <p className="text-gray-400 text-sm">Your personalized AI insights</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchKnowledgeGraph}
          disabled={isLoading}
          className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="graph" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="graph" className="data-[state=active]:bg-purple-600">Graph View</TabsTrigger>
          <TabsTrigger value="interests" className="data-[state=active]:bg-purple-600">Interests</TabsTrigger>
          <TabsTrigger value="behavior" className="data-[state=active]:bg-purple-600">Behavior</TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-purple-600">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-400" />
                Interactive Knowledge Graph
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="w-full h-96 bg-gray-900 rounded-lg border border-gray-700"
                  style={{ cursor: 'pointer' }}
                />
                
                {selectedNode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-xs"
                  >
                    <h4 className="text-white font-semibold">{selectedNode.label}</h4>
                    <p className="text-gray-400 text-sm capitalize">{selectedNode.type}</p>
                    {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(selectedNode.properties).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="text-gray-500">{key}:</span>
                            <span className="text-gray-300 ml-1">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  <User className="w-3 h-3 mr-1" />
                  User Nodes
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  <Package className="w-3 h-3 mr-1" />
                  Products
                </Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                  <Tag className="w-3 h-3 mr-1" />
                  Categories
                </Badge>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                  <Award className="w-3 h-3 mr-1" />
                  Brands
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interests" className="space-y-4">
          {userProfile?.interests && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Your Interests Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProfile.interests.slice(0, 10).map((interest, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold capitalize">{interest.category}</h4>
                        <p className="text-gray-400 text-sm capitalize">{interest.subcategory}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-white font-bold">{interest.strength.toFixed(1)}/10</div>
                          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${getInterestColor(interest.strength)}`}
                              style={{ width: `${(interest.strength / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${getInterestColor(interest.strength)}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          {userProfile?.behaviorPatterns && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Active Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.behaviorPatterns.mostActiveHours.map((hour, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-400">
                        {hour}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-purple-400" />
                    Favorite Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.behaviorPatterns.favoriteCategories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-400">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Recent Purchases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userProfile.behaviorPatterns.purchasePatterns.slice(0, 5).map((item, index) => (
                      <div key={index} className="text-gray-300 text-sm">{item}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-yellow-400" />
                    Search Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userProfile.behaviorPatterns.searchPatterns.slice(0, 5).map((search, index) => (
                      <div key={index} className="text-gray-300 text-sm">{search}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {userProfile?.recommendations && (
            <div className="space-y-4">
              {userProfile.recommendations.map((rec, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      AI Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-3">{rec.reason}</p>
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 capitalize">
                      {rec.type.replace('_', ' ')}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}