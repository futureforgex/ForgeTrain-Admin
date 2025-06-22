import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/lib/amplifyServices";

// Define the context shape
interface AuthContextType {
  user: any | null;
  loading: boolean;
  isEmailVerified: boolean;
  signOutUser: () => Promise<void>;
  claims?: any; // For custom claims/roles
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isEmailVerified: false,
  signOutUser: async () => {},
  claims: undefined,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [claims, setClaims] = useState<any>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing authenticated user
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentAuthenticatedUser();
        if (currentUser) {
          setUser(currentUser);
          setIsEmailVerified(true);
          // Get user info for additional details
          const userInfo = await authService.getCurrentUserInfo();
          if (userInfo) {
            setClaims(userInfo.attributes);
          }
        }
      } catch (error) {
        console.log('No authenticated user found');
        setUser(null);
        setIsEmailVerified(false);
        setClaims(undefined);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Secure sign out
  const signOutUser = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setClaims(undefined);
      setIsEmailVerified(false);
      navigate("/admin/login");
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear local state even if server signout fails
      setUser(null);
      setClaims(undefined);
      setIsEmailVerified(false);
      navigate("/admin/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isEmailVerified,
        signOutUser,
        claims,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access
export function useAuth() {
  return useContext(AuthContext);
}
