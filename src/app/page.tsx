import React from "react";
import Navbar from "@/components/navigation/navbar";
import HeroSection from "@/components/hero/hero-section";
import WorkflowSection from "@/components/workflow/workflow-section";
import PreviewSection from "@/components/live-preview/preview-section";
import RepositorySection from "@/components/repository/repository-section";
import GallerySection from "@/components/gallery/gallery-section";
import ManifestoSection from "@/components/ownership/manifesto-section";
import { CTASection, Footer } from "@/components/cta/cta-footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <WorkflowSection />
        <PreviewSection />
        <RepositorySection />
        <GallerySection />
        <ManifestoSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
