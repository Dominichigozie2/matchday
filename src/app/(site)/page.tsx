import Hero from "@/components/home/Hero";
import CategoryShowroom from "@/components/home/CategoryShowroom";
import LiveRequestsSection from "@/components/home/LiveRequestsSection";
import VenueEngineSection from "@/components/home/VenueEngineSection";
import WorkflowAndFeaturesSection from "@/components/home/WorkflowAndFeaturesSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowroom />
      <LiveRequestsSection />
      <VenueEngineSection />
      <WorkflowAndFeaturesSection />
    </>
  );
}
