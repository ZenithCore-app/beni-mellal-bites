import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FloatingCart = () => {
  const { items, itemCount, total, isCartOpen, setIsCartOpen, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) return null;

  return (
    <>
      {/* Floating bubble */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg animate-pulse-glow"
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        <ShoppingBag size={22} />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[11px] flex items-center justify-center font-bold">
          {itemCount}
        </span>
      </motion.button>

      {/* Cart drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed right-0 top-0 h-full w-full max-w-md z-50 glass-strong flex flex-col bg-background/95"
            >
              <div className="p-5 flex items-center justify-between border-b border-border">
                <h2 className="text-xl font-display font-semibold">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.menuItem.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-3 flex gap-3"
                  >
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.menuItem.name}</h4>
                      <p className="text-primary font-semibold text-sm mt-1">
                        {item.menuItem.price} MAD
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.menuItem.id)}
                      className="self-start p-1 hover:bg-destructive/20 rounded"
                    >
                      <X size={14} className="text-muted-foreground" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="p-5 border-t border-border space-y-3">
                <div className="flex justify-between font-display">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-xl font-bold text-gradient">{total} MAD</span>
                </div>
                <Button
                  className="w-full py-6 text-lg rounded-xl glow-orange font-display"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/checkout");
                  }}
                >
                  Checkout
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCart;
