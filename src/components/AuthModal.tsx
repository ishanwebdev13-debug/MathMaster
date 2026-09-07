import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, User, Lock, Eye, EyeOff, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIsSignUp?: boolean;
}

export default function AuthModal({ isOpen, onClose, defaultIsSignUp = true }: AuthModalProps) {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sync default state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSignUp(defaultIsSignUp);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setError(null);
    }
  }, [isOpen, defaultIsSignUp]);

  const handleUsernameChange = (value: string) => {
    setUsername(value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!USERNAME_RE.test(username)) {
      setError("Username must be 3–20 characters using letters, numbers, or underscores.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { error: authError } = isSignUp
      ? await signUp(username, password)
      : await signIn(username, password);
    setLoading(false);

    if (authError) {
      setError(authError);
    } else {
      onClose();
      navigate("/learn", { replace: true });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-foreground/50 hover:text-foreground transition-colors cursor-pointer z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-6 sm:p-8">
                <div className="text-center mb-8">
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    {isSignUp ? "Create an Account" : "Welcome Back"}
                  </h2>
                  <p className="font-sans text-sm text-foreground/60 mt-1">
                    {isSignUp
                      ? "Start mastering math today."
                      : "Sign in to continue learning."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Username */}
                  <div>
                    <label
                      htmlFor="modal-username"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input
                        id="modal-username"
                        type="text"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="e.g. math_wiz"
                        autoComplete="username"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="modal-password"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input
                        id="modal-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        placeholder={isSignUp ? "At least 6 characters" : "Your password"}
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <AnimatePresence>
                    {isSignUp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <label
                          htmlFor="modal-confirm"
                          className="block text-sm font-medium text-foreground mb-1.5"
                        >
                          Confirm password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                          <input
                            id="modal-confirm"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setError(null);
                            }}
                            placeholder="Re-enter your password"
                            autoComplete="new-password"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-destructive font-medium mt-4"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading
                      ? "Please wait…"
                      : isSignUp
                        ? "Create account"
                        : "Sign in"}
                  </button>
                </form>

                {/* Toggle */}
                <p className="text-center text-sm text-foreground/60 mt-6">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp((p) => !p);
                      setError(null);
                      setConfirmPassword("");
                    }}
                    className="text-primary font-medium hover:underline cursor-pointer"
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
