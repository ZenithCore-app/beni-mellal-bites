
# Local Food Delivery Platform — Beni Mellal Edition

## Design System
- **Dark mode default** with glassmorphism: semi-transparent cards (`bg-white/10 backdrop-blur-xl`), subtle borders, glowing accents
- **Sunset Orange** (`#FF6B35`) as primary accent color
- **Mobile-first** responsive design
- **Framer Motion** for page/component transitions
- **Lucide Icons** throughout

## Pages & Components

### 1. Landing Page
- **Hero Section**: Bold headline ("Beni Mellal's Favorite Bites, Delivered"), animated tagline, CTA buttons ("Order Now" / "Start Group Order")
- **Featured Gems Section**: Glassmorphic restaurant cards with image, name, rating, delivery time, and cuisine tags
- **Category Quick-Filter Bar**: Horizontal scrollable chips (Tagine, Pizza, Grills, Desserts, etc.)
- **How It Works**: 3-step visual explainer (Browse → Order → Enjoy)
- **WhatsApp Support**: Sticky floating button (bottom-right)

### 2. Restaurant Browse / Search
- Search bar with category and rating filters
- Grid of glassmorphic restaurant cards
- Click to open restaurant menu page

### 3. Restaurant Menu Page
- Restaurant header (banner, logo, info, rating)
- Menu items grouped by category with add-to-cart buttons
- Framer Motion transitions when adding items

### 4. Floating Cart
- Persistent floating cart summary (item count + total) visible while scrolling
- Expandable drawer showing full cart details
- "Proceed to Checkout" button

### 5. Checkout Flow
- Order summary with editable quantities
- "Deliver Now" vs "Schedule for Later" toggle with date/time picker
- "Subscription Meal" toggle for recurring weekly orders
- Delivery address input
- Place Order button

### 6. Order Status Tracker
- Visual progress stepper: Order Placed → Preparing → Ready for Pickup → Picked Up → Arrived → Delivered
- Updates based on restaurant/courier status changes (mock state for now)

### 7. Group Order Flow
- "Start Group Order" button generates a unique session link
- Shareable link UI with copy button
- Shared cart view showing who added what
- Host can finalize and checkout (mock real-time with local state)

### 8. "Street Cred" Loyalty Profile
- Glassmorphic profile card with XP progress bar
- Rank badges: "Hungry Local" → "Beni Mellal Gourmet" → "King of Tagine"
- XP earned per Dirham spent

## Data & State
- Mock restaurant data (5-8 Beni Mellal-themed restaurants with menus)
- React state + Context for cart, orders, group order sessions
- Prepared for future Supabase integration (external project)

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS (dark glassmorphism theme)
- Framer Motion (transitions & animations)
- Lucide React (icons)
- React Router (SPA routing)
- Tanstack React Query (ready for API integration)
