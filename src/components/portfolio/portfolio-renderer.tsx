"use client";

import React, { useState } from "react";
import { PortfolioData } from "@/lib/constants";
import DeveloperTemplate from "./templates/developer";
import EditorialTemplate from "./templates/editorial";
import MinimalTemplate from "./templates/minimal";
import CreativeTemplate from "./templates/creative";
import CorporateTemplate from "./templates/corporate";
import ExperimentalTemplate from "./templates/experimental";

export type PortfolioTemplate = "editorial" | "developer" | "minimal" | "creative" | "corporate" | "experimental";
export type PreviewMode = "desktop" | "tablet" | "mobile";

interface PortfolioRendererProps {
  template: PortfolioTemplate;
  data: PortfolioData;
  previewMode?: PreviewMode;
}

export default function PortfolioRenderer({ template, data, previewMode = "desktop" }: PortfolioRendererProps) {
  switch (template) {
    case "editorial":
      return <EditorialTemplate data={data} previewMode={previewMode} />;
    case "developer":
      return <DeveloperTemplate data={data} previewMode={previewMode} />;
    case "minimal":
      return <MinimalTemplate data={data} previewMode={previewMode} />;
    case "creative":
      return <CreativeTemplate data={data} previewMode={previewMode} />;
    case "corporate":
      return <CorporateTemplate data={data} previewMode={previewMode} />;
    case "experimental":
      return <ExperimentalTemplate data={data} previewMode={previewMode} />;
    default:
      return <DeveloperTemplate data={data} previewMode={previewMode} />;
  }
}
