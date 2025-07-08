import { useState, useEffect } from "react";
import { Sparkles, ChefHat, Plane, ShoppingBag, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function WelcomeWidget() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after initial animation
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div
        className="bg-[#111111] border border-gray-800/50 rounded-2xl p-8 max-w-lg mx-4 shadow-2xl transform transition-all duration-500"
        style={{
          background: "linear-gradient(135deg, #111111 0%, #0D0D0D 100%)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)"
        }}
      >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-2">
            Hello {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username || 'there'}
          </h2>
          
          <p className="text-gray-400 text-sm leading-relaxed">
            Hi! I'm your personal commerce agent. I can help you with:
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Food Ordering</h3>
                <p className="text-gray-400 text-xs leading-relaxed">Restaurant discovery, menu browsing, personalized recommendations</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Travel Planning</h3>
                <p className="text-gray-400 text-xs leading-relaxed">Flight searches, hotel bookings, itinerary management</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Marketplace</h3>
                <p className="text-gray-400 text-xs leading-relaxed">Product discovery, price comparison, authentic reviews</p>
              </div>
            </div>
        </div>

        {/* Personalized Note */}
        {user?.foodPreferences || user?.shoppingPreferences ? (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
            <p className="text-blue-200 text-xs leading-relaxed">
              Based on your preferences, I notice you prefer{' '}
              {user?.foodPreferences?.dietaryRestrictions?.includes('vegetarian') && (
                <span className="text-blue-400 font-medium">vegetarian options</span>
              )}
              {user?.foodPreferences?.dietaryRestrictions?.includes('healthy') && (
                <span className="text-blue-400 font-medium">healthy options</span>
              )}
              {user?.shoppingPreferences?.sustainabilityImportance >= 7 && (
                <span className="text-blue-400 font-medium"> and sustainable brands</span>
              )}
              {user?.location?.city && (
                <>. Living in <span className="text-blue-400 font-medium">{user.location.city}</span>, I'll focus on local recommendations.</>
              )}
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
            <p className="text-blue-200 text-xs leading-relaxed">
              I'll learn your preferences as we chat to provide personalized recommendations just for you.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
            <p className="text-white font-medium text-sm mb-4">
              What can I help you with today?
            </p>
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
            >
              Let's get started
            </button>
        </div>
      </div>
    </div>
  );
}