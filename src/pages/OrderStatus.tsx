import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, Package, Truck, MapPin, Home } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const STEPS = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "preparing", label: "Preparing", icon: Circle },
  { key: "ready", label: "Ready for Pickup", icon: CheckCircle2 },
  { key: "picked_up", label: "Picked Up", icon: Truck },
  { key: "arrived", label: "Arrived", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: Home },
];

interface OrderRow {
  id: string;
  restaurant_name: string;
  status: string;
  total: number;
  delivery_fee: number;
  delivery_address: string;
  created_at: string;
}

interface OrderItemRow {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

const OrderStatusPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      const { data } = await supabase.from("orders").select("*").eq("id", id).single();
      setOrder(data as OrderRow | null);

      const { data: itemsData } = await supabase.from("order_items").select("*").eq("order_id", id);
      setItems((itemsData as OrderItemRow[]) ?? []);
    };

    fetchOrder();

    const channel = supabase
      .channel(`order-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` }, (payload) => {
        setOrder((prev) => prev ? { ...prev, ...payload.new } as OrderRow : null);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-body">Loading order...</p>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      <button onClick={() => navigate("/my-orders")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-body">
        <ArrowLeft size={18} /> My Orders
      </button>

      <h1 className="text-3xl font-bold font-display mb-2">
        <span className="text-gradient">Order Status</span>
      </h1>
      <p className="text-muted-foreground font-body mb-8">{order.restaurant_name}</p>

      {/* Progress Stepper */}
      <div className="glass-card p-6 mb-6">
        <div className="space-y-0">
          {STEPS.map((step, i) => {
            const done = i <= currentIdx;
            const isCurrent = i === currentIdx;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{ scale: isCurrent ? 1.2 : 1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    <Icon size={16} />
                  </motion.div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-0.5 h-8 ${i < currentIdx ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
                <div className="pt-1">
                  <p className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                  {isCurrent && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-primary mt-0.5">
                      Current status
                    </motion.p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items */}
      <div className="glass-card p-5">
        <h2 className="font-display font-semibold mb-3">Items</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />}
                <span>{item.name} × {item.quantity}</span>
              </div>
              <span className="font-semibold">{Number(item.price) * item.quantity} MAD</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold font-display">
          <span>Total</span>
          <span className="text-gradient">{Number(order.total) + Number(order.delivery_fee)} MAD</span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
