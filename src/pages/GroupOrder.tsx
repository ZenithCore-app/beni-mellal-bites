import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Copy, Check, ArrowLeft, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GroupOrder = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hostName, setHostName] = useState("");
  const [copied, setCopied] = useState(false);

  const startSession = () => {
    if (!hostName.trim()) return;
    setSessionId(`BM-${Date.now().toString(36).toUpperCase()}`);
  };

  const shareLink = sessionId ? `${window.location.origin}/group-order?session=${sessionId}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        {!sessionId ? (
          <div className="glass-card p-6 space-y-4">
            <div>
              <label className="text-sm font-medium font-body mb-2 block">Your Name</label>
              <Input
                placeholder="Enter your name..."
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="glass border-white/10 rounded-xl font-body"
              />
            </div>
            <Button className="w-full py-5 rounded-xl glow-orange font-display" onClick={startSession}>
              <Users className="mr-2" size={18} />
              Start Group Session
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground font-body mb-1">Session ID</p>
              <p className="text-xl font-display font-bold text-gradient">{sessionId}</p>
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
