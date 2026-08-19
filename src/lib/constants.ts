export interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  image?: string;
  images?: string[];
  year?: string;
  category?: string;
  featured?: boolean;
  order?: number;
  role?: string;
  duration?: string;
  challenge?: string;
  solution?: string;
  outcome?: string;
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

export interface PersonalInfo {
  name: string;
  role: string;
  bio: string;
  location: string;
  github: string;
  linkedin: string;
  email?: string;
  profileImage?: string;
  availability?: string;
}

export interface PortfolioData {
  personal: PersonalInfo;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  services?: Service[];
  stats?: Stat[];
}

export const DHANUSH_MOCK_DATA: PortfolioData = {
  personal: {
    name: "Dhanush Maddila",
    role: "Software Engineer",
    bio: "Building clean, high-performance systems with Java, React & Node. Focus on developer tooling, distributed architectures, and web technology.",
    location: "San Francisco, CA",
    github: "dhanush",
    linkedin: "dhanush-maddila",
    email: "dhanush@maddila.dev",
    profileImage: "",
    availability: "Available for work"
  },
  skills: ["Java", "React", "Node.js", "TypeScript", "Next.js", "Docker", "PostgreSQL", "Tailwind CSS"],
  projects: [
    {
      title: "REPOfolio",
      description: "A client-side developer portfolio compiler and codebase exporter that helps engineers own their public presence.",
      tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
      link: "github.com/dhanush/repofolio",
      year: "2026",
      category: "Developer Tooling",
      featured: true,
      order: 1
    },
    {
      title: "CityPulse",
      description: "Real-time municipal service tracking dashboard compiling transport metrics.",
      tech: ["Java", "Spring Boot", "Kafka"],
      link: "github.com/dhanush/citypulse",
      year: "2025",
      category: "Data Pipeline",
      featured: false,
      order: 2
    }
  ],
  experience: [
    {
      role: "Software Engineering Intern",
      company: "Apex Tech Systems",
      duration: "Jun 2025 - Aug 2025",
      description: "Migrated high-throughput query pipelines to Node.js microservices."
    }
  ],
  services: [
    { title: "Frontend Engineering", description: "Responsive layouts, React app compilers, and clean performance optimization." },
    { title: "Distributed Pipelines", description: "Designing low-latency Kafka systems and serverless backend layers." }
  ],
  stats: [
    { label: "Projects Completed", value: "12+" },
    { label: "Happy Clients", value: "20+" }
  ]
};

export const MAYA_CHEN_DATA: PortfolioData = {
  personal: {
    name: "Maya Chen",
    role: "Product Designer",
    bio: "Designing minimalist interfaces, design systems, and visual narratives. Merging creative vision with pixel-perfect layouts.",
    location: "Brooklyn, NY",
    github: "mayachen",
    linkedin: "maya-chen-design",
    email: "hello@mayachen.com",
    profileImage: "",
    availability: "Open to opportunities"
  },
  skills: ["Interface Design", "Design Systems", "Figma", "Webflow", "React", "Typography"],
  projects: [
    {
      title: "Archetype Studio",
      description: "A typography playground exploring fluid scales, editorial grids, and minimal web graphics layouts.",
      tech: ["Figma", "CSS Grid", "Next.js"],
      year: "2026",
      category: "Editorial Design",
      featured: true,
      order: 1
    }
  ],
  experience: [
    {
      role: "Lead Product Designer",
      company: "Studio Narrative",
      duration: "2024 - Present",
      description: "Established design frameworks and scaled design systems for startups."
    }
  ],
  services: [
    { title: "Design Systems", description: "Structuring atomic design systems ready to compile directly into component libraries." }
  ]
};

export const ARJUN_RAO_DATA: PortfolioData = {
  personal: {
    name: "Arjun Rao",
    role: "Visual Photographer",
    bio: "Capturing architecture, structural geometry, and minimal spaces. Exploring the play of light and shadow.",
    location: "Mumbai, IN",
    github: "arjunrao",
    linkedin: "arjun-rao-photo",
    email: "contact@arjunrao.co",
    profileImage: "",
    availability: "Freelance"
  },
  skills: ["Creative Direction", "Lighting", "Color Grading", "Post Production"],
  projects: [
    {
      title: "Residence 04",
      description: "Photo essay documenting Brutalist residential concrete structures in Northern India.",
      tech: ["Fine Art", "Medium Format"],
      year: "2026",
      category: "Architecture",
      featured: true,
      order: 1
    }
  ],
  experience: [
    {
      role: "Independent Photographer",
      company: "Self Employed",
      duration: "2022 - Present",
      description: "Commissioned by architectural journals and design studios."
    }
  ]
};

export const SARAH_WILLIAMS_DATA: PortfolioData = {
  personal: {
    name: "Sarah Williams",
    role: "Strategy Consultant",
    bio: "Helping fast-growth technology companies optimize operations, establish metrics, and execute strategic integrations.",
    location: "London, UK",
    github: "",
    linkedin: "sarah-williams-strategy",
    email: "sarah@williams.consulting",
    profileImage: "",
    availability: "Not currently available"
  },
  skills: ["Operational Growth", "Business Strategy", "Fintech Integration", "Operations"],
  projects: [
    {
      title: "ScaleOps Integration",
      description: "Re-engineered core customer support operations pipelines, boosting productivity indices by 34%.",
      tech: ["Growth Model", "KIP Mapping"],
      year: "2026",
      category: "Operations Upgrade",
      featured: true,
      order: 1
    }
  ],
  experience: [
    {
      role: "Senior Operations Consultant",
      company: "Vanguard Partners",
      duration: "2023 - Present",
      description: "Direct business operational strategies for high-value B2B SaaS organizations."
    }
  ]
};

export const NOAH_KIM_DATA: PortfolioData = {
  personal: {
    name: "Noah Kim",
    role: "Creative Technologist",
    bio: "Building slightly experimental interactive interfaces, dynamic canvas modules, and odd digital toys.",
    location: "Seoul, KR",
    github: "noahkim",
    linkedin: "noah-kim-creative",
    email: "hello@noahkim.io",
    profileImage: "",
    availability: "Available for work"
  },
  skills: ["WebGL", "Three.js", "Creative Coding", "React Canvas", "Rust", "WASM"],
  projects: [
    {
      title: "Orbit Sandbox",
      description: "An interactive particle gravitational orbital simulation floating dynamically in the browser.",
      tech: ["Three.js", "WASM", "Rust"],
      year: "2026",
      category: "Canvas Sandbox",
      featured: true,
      order: 1
    }
  ],
  experience: [
    {
      role: "Interactive Developer",
      company: "Decentralized Creative Lab",
      duration: "2024 - Present",
      description: "Prototyped hardware installations and web canvas systems."
    }
  ]
};

export const EDITORIAL_TEMPLATE = MAYA_CHEN_DATA;
export const MINIMAL_TEMPLATE = ARJUN_RAO_DATA;
