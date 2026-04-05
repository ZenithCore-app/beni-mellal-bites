import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Copy, Check, ArrowLeft, Link2, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SessionItem {
  id: string;
  user_name: string;
  menu_item_name: string;
  menu_item_price: number;
  quantity: number;
}

const GroupOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, displayName } = useAuth();
  const { toast } = useToast();
  const [sessionCode, setSessionCode] = useState<string | null>(searchParams.get("session"));
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hostName, setHostName] = useState("");
  const [copied, setCopied] = useState(false);
  const [items, setItems] = useState<SessionItem[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [joinCode, setJoinCode] = useState(searchParams.get("session") ?? "");

  // Fetch or create session
  useEffect(() => {
    if (sessionCode) {
      loadSession(sessionCode);
    }
  }, [sessionCode]);

  const loadSession = async (code: string) => {
    const { data } = await supabase
      .from("group_sessions")
      .select("*")
      .eq("session_code", code)
      .maybeSingle();

    if (data) {
      setSessionId(data.id);
      setHostName(data.host_name);
      setIsHost(data.host_id === user?.id);
      fetchItems(data.id);

      // Subscribe to real-time updates
      const channel = supabase
        .channel(`group-${data.id}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "group_session_items", filter: `session_id=eq.${data.id}` }, () => fetchItems(data.id))
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    } else {
      toast({ title: "Session not found", variant: "destructive" });
    }
  };

  const fetchItems = async (sid: string) => {
    const { data } = await supabase
      .from("group_session_items")
      .select("*")
      .eq("session_id", sid)
      .order("created_at");
    setItems((data as SessionItem[]) ?? []);
  };

  const startSession = async () => {
    if (!user) {
      toast({ title: "Please sign in first", variant: "destructive" });
      navigate("/auth");
      return;
    }
    const code = `BM-${Date.now().toString(36).toUpperCase()}`;
    const { data, error } = await supabase
      .from("group_sessions")
      .insert({
        host_id: user.id,
        host_name: displayName || "Host",
        session_code: code,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setSessionCode(code);
    setSessionId(data.id);
    setIsHost(true);
    setHostName(displayName || "Host");
  };

  const joinSession = () => {
    if (joinCode.trim()) {
      setSessionCode(joinCode.trim());
    }
  };

  const shareLink = sessionCode ? `${window.location.origin}/group-order?session=${sessionCode}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteItem = async (itemId: string) => {
    await supabase.from("group_session_items").delete().eq("id", itemId);
  };

  const groupTotal = items.reduce((sum, i) => sum + Number(i.menu_item_price) * i.quantity, 0);

  return (
    <div className="min-h-screen px-4 py-6 max-w-xl mx-auto">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-body">
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
          <Users className="text-primary" size={32} />
        </div>

        <h1 className="text-3xl font-bold font-display mb-2">
          Group <span className="text-gradient">Order</span>
        </h1>
        <p className="text-muted-foreground font-body mb-8">
          Start a group session and share the link. Everyone adds to one cart!
        </p>

        {!sessionCode ? (
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-display font-semibold">Start New Session</h2>
              <Button className="w-full py-5 rounded-xl glow-orange font-display" onClick={startSession}>
                <Users className="mr-2" size={18} />
                Start Group Session
              </Button>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h2 className="font-display font-semibold">Join Existing Session</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter session code (e.g., BM-...)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="glass border-white/10 rounded-xl font-body"
                />
                <Button onClick={joinSession} className="rounded-xl">Join</Button>
              </div>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground font-body mb-1">Session</p>
              <p className="text-xl font-display font-bold text-gradient">{sessionCode}</p>
              <p className="text-sm text-muted-foreground font-body mt-1">Hosted by {hostName}</p>
            </div>

            <div className="glass-card p-6">
              <p className="text-sm font-medium font-body mb-3 flex items-center gap-2">
                <Link2 size={16} className="text-primary" /> Share this link
              </p>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly className="glass border-white/10 rounded-xl font-body text-xs" />
                <Button onClick={handleCopy} variant="outline" className="glass border-white/10 rounded-xl shrink-0">
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </Button>
              </div>
            </div>

            {/* Shared Cart */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary" /> Shared Cart
              </h2>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground font-body text-center py-4">No items yet. Browse restaurants to add!</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.menu_item_name} × {item.quantity}</p>
                        <p className="text-xs text-muted-foreground">Added by {item.user_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{Number(item.menu_item_price) * item.quantity} MAD</span>
                        {(isHost || item.user_name === displayName) && (
                          <button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 flex justify-between font-bold font-display">
                    <span>Total</span>
                    <span className="text-gradient">{groupTotal} MAD</span>
                  </div>
                </div>
              )}
            </div>

            <Button className="w-full py-5 rounded-xl font-display" variant="outline" onClick={() => navigate("/restaurants")}>
              Browse Restaurants & Add Items
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default GroupOrder;
