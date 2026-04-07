import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Package, CheckCircle, ArrowRight, Clock, LogOut, History, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface OrderRow {
  id: string;
  restaurant_name: string;
  delivery_address: string;
  total: number;
  delivery_fee: number;
  status: string;
  created_at: string;
  customer_id: string;
  customer_phone?: string;
}

const STATUS_FLOW = ["picked_up", "arrived", "delivered"] as const;

const CourierDashboard = () => {
  const { user, signOut, displayName } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"available" | "active" | "history">("available");
  const [availableOrders, setAvailableOrders] = useState<OrderRow[]>([]);
  const [activeOrders, setActiveOrders] = useState<OrderRow[]>([]);
  const [pastOrders, setPastOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  const enrichWithPhone = async (orders: OrderRow[]): Promise<OrderRow[]> => {
    if (orders.length === 0) return orders;
    const customerIds = [...new Set(orders.map((o) => o.customer_id).filter(Boolean))];
    if (customerIds.length === 0) return orders;
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, phone")
      .in("user_id", customerIds);
    const phoneMap = new Map((profiles ?? []).map((p) => [p.user_id, p.phone]));
    return orders.map((o) => ({ ...o, customer_phone: phoneMap.get(o.customer_id) ?? undefined }));
  };

  const fetchOrders = async () => {
    if (!user) return;

    const { data: available } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "ready")
      .is("courier_id", null)
      .order("created_at", { ascending: false });

    const { data: active } = await supabase
      .from("orders")
      .select("*")
      .eq("courier_id", user.id)
      .in("status", ["picked_up", "arrived"])
      .order("created_at", { ascending: false });

    const { data: past } = await supabase
      .from("orders")
      .select("*")
      .eq("courier_id", user.id)
      .eq("status", "delivered")
      .order("created_at", { ascending: false });

    const allRaw = [
      ...(available ?? []),
      ...(active ?? []),
      ...(past ?? []),
    ] as OrderRow[];
    const enriched = await enrichWithPhone(allRaw);

    const enrichedMap = new Map(enriched.map((o) => [o.id, o]));
    setAvailableOrders((available ?? []).map((o: any) => enrichedMap.get(o.id) ?? o));
    setActiveOrders((active ?? []).map((o: any) => enrichedMap.get(o.id) ?? o));
    setPastOrders((past ?? []).map((o: any) => enrichedMap.get(o.id) ?? o));
  };

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel("courier-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchOrders())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const claimOrder = async (orderId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("orders")
      .update({ courier_id: user!.id, status: "picked_up" })
      .eq("id", orderId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Order claimed!", description: "Marked as picked up." });
      fetchOrders();
    }
    setLoading(false);
  };

  const advanceStatus = async (orderId: string, currentStatus: string) => {
    const idx = STATUS_FLOW.indexOf(currentStatus as any);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[idx + 1];
    setLoading(true);
    const { error } = await supabase
      .from("orders")
      .update({ status: next })
      .eq("id", orderId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Status updated to "${next.replace("_", " ")}"` });
      fetchOrders();
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const OrderCard = ({ order, actions }: { order: OrderRow; actions?: React.ReactNode }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-display font-semibold">{order.restaurant_name}</h3>
          <p className="text-xs text-muted-foreground font-body">{order.delivery_address}</p>
        </div>
        <span className="text-primary font-bold font-display">{Number(order.total) + Number(order.delivery_fee)} MAD</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock size={12} />
        <span>{new Date(order.created_at).toLocaleString()}</span>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold uppercase">
          {order.status.replace("_", " ")}
        </span>
      </div>
      {actions && <div className="pt-2">{actions}</div>}
    </motion.div>
  );

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">
            <span className="text-gradient">Courier Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground font-body">Welcome, {displayName || "Driver"}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut size={18} />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: "available", label: "Available", icon: Package, count: availableOrders.length },
          { key: "active", label: "Active", icon: Truck, count: activeOrders.length },
          { key: "history", label: "History", icon: History, count: pastOrders.length },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 glass-card p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${tab === t.key ? "ring-2 ring-primary bg-primary/10" : "hover:bg-white/5"}`}
          >
            <t.icon size={18} className={tab === t.key ? "text-primary" : "text-muted-foreground"} />
            <span className="text-xs font-medium">{t.label} ({t.count})</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {tab === "available" && (
          availableOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 font-body">No available orders right now</p>
          ) : (
            availableOrders.map((o) => (
              <OrderCard key={o.id} order={o} actions={
                <Button className="w-full rounded-xl glow-orange font-display" onClick={() => claimOrder(o.id)} disabled={loading}>
                  <Truck className="mr-2" size={16} /> Claim & Pick Up
                </Button>
              } />
            ))
          )
        )}

        {tab === "active" && (
          activeOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 font-body">No active deliveries</p>
          ) : (
            activeOrders.map((o) => (
              <OrderCard key={o.id} order={o} actions={
                <Button
                  className="w-full rounded-xl font-display"
                  variant={o.status === "arrived" ? "default" : "outline"}
                  onClick={() => advanceStatus(o.id, o.status)}
                  disabled={loading}
                >
                  {o.status === "picked_up" ? (
                    <><CheckCircle className="mr-2" size={16} /> Mark Arrived</>
                  ) : (
                    <><CheckCircle className="mr-2" size={16} /> Mark Delivered</>
                  )}
                </Button>
              } />
            ))
          )
        )}

        {tab === "history" && (
          pastOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 font-body">No past deliveries yet</p>
          ) : (
            pastOrders.map((o) => <OrderCard key={o.id} order={o} />)
          )
        )}
      </div>
    </div>
  );
};

export default CourierDashboard;
