import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { callEdgeFunction } from "../lib/edge";
import type { Session, User } from "@supabase/supabase-js";

const EMAIL_DOMAIN = "mathmaster.local";

function usernameEmail(username: string) {
  return `${username.trim().toLowerCase()}@${EMAIL_DOMAIN}`;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (username: string, password: string) => Promise<{ error: string | null }>;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (username: string, password: string) => {
    // Sign up directly — email confirmation is disabled in Supabase settings,
    // so no edge function with service-role key is needed.
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: usernameEmail(username),
      password,
      options: {
        data: { username: username.trim().toLowerCase() },
      },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        return { error: "That username is already taken." };
      }
      return { error: signUpError.message };
    }

    // If sign-up returned a session, we're done (auto-confirmed)
    if (data?.session) {
      return { error: null };
    }

    // Fallback: explicitly sign in (shouldn't be needed with confirmation disabled)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: usernameEmail(username),
      password,
    });
    if (signInError) {
      return { error: "Account created but sign-in failed. Please try signing in." };
    }
    return { error: null };
  };


  const signIn = async (username: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: usernameEmail(username),
      password,
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("invalid login credentials")) {
        return { error: "Incorrect username or password." };
      }
      return { error: error.message };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
