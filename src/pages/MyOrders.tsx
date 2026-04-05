import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface OrderRow {
  id: string;
  restaurant_name: string;
  status: string;
  total: number;
  delivery_fee: number;
  created_at: string;
  delivery_address: string;
}

const statusColors: Record<string, string> = {
  placed: "bg-yellow-500/15 text-yellow-400",
  preparing: "bg-blue-500/15 text-blue-400",
  ready: "bg-purple-500/15 text-purple-400",
  picked_up: "bg-orange-500/15 text-orange-400",
  arrived: "bg-green-500/15 text-green-400",
  delivered: "bg-emerald-500/15 text-emerald-400",
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });
      setOrders((data as OrderRow[]) ?? []);
    };
    fetchOrders();

    const channel = supabase
      .channel("my-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `customer_id=eq.${user.id}` }, () => fetchOrders())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-body">
        <ArrowLeft size={18} /> Back
      </button>
      <h1 className="text-3xl font-bold font-display mb-6">
        <span className="text-gradient">My Orders</span>
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-body">No orders yet. Start exploring restaurants!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 cursor-pointer hover:bg-white/5 transition-all"
              onClick={() => navigate(`/order-status/${order.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display font-semibold">{order.restaurant_name}</h3>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{order.delivery_address}</p>
                </div>
                <span className="font-bold text-primary font-display">{Number(order.total) + Number(order.delivery_fee)} MAD</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{new Date(order.created_at).toLocaleString()}</span>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${statusColors[order.status] ?? ""}`}>
                  {order.status.replace("_", " ")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
