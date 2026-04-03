import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Clock, Truck, Plus, Check } from "lucide-react";
import { restaurants } from "@/data/restaurants";
import { menuItems } from "@/data/restaurants";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const restaurant = restaurants.find((r) => r.id === id);
  const menu = menuItems.filter((m) => m.restaurantId === id);
  const categories = [...new Set(menu.map((m) => m.category))];

  if (!restaurant) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Restaurant not found</div>;
  }

  const handleAdd = (item: typeof menu[0]) => {
    addItem(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 800);
  };

  const getItemQty = (itemId: string) => items.find((i) => i.menuItem.id === itemId)?.quantity || 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        {/* Info card */}
        <div className="glass-card p-5 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-2">{restaurant.name}</h1>
          <p className="text-muted-foreground text-sm font-body mb-3">{restaurant.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-primary fill-primary" />
              <span className="font-semibold">{restaurant.rating}</span>
              <span className="text-muted-foreground">({restaurant.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock size={16} /> {restaurant.deliveryTime}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Truck size={16} /> {restaurant.deliveryFee} MAD delivery
            </div>
          </div>
        </div>

        {/* Menu */}
        {categories.map((cat) => (
          <div key={cat} className="mb-8">
            <h2 className="text-xl font-display font-semibold mb-4">{cat}</h2>
            <div className="space-y-3">
              {menu
                .filter((m) => m.category === cat)
                .map((item) => {
                  const qty = getItemQty(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      className="glass-card p-3 flex gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold font-display text-sm sm:text-base">{item.name}</h3>
                            {item.popular && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                                Popular
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 font-body">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-primary font-display">{item.price} MAD</span>
                          <AnimatePresence mode="wait">
                            {addedId === item.id ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center"
                              >
                                <Check size={16} className="text-green-400" />
                              </motion.div>
                            ) : (
                              <Button
                                key="add"
                                size="sm"
                                className="h-8 rounded-lg text-xs font-body"
                                onClick={() => handleAdd(item)}
                              >
                                <Plus size={14} className="mr-1" />
                                {qty > 0 ? `Add (${qty})` : "Add"}
                              </Button>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;
