import * as React from "react";
import HeroSection from "@/pages/landing/HeroSection";
import FeaturesSection from "@/pages/landing/FeaturesSection";
import HowItWorksSection from "@/pages/landing/HowItWorksSection";
import SocialProofSection from "@/pages/landing/SocialProofSection";
import PricingSection from "@/pages/landing/PricingSection";
import FaqSection from "@/pages/landing/FaqSection";
import CtaSection from "@/pages/landing/CtaSection";
import FooterSection from "@/pages/landing/FooterSection";
import Navbar from "@/pages/landing/Navbar";
import WhatsAppButton from "@/pages/landing/WhatsAppButton";

export default function Landing() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
