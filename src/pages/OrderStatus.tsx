import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";

const STEPS: { status: OrderStatus; label: string; emoji: string }[] = [
  { status: "placed", label: "Order Placed", emoji: "📝" },
  { status: "preparing", label: "Preparing", emoji: "👨‍🍳" },
  { status: "ready", label: "Ready for Pickup", emoji: "✅" },
  { status: "picked_up", label: "Picked Up", emoji: "🏍️" },
  { status: "arrived", label: "Arrived", emoji: "📍" },
  { status: "delivered", label: "Delivered", emoji: "🎉" },
];

const OrderStatusPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate status progression
  useEffect(() => {
    if (currentStep < STEPS.length - 1) {
      const timer = setTimeout(() => setCurrentStep((s) => s + 1), 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen px-4 py-6 max-w-xl mx-auto">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-body">
        <ArrowLeft size={18} /> Home
      </button>

      <h1 className="text-3xl font-bold font-display mb-2">
        Order <span className="text-gradient">Tracking</span>
      </h1>
      <p className="text-muted-foreground font-body mb-10">Order #BM-{Math.floor(1000 + Math.random() * 9000)}</p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-1">
          {STEPS.map((step, i) => {
            const isCompleted = i <= currentStep;
            const isCurrent = i === currentStep;

            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex items-start gap-4 pb-8"
              >
                {/* Circle */}
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground glow-orange-sm"
                      : "glass"
                  } ${isCurrent ? "animate-pulse-glow scale-110" : ""}`}
                >
                  {isCompleted && i < currentStep ? (
                    <Check size={20} />
                  ) : (
                    <span className="text-lg">{step.emoji}</span>
                  )}
                </div>

                {/* Text */}
                <div className="pt-2">
                  <h3 className={`font-display font-semibold ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </h3>
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-primary font-body mt-0.5"
                    >
                      In progress...
                    </motion.p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {currentStep === STEPS.length - 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-8">
          <p className="text-2xl mb-4">🎉</p>
          <h2 className="text-xl font-display font-bold mb-2">Order Delivered!</h2>
          <p className="text-muted-foreground font-body mb-6">Enjoy your meal! Bssa7a!</p>
          <Button onClick={() => navigate("/")} className="rounded-xl font-display glow-orange">
            Order Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default OrderStatusPage;
