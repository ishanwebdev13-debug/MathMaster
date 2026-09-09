import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, Sparkles, BookOpen, Trophy, Users, Star, Activity, Moon, Sun } from "lucide-react";
import AuthModal from "../components/AuthModal";
import Logo from "../components/Logo";

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<"login" | "signup">("signup");
  const [isDark, setIsDark] = useState(false);

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  const openAuth = (type: "login" | "signup") => {
    setAuthModalType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-heading text-2xl font-bold text-foreground tracking-tight">Unlimited</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-1.5 text-foreground/40 hover:text-primary transition-colors rounded-lg hover:bg-muted cursor-pointer"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => openAuth("login")}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={() => openAuth("signup")}
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>The smart way to learn math</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight leading-tight mb-6"
          >
            Master Mathematics <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              at your own pace
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10"
          >
            Interactive lessons, adaptive quizzes, and a supportive community to help you build confidence and achieve mastery in mathematics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => openAuth("signup")}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-primary/25"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => openAuth("login")}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-primary/20 text-foreground rounded-xl font-semibold text-lg hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </motion.div>

          {/* Quick features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left"
          >
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Interactive Lessons</h3>
              <p className="text-foreground/60 text-sm">Bite-sized, engaging content that makes complex concepts easy to understand.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Practice</h3>
              <p className="text-foreground/60 text-sm">Adaptive quizzes that adjust to your skill level for optimal learning.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
              <p className="text-foreground/60 text-sm">Earn points, climb the leaderboard, and see your mastery grow over time.</p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* How it works & Stats Section */}
      <section className="py-24 bg-muted/50 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Why Choose Unlimited?</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              We combine cognitive science with gamification to ensure you not only learn math, but remember it forever.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Active Recall</h4>
              <p className="text-sm text-foreground/60">Practice testing to boost your retention and mastery of core concepts.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                <Calculator className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Spaced Repetition</h4>
              <p className="text-sm text-foreground/60">Review topics at the perfect intervals to cement them in long-term memory.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-purple-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Community Driven</h4>
              <p className="text-sm text-foreground/60">Compete with friends and fellow learners on our weekly leaderboards.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Reward System</h4>
              <p className="text-sm text-foreground/60">Earn XP, build streaks, and level up as you continue your learning journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-heading font-bold mb-6">Ready to become a Math Master?</h2>
          <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already improving their math skills with our intelligent platform.
          </p>
          <button
            onClick={() => openAuth("signup")}
            className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 mx-auto shadow-xl shadow-primary/20 cursor-pointer"
          >
            Create Your Free Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultIsSignUp={authModalType === "signup"}
      />
    </div>
  );
}
