import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4">
      {/* Gradient orbs */}
      <div className="absolute top-20 -left-32 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-6 font-body">
            🇲🇦 Now delivering across Beni Mellal
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold font-display leading-tight mb-6"
        >
          Beni Mellal's{" "}
          <span className="text-gradient">Favorite Bites</span>,{" "}
          <br className="hidden sm:block" />
          Delivered
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto font-body"
        >
          From sizzling tagines to fresh pastries — discover the best local food, delivered fast to your door.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="glow-orange text-lg px-8 py-6 rounded-xl font-display"
            onClick={() => navigate("/restaurants")}
          >
            Order Now
            <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="glass text-lg px-8 py-6 rounded-xl font-display border-white/10 hover:bg-white/10"
            onClick={() => navigate("/group-order")}
          >
            <Users className="mr-2" size={20} />
            Start Group Order
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
