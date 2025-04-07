
import React, { useEffect, useState } from "react";
import { Redirect, useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

export default function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is authenticated via sessionStorage
    const adminAuthenticated = sessionStorage.getItem("adminAuthenticated");
    if (!adminAuthenticated) {
      setIsAuthenticated(false);
      setLocation("/admin-login");
    } else {
      setIsAuthenticated(true);
    }
  }, [setLocation]);

  // Show loading spinner while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect to="/admin-login" />;
  }

  // Render the protected component if authenticated
  return <Component />;
}
