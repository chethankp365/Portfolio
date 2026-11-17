export interface ProjectLink {
  label: string;
  url: string;
  type?: "live" | "github" | "apk" | "external";
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  bullets: string[];
  stack: string[];
  liveUrl: string;
  githubUrl: string;
  featured?: boolean;
  extraLinks?: ProjectLink[];
}

export const projects: Project[] = [
  {
    slug: "no-entry",
    title: "NO ENTRY",
    tagline: "AI-Powered Cybersecurity Training Platform & Isolated Cyber Range",
    bullets: [
      "Built an 80-room cybersecurity training platform across 4 tracks (Red Team, Blue Team, Purple Team, Detection Engineering); fully implemented all 20 Red Team rooms covering reconnaissance, SQL injection, XSS, command injection, privilege escalation, and more.",
      "Developed a Docker-based isolated cyber range with disposable attacker and vulnerable target containers, running real commands inside live lab containers instead of simulated terminal output.",
      "Engineered a FastAPI backend with session management, task validation, flags, hints, XP progression, and YAML-driven scenarios; integrated GHOST AI Mentor with a multi-provider LLM architecture for contextual guidance.",
      "Validated the platform with 168 passing automated tests in the latest full regression run."
    ],
    stack: [
      "Python",
      "FastAPI",
      "Docker",
      "SQLModel",
      "PostgreSQL",
      "WebSockets",
      "JavaScript",
      "YAML",
      "MITRE ATT&CK"
    ],
    liveUrl: "https://no-entry.onrender.com/",
    githubUrl: "https://github.com/chethankp365/NO-ENTRY",
    featured: true
  },
  {
    slug: "udyogasethu",
    title: "UdyogaSethu",
    tagline: "Multilingual Workforce & Farm Marketplace",
    bullets: [
      "Voice-first mobile platform connecting informal workers and small farmers with customers via GPS-based service matching and farm-to-consumer commerce, integrating 5 AI services (Deepgram, Groq, Gemini, OpenRouter, Hugging Face).",
      "Designed a trust and safety architecture with 6 safeguards (identity and QR job verification, face/liveness checks, live GPS tracking, one-tap SOS, secure chat), enforced with PostgreSQL Row Level Security.",
      "Developed a Spring Boot and Vaadin admin portal; prototyped 3 user journeys (worker, farmer, customer) in Figma."
    ],
    stack: [
      "Flutter",
      "Supabase",
      "PostgreSQL/PostGIS",
      "Spring Boot",
      "Deepgram",
      "Groq",
      "Gemini"
    ],
    liveUrl: "https://udyogasethu-admin.onrender.com/",
    githubUrl: "https://github.com/chethankp365/UdyogaSethu",
    featured: false,
    extraLinks: [
      {
        label: "Admin GitHub",
        url: "https://github.com/chethankp365/UdyogaSethu-Admin",
        type: "github"
      },
      {
        label: "Mobile APK",
        url: "https://drive.google.com/file/d/1f6fvaAMZZhQ-E97YEeMnLMw5GF81H0Qy/view",
        type: "apk"
      }
    ]
  },
  {
    slug: "safecomm",
    title: "SafeComm",
    tagline: "Real-Time Aviation Speech AI System",
    bullets: [
      "Built a real-time pipeline that transcribes ATC radio, extracts flight instructions, and detects incorrect pilot read-backs within ~2 seconds, with a sub-5 ms local regex fallback.",
      "Cross-checked alerts against live ADS-B and ATIS data with confidence-aware scoring, and built a live monitoring dashboard with error-injection testing."
    ],
    stack: [
      "React",
      "TypeScript",
      "Python",
      "Whisper",
      "FastAPI",
      "Supabase",
      "Gemini",
      "Groq"
    ],
    liveUrl: "https://safecomm.vercel.app/",
    githubUrl: "https://github.com/chethankp365/SafeComm",
    featured: false
  },
  {
    slug: "satquery",
    title: "SATQUERY",
    tagline: "AI-Powered Satellite Vision-Language Assistant",
    bullets: [
      "Developed an agentic vision-language assistant for natural-language queries on optical and SAR satellite imagery, combining YOLOv8 detection, SSIM/CVA change detection, NDVI/NDWI/NBR indices, and SAR–optical fusion.",
      "Delivered evidence-grounded insights and change maps via a COG/GeoJSON pipeline with a MongoDB audit trail; ranked Top 4 in the SIH Internal Hackathon (Software Edition)."
    ],
    stack: [
      "React",
      "TypeScript",
      "Python",
      "Gemini 2.5 VLM",
      "YOLOv8",
      "GDAL/GeoTIFF",
      "MongoDB"
    ],
    liveUrl: "https://sat-query-ai-murex.vercel.app/",
    githubUrl: "https://github.com/chethankp365/SatQuery-AI",
    featured: false
  },
  {
    slug: "campus-connect",
    title: "Campus Connect",
    tagline: "Full-Stack Campus Communication Platform",
    bullets: [
      "Full-stack campus communication platform built on the MERN stack.",
      "Ranked among the Top 8 out of 60+ projects across the Rotaract Club of Atria I.T. × Dept. of CSE internship cohort."
    ],
    stack: ["React", "Node.js", "Express.js", "MongoDB"],
    liveUrl: "https://campus-connect-beta-weld.vercel.app/",
    githubUrl: "https://github.com/chethankp365/CampusConnect",
    featured: false
  },
  {
    slug: "aahat",
    title: "AAHAT",
    tagline: "Railway Defect Monitoring System (Smart India Hackathon)",
    bullets: [
      "Smart India Hackathon 2026 railway defect monitoring and track safety system developed at Atria Institute of Technology.",
      "Applies computer vision algorithms to detect surface cracks, missing fasteners, and rail alignment anomalies."
    ],
    stack: ["Computer Vision", "Python", "Deep Learning"],
    liveUrl: "https://aahat.vercel.app/",
    githubUrl: "https://github.com/chethankp365/Aahat",
    featured: false
  },
  {
    slug: "rakshaan",
    title: "Rakshaan",
    tagline: "Autonomous Tactical Rescue & Drone Operations",
    bullets: [
      "Unmanned Aerial Systems (UAS) platform tailored for tactical emergency reconnaissance and disaster response.",
      "Field evaluation in progress; complete technical specification and architecture details coming soon."
    ],
    stack: ["UAS / Drones", "Autonomous Systems", "Details Coming Soon"],
    liveUrl: "",
    githubUrl: "https://github.com/chethankp365/Rakshaan",
    featured: false
  },
  {
    slug: "ecobrain-ai",
    title: "EcoBrain AI",
    tagline: "AI Waste-Management & Dynamic Route-Optimization",
    bullets: [
      "AI waste-management and municipal route-optimisation project with a Bengaluru pilot focus.",
      "Formulates and solves vehicle routing problems with constraint satisfaction and large neighborhood search techniques."
    ],
    stack: ["OR-Tools", "CP-SAT", "LNS", "Python"],
    liveUrl: "https://eco-brain-ai.vercel.app/",
    githubUrl: "https://github.com/chethankp365/EcoBrain-AI",
    featured: false
  }
];
