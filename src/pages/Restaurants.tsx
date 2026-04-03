import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Clock, ArrowLeft } from "lucide-react";
import { restaurants } from "@/data/restaurants";
import { CATEGORIES, Category } from "@/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";

const CATEGORY_EMOJIS: Record<string, string> = {
  All: "🍽️", Tagine: "🥘", Pizza: "🍕", Grills: "🔥", Desserts: "🍰",
  Burgers: "🍔", Moroccan: "🇲🇦", Sandwiches: "🥖", Drinks: "🥤",
};

const Restaurants = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCat = (searchParams.get("category") as Category) || "All";
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>(initialCat);
  const [minRating, setMinRating] = useState(0);

  const filtered = restaurants.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || r.cuisine.includes(category);
    const matchRating = r.rating >= minRating;
    return matchSearch && matchCat && matchRating;
  });

  return (
    <div className="min-h-screen px-4 py-6 max-w-6xl mx-auto">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-body">
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-3xl font-bold font-display mb-6">
        All <span className="text-gradient">Restaurants</span>
      </h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 glass border-white/10 rounded-xl font-body"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all font-body ${
              category === cat ? "bg-primary text-primary-foreground glow-orange-sm" : "glass hover:bg-white/10"
            }`}
          >
            <span>{CATEGORY_EMOJIS[cat]}</span>{cat}
          </button>
        ))}
      </div>

      {/* Rating filter */}
      <div className="flex gap-2 mb-6">
        {[0, 4, 4.5].map((r) => (
          <button
            key={r}
            onClick={() => setMinRating(r)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-body transition-all ${
              minRating === r ? "bg-primary/20 text-primary" : "glass hover:bg-white/10 text-muted-foreground"
            }`}
          >
            <Star size={12} className={minRating === r ? "fill-primary" : ""} />
            {r === 0 ? "All ratings" : `${r}+`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((restaurant, i) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="glass-card overflow-hidden cursor-pointer group"
            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
          >
            <div className="relative h-36 overflow-hidden">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 flex gap-1.5">
                {restaurant.cuisine.map((c) => (
                  <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/80 text-primary-foreground font-medium">{c}</span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display font-semibold text-lg mb-1">{restaurant.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mb-3 font-body">{restaurant.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-primary fill-primary" />
                  <span className="font-semibold">{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock size={14} /><span className="text-xs">{restaurant.deliveryTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground font-body">
          <p className="text-lg">No restaurants found 😔</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
