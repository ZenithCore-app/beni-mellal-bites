import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Restaurants from "./pages/Restaurants";
import RestaurantMenu from "./pages/RestaurantMenu";
import Checkout from "./pages/Checkout";
import OrderStatus from "./pages/OrderStatus";
import GroupOrder from "./pages/GroupOrder";
import Auth from "./pages/Auth";
import MyOrders from "./pages/MyOrders";
import CourierDashboard from "./pages/CourierDashboard";
import NotFound from "./pages/NotFound";
import FloatingCart from "./components/FloatingCart";
import WhatsAppButton from "./components/WhatsAppButton";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/restaurant/:id" element={<RestaurantMenu />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-status/:id" element={<OrderStatus />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/group-order" element={<GroupOrder />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/courier" element={<CourierDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingCart />
            <WhatsAppButton />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
