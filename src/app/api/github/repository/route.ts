import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthenticatedGitHubUser } from "@/lib/github-client";

// Clean static template dependencies that can be compiled directly in the user's repository
const TEMPLATE_COMPONENTS = {
  developer: `"use client";
import React, { useState } from "react";

export interface PersonalData {
  name: string;
  role: string;
  bio: string;
  location: string;
  github?: string;
  linkedin?: string;
  email?: string;
  profileImage?: string;
  availability?: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  year?: string;
  category?: string;
  featured?: boolean;
  order?: number;
  image?: string;
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Service {
  title: string;
  description: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface PortfolioData {
  personal: PersonalData;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  services?: Service[];
  stats?: Stat[];
}

export interface DeveloperTemplateProps {
  data: PortfolioData;
}

export default function DeveloperTemplate({ data }: DeveloperTemplateProps) {
  const { personal, skills, projects, experience, services } = data;
  const sortedProjects = [...(projects || [])].sort((a: Project, b: Project) => (a.order || 99) - (b.order || 99));
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="bg-[#0B1117] text-[#A8AAA4] font-sans min-h-screen selection:bg-[#E5A84B] selection:text-[#0B1117] p-6 sm:p-12 md:p-16">
      <div className="max-w-5xl mx-auto w-full space-y-12 sm:space-y-24">
        
        {/* Navigation & Header */}
        <header className="border-b border-[#2b3b4d]/20 pb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2">
            <div>
              <div className="font-mono text-sm font-bold tracking-tight text-[#F3F0E8] uppercase">
                {personal.name}
              </div>
              <div className="text-[10px] text-gray-500 uppercase font-mono tracking-widest mt-1">
                {personal.role} {personal.location && \`· \${personal.location}\`}
              </div>
            </div>
            {personal.availability && (
              <div className="text-[9px] text-[#E5A84B] font-mono uppercase tracking-widest md:text-right mt-2 md:mt-0">
                {personal.availability}
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-8">
          <div className="md:col-span-8 space-y-6 order-2 md:order-1">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F3F0E8] leading-tight break-words">
              I build scalable systems & digital products for the web.
            </h1>
            <p className="text-sm sm:text-base text-[#A8AAA4] leading-relaxed max-w-xl font-light">
              {personal.bio}
            </p>
            {personal.location && (
              <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">Based in {personal.location}</p>
            )}
            
            {/* Quick links */}
            <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs text-[#E5A84B]">
              {personal.github && (
                <a href={\`https://github.com/\${personal.github}\`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  GitHub
                </a>
              )}
              {personal.linkedin && (
                <a href={\`https://linkedin.com/in/\${personal.linkedin}\`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn
                </a>
              )}
              {personal.email && (
                <a href={\`mailto:\${personal.email}\`} className="hover:underline">
                  Email
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center md:justify-end order-1 md:order-2">
            {personal.profileImage ? (
              <img 
                src={personal.profileImage} 
                alt={personal.name} 
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 object-cover rounded-sm border border-[#2b3b4d]/40 shadow-xl"
              />
            ) : (
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-sm bg-[#17212B] border border-[#2b3b4d]/40 flex items-center justify-center text-[#E5A84B] font-mono text-sm">
                [ PORTRAIT ]
              </div>
            )}
          </div>
        </section>

        {/* Selected Work section */}
        {sortedProjects.length > 0 && (
          <section className="space-y-16">
            <div className="border-b border-[#2b3b4d]/20 pb-4">
              <h2 className="text-xs font-mono text-[#E5A84B] uppercase tracking-widest">Selected Projects</h2>
            </div>

            <div className="space-y-24">
              {sortedProjects.map((proj: Project, idx: number) => (
                <div key={idx} className="space-y-6">
                  
                  {/* Title metadata */}
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-gray-500">0{idx + 1}</span>
                    <span>{proj.category?.toUpperCase() || "CASE STUDY"}</span>
                  </div>

                  {/* Visual representation card */}
                  <div className="overflow-hidden border border-[#2b3b4d]/30 rounded-sm">
                    {proj.image ? (
                      <img 
                        src={proj.image} 
                        alt={proj.title} 
                        className="w-full object-cover max-h-[460px] transition-transform duration-500 hover:scale-[1.01]"
                      />
                    ) : (
                      <div className="w-full p-8 md:p-12 border border-white/10 rounded-sm flex flex-col justify-between min-h-[220px] select-none bg-[#101820] text-gray-400">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono tracking-widest uppercase text-[#E5A84B]">0{idx + 1}</span>
                          {proj.year && <span className="text-[10px] font-mono">{proj.year}</span>}
                        </div>
                        <div className="my-6">
                          <h4 className="text-xl font-light uppercase tracking-wider text-white">{proj.title}</h4>
                          <span className="text-xs uppercase tracking-widest block mt-1">
                            {proj.category || "Case Study"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10 opacity-70">
                          {proj.tech && proj.tech.map((t: string, i: number) => (
                            <span key={i} className="text-[9px] font-mono uppercase tracking-wider">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 pt-2">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{proj.title}</h3>
                      <p className="text-sm text-[#A8AAA4] leading-relaxed font-light">{proj.description}</p>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px] md:text-right">
                      <div className="font-mono text-xs text-[#E5A84B] flex flex-wrap gap-2 md:justify-end">
                        {proj.tech.join(" · ")}
                      </div>
                      <div>
                        <button 
                          onClick={() => setSelectedProject(proj)} 
                          className="inline-block text-xs font-mono text-white underline hover:text-[#E5A84B] cursor-pointer text-left md:text-right"
                        >
                          View Project Details →
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Timeline */}
        {experience && experience.length > 0 && (
          <section className="space-y-12">
            <div className="border-b border-[#2b3b4d]/20 pb-4">
              <h2 className="text-xs font-mono text-[#E5A84B] uppercase tracking-widest">Experience</h2>
            </div>
            <div className="space-y-12">
              {experience.map((exp: Experience, idx: number) => (
                <div key={idx} className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="md:w-1/3">
                    <span className="text-xs font-mono text-gray-500">{exp.duration}</span>
                  </div>
                  <div className="md:w-2/3 space-y-2">
                    <h3 className="text-base font-bold text-white">{exp.role}</h3>
                    <p className="text-xs font-mono text-[#E5A84B]">{exp.company}</p>
                    <p className="text-sm text-[#A8AAA4] leading-relaxed font-light">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Services capabilities list */}
        {services && services.length > 0 && (
          <section className="space-y-8">
            <div className="border-b border-[#2b3b4d]/20 pb-4">
              <h2 className="text-xs font-mono text-[#E5A84B] uppercase tracking-widest">Capabilities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-mono">
              {services.map((ser: Service, idx: number) => (
                <div key={idx} className="space-y-2 break-words">
                  <h3 className="text-sm font-semibold text-white">{ser.title}</h3>
                  <p className="text-xs text-[#A8AAA4] leading-relaxed font-light">{ser.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Toolkit skills inline list */}
        {skills && skills.length > 0 && (
          <section className="space-y-4 pt-8 border-t border-[#2b3b4d]/20">
            <div className="text-xs text-gray-500 font-mono flex flex-wrap gap-y-2 gap-x-4">
              <span>TOOLKIT:</span>
              <span className="text-[#A8AAA4] font-sans">{skills.join(" · ")}</span>
            </div>
          </section>
        )}

      </div>

      {/* Standalone Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-[#0B1117]/95 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#101820] border border-[#2b3b4d]/40 rounded-sm w-full max-w-3xl p-6 sm:p-10 relative font-mono text-xs text-[#A8AAA4] space-y-6">
            <button 
              onClick={() => setSelectedProject(null)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-sm"
            >
              [ CLOSE ]
            </button>
            <div className="border-b border-[#2b3b4d]/20 pb-4">
              <span className="text-[#E5A84B] text-[10px] tracking-widest uppercase">PROJECT CASE STUDY</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">{selectedProject.title}</h3>
            </div>
            <p className="leading-relaxed font-sans font-light text-sm">{selectedProject.description}</p>
            <div className="grid grid-cols-2 gap-4 border-t border-[#2b3b4d]/10 pt-4 text-[10px]">
              <div>
                <span className="text-gray-500">CATEGORY:</span>
                <div className="text-white mt-0.5">{selectedProject.category || "Development"}</div>
              </div>
              <div>
                <span className="text-gray-500">TECHNOLOGY:</span>
                <div className="text-[#E5A84B] mt-0.5">{selectedProject.tech.join(", ")}</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}`,
  minimal: `"use client";
import React from "react";
import { PortfolioData, Project } from "./portfolio-template";

export interface MinimalTemplateProps {
  data: PortfolioData;
}

export default function MinimalTemplate({ data }: MinimalTemplateProps) {
  const { personal, skills, projects } = data;
  const sortedProjects = [...(projects || [])].sort((a: Project, b: Project) => (a.order || 99) - (b.order || 99));

  return (
    <div className="bg-[#FAF9F6] text-[#111111] font-sans min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="flex justify-between items-center border-b border-[#111111]/10 pb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest">{personal.name}</span>
        </header>

        <section className="flex flex-col md:flex-row gap-8 justify-between items-start">
          <div className="space-y-4 max-w-xl">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111]">{personal.name}</h1>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-mono">{personal.role}</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light">{personal.bio}</p>
          </div>
          {personal.profileImage && (
            <img src={personal.profileImage} alt={personal.name} className="w-20 h-20 rounded-full object-cover" />
          )}
        </section>

        <section className="space-y-8">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400">Projects</h2>
          <div className="space-y-12">
            {sortedProjects.map((p: Project, idx: number) => (
              <div key={idx} className="border-b border-[#111111]/10 pb-8 space-y-4">
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.description}</p>
                <div className="text-xs text-gray-400 font-mono">{p.tech.join(" · ")}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}`,
  editorial: `"use client";
import React from "react";
import { PortfolioData, Project } from "./portfolio-template";

export interface EditorialTemplateProps {
  data: PortfolioData;
}

export default function EditorialTemplate({ data }: EditorialTemplateProps) {
  const { personal, projects } = data;

  return (
    <div className="bg-[#E8E2D5] text-[#1A1C18] font-serif min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="border-b border-[#1A1C18]/10 pb-6 flex justify-between text-xs font-mono">
          <span>{personal.name.toUpperCase()}</span>
          <span>{personal.role}</span>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-6">
            <h1 className="text-4xl sm:text-6xl font-light">{personal.name}</h1>
            <p className="text-lg text-[#3A3C37] font-light leading-relaxed">{personal.bio}</p>
          </div>
          {personal.profileImage && (
            <img src={personal.profileImage} alt={personal.name} className="md:col-span-4 w-48 h-64 object-cover rounded-sm" />
          )}
        </section>

        <section className="space-y-8">
          {projects?.map((proj: Project, idx: number) => (
            <div key={idx} className="border-t border-[#1A1C18]/10 pt-6">
              <h3 className="text-2xl font-normal">{proj.title}</h3>
              <p className="text-sm text-gray-700 mt-2">{proj.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}`,
  creative: `import React from "react"; import { PortfolioData } from "./portfolio-template"; export interface CreativeTemplateProps { data: PortfolioData; } export default function CreativeTemplate({ data }: CreativeTemplateProps) { return <div className="p-8"><h1>{data.personal.name}</h1><p>{data.personal.bio}</p></div>; }`,
  corporate: `import React from "react"; import { PortfolioData } from "./portfolio-template"; export interface CorporateTemplateProps { data: PortfolioData; } export default function CorporateTemplate({ data }: CorporateTemplateProps) { return <div className="p-8"><h1>{data.personal.name}</h1><p>{data.personal.bio}</p></div>; }`,
  experimental: `import React from "react"; import { PortfolioData } from "./portfolio-template"; export interface ExperimentalTemplateProps { data: PortfolioData; } export default function ExperimentalTemplate({ data }: ExperimentalTemplateProps) { return <div className="p-8"><h1>{data.personal.name}</h1><p>{data.personal.bio}</p></div>; }`
};

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized. GitHub login required." }, { status: 401 });
  }

  // 1. Get authenticated user login details
  const githubUser = await getAuthenticatedGitHubUser(token);
  if (!githubUser) {
    return NextResponse.json({ error: "Failed to authenticate GitHub user. Re-auth required." }, { status: 401 });
  }

  const { template, data } = await request.json();

  if (!template || !data) {
    return NextResponse.json({ error: "Missing template or portfolio configuration data." }, { status: 400 });
  }

  const owner = githubUser.login;
  let repoName = "portfolio";
  let htmlUrl = `https://github.com/${owner}/${repoName}`;
  let isUpdate = false;

  // 2. Check whether repository already exists and contains the REPOfolio marker
  try {
    const existsRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "repofolio-app",
      },
    });

    if (existsRes.ok) {
      // Check if it is a REPOfolio-managed repository by checking for the .repofolio file marker
      const markerRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/.repofolio`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "repofolio-app",
        },
      });

      if (markerRes.ok) {
        isUpdate = true;
        const repoInfo = await existsRes.json();
        htmlUrl = repoInfo.html_url;
      } else {
        // Fallback to "repofolio-portfolio" since default is not REPOfolio-managed
        repoName = "repofolio-portfolio";
        htmlUrl = `https://github.com/${owner}/${repoName}`;

        const secondaryExistsRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "repofolio-app",
          },
        });

        if (secondaryExistsRes.ok) {
          isUpdate = true;
          const repoInfo = await secondaryExistsRes.json();
          htmlUrl = repoInfo.html_url;
        }
      }
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Failed checking repository status: " + err.message }, { status: 500 });
  }

  // 3. Create repository on GitHub if it does not exist
  if (!isUpdate) {
    try {
      const createRes = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "repofolio-app",
        },
        body: JSON.stringify({
          name: repoName,
          description: `My portfolio generated with REPOfolio utilizing the ${template} template.`,
          private: false,
          auto_init: false,
        }),
      });

      if (!createRes.ok) {
        const errorMsg = await createRes.text();
        return NextResponse.json({ error: `GitHub repo creation failed: ${errorMsg}` }, { status: createRes.status });
      }

      const repoData = await createRes.json();
      htmlUrl = repoData.html_url;
    } catch (err: any) {
      return NextResponse.json({ error: "Failed creating repository: " + err.message }, { status: 500 });
    }
  }

  // Sanitize data object, stripping temporary browser blob URLs
  const sanitizedData = { ...data };
  if (sanitizedData.personal && sanitizedData.personal.profileImage?.startsWith("blob:")) {
    sanitizedData.personal.profileImage = "";
  }
  if (sanitizedData.projects) {
    sanitizedData.projects = sanitizedData.projects.map((proj: any) => {
      const sanitizedProj = { ...proj };
      if (sanitizedProj.image?.startsWith("blob:")) {
        sanitizedProj.image = "";
      }
      if (sanitizedProj.images) {
        sanitizedProj.images = sanitizedProj.images.map((img: string) => img.startsWith("blob:") ? "" : img);
      }
      return sanitizedProj;
    });
  }

  // 4. Generate standalone Next.js code files
  const pageContent = `import React from "react";
import PortfolioTemplate from "@/components/portfolio-template";

const portfolioData = ${JSON.stringify(sanitizedData, null, 2)};

export default function Home() {
  return (
    <PortfolioTemplate data={portfolioData} />
  );
}
`;

  const layoutContent = `import React from "react";
import "./globals.css";

export const metadata = {
  title: "${data.personal.name} — Portfolio",
  description: "${data.personal.role}",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0B1117] text-white">
        {children}
      </body>
    </html>
  );
}
`;

  let templateComponent = TEMPLATE_COMPONENTS.developer;
  if (template === "minimal") templateComponent = TEMPLATE_COMPONENTS.minimal;
  if (template === "editorial") templateComponent = TEMPLATE_COMPONENTS.editorial;
  if (template === "creative") templateComponent = TEMPLATE_COMPONENTS.creative;
  if (template === "corporate") templateComponent = TEMPLATE_COMPONENTS.corporate;
  if (template === "experimental") templateComponent = TEMPLATE_COMPONENTS.experimental;

  const packageJsonContent = `{
  "name": "my-portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "15.5.23",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "tailwindcss": "4.1.3",
    "@tailwindcss/postcss": "4.1.3",
    "postcss": "8.4.49",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.0.0"
  }
}
`;

  const readmeContent = `# ${data.personal.name} — Portfolio

Generated with REPOfolio utilizing the **${template}** template style.

## Getting Started

First, install dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy

You can deploy this Next.js project to **Vercel** with a single click:

1. Import this repository in the Vercel dashboard.
2. Click **Deploy**.
`;

  const globalsCssContent = `@import "tailwindcss";
body {
  margin: 0;
  padding: 0;
}
`;

  const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
