"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/navigation/navbar";
import HeroSection from "@/components/hero/hero-section";
import SavedDrafts from "@/components/portfolio/saved-drafts";
import WorkflowSection from "@/components/workflow/workflow-section";
import PreviewSection from "@/components/live-preview/preview-section";
import RepositorySection from "@/components/repository/repository-section";
import GallerySection from "@/components/gallery/gallery-section";
import ManifestoSection from "@/components/ownership/manifesto-section";
import { CTASection, Footer } from "@/components/cta/cta-footer";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target); // Animate once
          }
        });
      },
      {
        threshold: 0.05, // Trigger when 5% is visible
        rootMargin: "0px 0px -20px 0px",
      }
    );

    const sections = document.querySelectorAll(".reveal-section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="reveal-section">
          <HeroSection />
        </div>
        <div className="reveal-section">
          <SavedDrafts />
        </div>
        <div className="reveal-section">
          <WorkflowSection />
        </div>
        <div className="reveal-section">
          <PreviewSection />
        </div>
        <div className="reveal-section">
          <RepositorySection />
        </div>
        <div className="reveal-section">
          <GallerySection />
        </div>
        <div className="reveal-section">
          <ManifestoSection />
        </div>
        <div className="reveal-section">
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  );
}
