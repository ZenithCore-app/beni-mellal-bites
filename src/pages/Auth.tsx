import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Truck, ShoppingBag, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"customer" | "courier">("customer");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast({ title: "Welcome back!" });
      } else {
        await signUp(email, password, displayName, role);
        toast({ title: "Account created!", description: "You're now signed in." });
      }
      navigate(role === "courier" ? "/courier" : "/");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="text-3xl font-bold font-display mb-2 text-center">
          <span className="text-gradient">{isLogin ? "Welcome Back" : "Join BeniBites"}</span>
        </h1>
        <p className="text-muted-foreground text-center font-body mb-8">
          {isLogin ? "Sign in to your account" : "Create your account to start ordering"}
        </p>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          {!isLogin && (
            <>
              <div>
                <Label className="font-body">Name</Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="glass border-white/10 rounded-xl font-body mt-1"
                  required
                />
              </div>
              <div>
                <Label className="font-body mb-2 block">I am a</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`glass-card p-4 flex flex-col items-center gap-2 rounded-xl transition-all ${role === "customer" ? "ring-2 ring-primary bg-primary/10" : "hover:bg-white/5"}`}
                  >
                    <ShoppingBag size={24} className={role === "customer" ? "text-primary" : "text-muted-foreground"} />
                    <span className="text-sm font-medium">Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("courier")}
                    className={`glass-card p-4 flex flex-col items-center gap-2 rounded-xl transition-all ${role === "courier" ? "ring-2 ring-primary bg-primary/10" : "hover:bg-white/5"}`}
                  >
                    <Truck size={24} className={role === "courier" ? "text-primary" : "text-muted-foreground"} />
                    <span className="text-sm font-medium">Delivery Agent</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <Label className="font-body">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="glass border-white/10 rounded-xl font-body mt-1"
              required
            />
          </div>

          <div>
            <Label className="font-body">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="glass border-white/10 rounded-xl font-body mt-1"
              minLength={6}
              required
            />
          </div>

          <Button type="submit" className="w-full py-5 rounded-xl glow-orange font-display" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? (
              <><LogIn className="mr-2" size={18} /> Sign In</>
            ) : (
              <><UserPlus className="mr-2" size={18} /> Create Account</>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground font-body">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;
