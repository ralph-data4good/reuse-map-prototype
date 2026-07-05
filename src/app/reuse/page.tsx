import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ReuseExplorer } from "@/components/ReuseExplorer";
import { ContributeCTA } from "@/components/ContributeCTA";
import { Footer } from "@/components/Footer";

function ExplorerFallback() {
  return (
    <div className="container flex h-64 items-center justify-center text-sm text-muted">
      Loading reuse solutions…
    </div>
  );
}
export default function ReusePage() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Suspense fallback={<ExplorerFallback />}>
        <ReuseExplorer />
      </Suspense>
      <ContributeCTA />
      <Footer />
    </main>
  );
}
