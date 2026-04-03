import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, RotateCcw, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart, updateQuantity } = useCart();
  const [deliverNow, setDeliverNow] = useState(true);
  const [isSubscription, setIsSubscription] = useState(false);
  const [address, setAddress] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground font-body text-lg">Your cart is empty</p>
        <Button onClick={() => navigate("/restaurants")} className="rounded-xl font-display">
          Browse Restaurants
        </Button>
      </div>
    );
  }

  const deliveryFee = 10;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = () => {
    clearCart();
    navigate("/order-status");
  };

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-body">
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-3xl font-bold font-display mb-8">
        <span className="text-gradient">Checkout</span>
      </h1>

      {/* Items */}
      <div className="glass-card p-5 mb-6">
        <h2 className="font-display font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.menuItem.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <img src={item.menuItem.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="font-medium">{item.menuItem.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} className="text-muted-foreground hover:text-foreground text-xs">−</button>
                    <span className="text-xs font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} className="text-muted-foreground hover:text-foreground text-xs">+</button>
                  </div>
                </div>
              </div>
              <span className="font-semibold">{item.menuItem.price * item.quantity} MAD</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{total} MAD</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>{deliveryFee} MAD</span></div>
          <div className="flex justify-between font-bold text-lg font-display"><span>Total</span><span className="text-gradient">{grandTotal} MAD</span></div>
        </div>
      </div>

      {/* Delivery options */}
      <div className="glass-card p-5 mb-6 space-y-5">
        <h2 className="font-display font-semibold">Delivery Options</h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            <Label className="font-body">Deliver Now</Label>
          </div>
          <Switch checked={deliverNow} onCheckedChange={setDeliverNow} />
        </div>

        {!deliverNow && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="pl-10 glass border-white/10 rounded-xl font-body" />
              </div>
              <div className="flex-1 relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="pl-10 glass border-white/10 rounded-xl font-body" />
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw size={18} className="text-primary" />
            <Label className="font-body">Weekly Subscription</Label>
          </div>
          <Switch checked={isSubscription} onCheckedChange={setIsSubscription} />
        </div>
        {isSubscription && (
          <p className="text-xs text-muted-foreground font-body">This order will repeat every week. You can cancel anytime.</p>
        )}
      </div>

      {/* Address */}
      <div className="glass-card p-5 mb-8">
        <h2 className="font-display font-semibold mb-3">Delivery Address</h2>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Enter your address in Beni Mellal..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="pl-10 glass border-white/10 rounded-xl font-body"
          />
        </div>
      </div>

      <Button className="w-full py-6 text-lg rounded-xl glow-orange font-display" onClick={handlePlaceOrder}>
        Place Order — {grandTotal} MAD
        <ArrowRight className="ml-2" size={18} />
      </Button>
    </div>
  );
};

export default Checkout;
