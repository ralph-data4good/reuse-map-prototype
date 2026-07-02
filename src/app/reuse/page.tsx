import { Header } from "@/components/Header";
import { ReuseExplorer } from "@/components/ReuseExplorer";
import { ContributeCTA } from "@/components/ContributeCTA";
import { Footer } from "@/components/Footer";

export default function ReusePage() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <ReuseExplorer />
      <ContributeCTA />
      <Footer />
    </main>
  );
}
