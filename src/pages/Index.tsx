import HeroSection from "@/components/landing/HeroSection";
import FeaturedGems from "@/components/landing/FeaturedGems";
import CategoryFilter from "@/components/landing/CategoryFilter";
import HowItWorks from "@/components/landing/HowItWorks";

const Index = () => (
  <div className="min-h-screen">
    <HeroSection />
    <CategoryFilter />
    <FeaturedGems />
    <HowItWorks />

    <footer className="text-center py-10 text-muted-foreground text-sm font-body border-t border-border mt-10">
      <p>© 2026 BeniBites — Beni Mellal's delivery platform</p>
    </footer>
  </div>
);

export default Index;
