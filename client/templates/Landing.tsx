import * as React from "react";
import HeroSection from "@/templates/landing/HeroSection";
import FeaturesSection from "@/templates/landing/FeaturesSection";
import HowItWorksSection from "@/templates/landing/HowItWorksSection";
import SocialProofSection from "@/templates/landing/SocialProofSection";
import PricingSection from "@/templates/landing/PricingSection";
import FaqSection from "@/templates/landing/FaqSection";
import CtaSection from "@/templates/landing/CtaSection";
import FooterSection from "@/templates/landing/FooterSection";
import Navbar from "@/templates/landing/Navbar";
import WhatsAppButton from "@/templates/landing/WhatsAppButton";

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
