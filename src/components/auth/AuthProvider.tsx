import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut, getIdTokenResult } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Define the context shape
interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [claims, setClaims] = useState<any>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        setIsEmailVerified(firebaseUser.emailVerified);

        // Get custom claims (for roles, etc)
        try {
          const tokenResult = await getIdTokenResult(firebaseUser, true);
          setClaims(tokenResult.claims);
        } catch {
          setClaims(undefined);
        }

        // Optionally, force sign out if email not verified
        // if (!firebaseUser.emailVerified) {
        //   await signOut(auth);
        //   navigate("/admin/login");
        // }
      } else {
        setIsEmailVerified(false);
        setClaims(undefined);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Secure sign out
  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setClaims(undefined);
    setIsEmailVerified(false);
    navigate("/admin/login");
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
