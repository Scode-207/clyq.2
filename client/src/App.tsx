import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import ErrorBoundary from "@/components/error-boundary";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth-page";
import OnboardingPage from "@/pages/onboarding";
import Marketplace from "@/pages/marketplace";
import SellPage from "@/pages/sell";
import SocialFeed from "@/pages/social-feed";
import MediGroq from "@/pages/medigroq";
import BookingPage from "@/pages/booking-page";
import NotFound from "@/pages/not-found";
import EnhancedKnowledgeGraph from "@/pages/enhanced-knowledge-graph";
import TravelAgents from "@/pages/travel-agents";
import GroupTripPlanning from "@/pages/group-trip-planning";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/marketplace" component={Marketplace} />
      <ProtectedRoute path="/sell" component={SellPage} />
      <ProtectedRoute path="/social" component={SocialFeed} />
      <ProtectedRoute path="/medigroq" component={MediGroq} />
      <ProtectedRoute path="/booking" component={BookingPage} />
      <ProtectedRoute path="/knowledge-graph" component={EnhancedKnowledgeGraph} />
      <ProtectedRoute path="/travel-agents" component={TravelAgents} />
      <ProtectedRoute path="/group-trip-planning" component={GroupTripPlanning} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <div className="dark">
              <Toaster />
              <Router />
            </div>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
