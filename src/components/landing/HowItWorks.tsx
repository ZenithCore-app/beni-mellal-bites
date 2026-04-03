import { motion } from "framer-motion";
import { Search, ShoppingBag, Truck } from "lucide-react";

const steps = [
  { icon: Search, title: "Browse", desc: "Explore local restaurants and menus" },
  { icon: ShoppingBag, title: "Order", desc: "Add items and checkout in seconds" },
  { icon: Truck, title: "Enjoy", desc: "Track your order until it arrives" },
];

const HowItWorks = () => (
  <section className="px-4 py-16 max-w-4xl mx-auto">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl sm:text-4xl font-bold font-display text-center mb-12"
    >
      How It <span className="text-gradient">Works</span>
    </motion.h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      {steps.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="glass-card p-6 text-center relative"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <step.icon className="text-primary" size={28} />
          </div>
          <span className="absolute top-4 right-4 text-4xl font-bold text-white/5 font-display">
            {i + 1}
          </span>
          <h3 className="text-xl font-semibold font-display mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground font-body">{step.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default HowItWorks;
