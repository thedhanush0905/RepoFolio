"use client";

import React from "react";
import { PortfolioData } from "@/lib/constants";
import PortfolioRenderer, { PortfolioTemplate } from "@/components/portfolio/portfolio-renderer";

interface PortfolioPreviewProps {
  data: PortfolioData;
  theme?: string;
  activeSection?: string;
}

export default function PortfolioPreview({
  data,
  theme = "technical",
}: PortfolioPreviewProps) {
  // Map old preview theme parameters to new templates cleanly
  let selectedTemplate: PortfolioTemplate = "developer";
  if (theme === "editorial") selectedTemplate = "editorial";
  if (theme === "minimal") selectedTemplate = "minimal";
  if (theme === "creative") selectedTemplate = "creative";
  if (theme === "corporate") selectedTemplate = "corporate";
  if (theme === "experimental") selectedTemplate = "experimental";
  if (theme === "technical") selectedTemplate = "developer";

  return <PortfolioRenderer template={selectedTemplate} data={data} />;
}