module.exports = nextConfig;
`;

  const tsconfigJsonContent = `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;

  const postcssConfigContent = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`;

  const repofolioMarkerContent = `REPOfolio Managed Repository`;

  // Files list to push sequentially to Contents API
  const filesToPush = [
    { path: ".repofolio", content: repofolioMarkerContent },
    { path: "README.md", content: readmeContent },
    { path: "package.json", content: packageJsonContent },
    { path: "next.config.js", content: nextConfigContent },
    { path: "postcss.config.mjs", content: postcssConfigContent },
    { path: "tsconfig.json", content: tsconfigJsonContent },
    { path: "src/app/globals.css", content: globalsCssContent },
    { path: "src/app/layout.tsx", content: layoutContent },
    { path: "src/app/page.tsx", content: pageContent },
    { path: "src/components/portfolio-template.tsx", content: templateComponent }
  ];

  // 5. Push generated source files sequentially to GitHub
  try {
    for (const file of filesToPush) {
      let sha: string | undefined = undefined;

      // Fetch file SHA if it already exists to allow update commits
      if (isUpdate) {
        try {
          const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${file.path}`, {
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github+json",
              "User-Agent": "repofolio-app",
            },
          });
          if (fileRes.ok) {
            const fileData = await fileRes.json();
            sha = fileData.sha;
          }
        } catch {}
      }

      const pushRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${file.path}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "repofolio-app",
        },
        body: JSON.stringify({
          message: isUpdate ? `Update ${file.path}` : `Add ${file.path}`,
          content: Buffer.from(file.content).toString("base64"),
          sha,
        }),
      });

      if (!pushRes.ok) {
        const errText = await pushRes.text();
        return NextResponse.json({ error: `Failed to push ${file.path}: ${errText}` }, { status: 500 });
      }
    }

    // 6. Final verification call
    const verifyRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "repofolio-app",
      },
    });

    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Repository verification check failed." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      isUpdate,
      repository: {
        owner,
        name: repoName,
        htmlUrl,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to push repository: " + err.message }, { status: 500 });
  }
}
