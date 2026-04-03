import { motion } from "framer-motion";
import { CATEGORIES, Category } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORY_EMOJIS: Record<string, string> = {
  All: "🍽️",
  Tagine: "🥘",
  Pizza: "🍕",
  Grills: "🔥",
  Desserts: "🍰",
  Burgers: "🍔",
  Moroccan: "🇲🇦",
  Sandwiches: "🥖",
  Drinks: "🥤",
};

const CategoryFilter = () => {
  const [active, setActive] = useState<Category>("All");
  const navigate = useNavigate();

  const handleClick = (cat: Category) => {
    setActive(cat);
    if (cat === "All") {
      navigate("/restaurants");
    } else {
      navigate(`/restaurants?category=${cat}`);
    }
  };

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(cat)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all font-body ${
              active === cat
                ? "bg-primary text-primary-foreground glow-orange-sm"
                : "glass hover:bg-white/10"
            }`}
          >
            <span>{CATEGORY_EMOJIS[cat]}</span>
            {cat}
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilter;
