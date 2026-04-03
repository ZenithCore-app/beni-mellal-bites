import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";
import { restaurants } from "@/data/restaurants";
import { useNavigate } from "react-router-dom";

const FeaturedGems = () => {
  const navigate = useNavigate();
  const featured = restaurants.filter((r) => r.featured);

  return (
    <section className="px-4 py-16 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl sm:text-4xl font-bold font-display mb-2">
          Featured <span className="text-gradient">Gems</span> 💎
        </h2>
        <p className="text-muted-foreground font-body">
          Handpicked favorites from the heart of Beni Mellal
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featured.map((restaurant, i) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="glass-card overflow-hidden cursor-pointer group"
            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 flex gap-1.5">
                {restaurant.cuisine.map((c) => (
                  <span
                    key={c}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-primary/80 text-primary-foreground font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-display font-semibold text-lg mb-1">{restaurant.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mb-3 font-body">
                {restaurant.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-primary fill-primary" />
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span className="text-muted-foreground text-xs">({restaurant.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock size={14} />
                  <span className="text-xs">{restaurant.deliveryTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedGems;
