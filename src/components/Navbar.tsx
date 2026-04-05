import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, Package, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, userRole, displayName, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-30 glass-strong border-b border-border bg-background/80">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-lg">
          <span className="text-gradient">BeniBites</span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {userRole === "courier" ? (
                <Button variant="ghost" size="sm" onClick={() => navigate("/courier")} className="font-body text-xs">
                  <Truck size={14} className="mr-1" /> Dashboard
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => navigate("/my-orders")} className="font-body text-xs">
                  <Package size={14} className="mr-1" /> Orders
                </Button>
              )}
              <span className="text-xs text-muted-foreground font-body hidden sm:inline">
                <User size={12} className="inline mr-1" />{displayName}
              </span>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8">
                <LogOut size={14} />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="font-body text-xs">
              <LogIn size={14} className="mr-1" /> Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
