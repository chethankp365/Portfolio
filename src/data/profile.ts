import { experiences, education, certifications } from "./experience";
import { projects } from "./projects";
import { skillCategories } from "./skills";

export const profile = {
  heroName: "CHETHAN KUMAR",
  displayName: "Chethan Kumar",
  title: "Chethan Kumar — Aspiring Ethical Hacker & Cybersecurity Learner",
  metaDescription:
    "Portfolio of Chethan Kumar: final-year Computer Science and Design Engineering student at Atria Institute of Technology, building cyber ranges, offensive security labs, and AI-driven platforms.",
  email: "chethankp365@gmail.com",
  statusLine: "actively open to Cybersecurity & Red Team opportunities",
  summary:
    "I build cyber ranges, AI-powered security tools and full-stack systems — then break them ethically to make them stronger. An 80-room training platform, 168 passing tests and a Top 4 at SIH so far. Now looking for a red team or cybersecurity opportunity where I can learn fast and ship faster.",
  whoami:
    "I'm Chethan, a final-year Computer Science and Design Engineering student from Bengaluru, studying at Atria Institute of Technology. Cybersecurity is what I want to do for a living, and Kali Linux is my playground. My design background shapes how I build: security that real people can actually use. I learn by turning every idea into a project, from cyber ranges to rescue drones to railway safety.",
  roles: [
    "Aspiring Ethical Hacker",
    "Cybersecurity Learner",
    "Cyber Range Builder",
    "AI + Security Builder"
  ],
  links: {
    github: "https://github.com/chethankp365",
    linkedin: "https://www.linkedin.com/in/chethan-kumar-kp17/",
    youtube: "https://www.youtube.com/@CHETHANKUMARKP-v6w",
    instagram: "https://www.instagram.com/chethankumarkp_/"
  },
  counters: [
    {
      value: 80,
      suffix: "",
      label: "cyber-range rooms built",
      subtext: "4 tracks: Red, Blue, Purple, Detection"
    },
    {
      value: 168,
      suffix: "",
      label: "automated tests passing",
      subtext: "Full regression & container test suite"
    },
    {
      value: 8,
      suffix: "",
      label: "projects shipped",
      subtext: "Cyber ranges, AI tools, and platforms"
    },
    {
      value: 4,
      prefix: "Top ",
      suffix: "",
      label: "rank, SIH Internal Hackathon",
      subtext: "Smart India Hackathon Software Edition"
    }
  ],
  cvPath: "/ChethanKumar.CV.pdf",
  photoPath: "/images/chethan.png",
  copyright: "© 2026 Chethan Kumar — all systems nominal"
};

/**
 * Single source of truth knowledge base for ZER0 AI assistant.
 * Strictly bounded: no phone number, no address, no fabrications.
 */
export const knowledge = {
  about: {
    name: profile.displayName,
    legalName: profile.displayName,
    heroName: profile.heroName,
    publicEmail: profile.email,
    location: "Bengaluru, Karnataka, India",
    education: {
      degree: education.degree,
      institution: education.institution,
      university: education.university,
      period: education.period,
      cgpa: education.grade
    },
    status: profile.statusLine,
    careerGoal:
      "Cybersecurity, ethical hacking, vulnerability assessment, threat detection, and red teaming.",
    favoriteTool: "Kali Linux",
    designPhilosophy:
      "My design background shapes how I build: security that real people can actually use.",
    summary: profile.summary,
    whoami: profile.whoami,
    links: profile.links,
    cvPath: profile.cvPath
  },
  metrics: profile.counters,
  experience: experiences,
  certifications: certifications,
  projects: projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    bullets: p.bullets,
    stack: p.stack,
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
    extraLinks: p.extraLinks,
    featured: p.featured ?? false
  })),
  skills: skillCategories
};

