export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  department?: string;
  period: string;
  location: string;
  type: string;
  isCurrent?: boolean;
  description: string;
  bullets: string[];
  tags: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  university: string;
  period: string;
  grade: string;
  location: string;
  description: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  platform?: string;
  code?: string;
}

export const experiences: ExperienceItem[] = [
  {
    id: "cynaris-cybersecurity",
    role: "Cyber Security Intern",
    organization: "Cynaris Solutions Pvt. Ltd.",
    department: "Software & Technology Department",
    period: "Nov 2026 – Jan 2027",
    location: "Bengaluru, India",
    type: "Part-time, Hybrid",
    isCurrent: true,
    description: "Hands-on, lab-based offensive-security internship focused on offensive testing, vulnerability discovery, and forensics.",
    bullets: [
      "Operated a dedicated personal security lab configured with Kali Linux and vulnerable target virtual machines.",
      "Conducted network reconnaissance and comprehensive vulnerability scans across lab subnets.",
      "Executed targeted web application security assessments against OWASP Top 10 vulnerabilities.",
      "Performed controlled exploitation exercises and privilege escalation on vulnerable lab VMs.",
      "Conducted digital forensics investigations analyzing disk images, memory dumps, and artifacts.",
      "Authored professional penetration testing reports featuring CVSS-rated vulnerability findings and remediation guidance."
    ],
    tags: [
      "Responsible disclosure",
      "Ethical hacking",
      "OWASP Top 10",
      "CVSS",
      "Forensics"
    ]
  },
  {
    id: "codsoft-ui-ux",
    role: "Virtual UI/UX Design Intern",
    organization: "CodSoft",
    period: "Jun 2026 – Jul 2026",
    location: "Remote",
    type: "Virtual Internship",
    isCurrent: false,
    description: "Designed intuitive user flows, wireframes, and interactive prototypes in Figma for multiple product-based tasks, refining layouts based on usability principles.",
    bullets: [
      "Designed wireframes, design systems, and responsive layouts tailored for web and mobile interfaces.",
      "Conducted iterative usability evaluations to optimize interaction flows and accessibility.",
      "Created high-fidelity interactive Figma prototypes with realistic user micro-interactions."
    ],
    tags: ["Figma", "UI/UX", "Wireframing", "Interaction Design", "Usability"]
  },
  {
    id: "rotaract-fullstack",
    role: "Full Stack Web Development Intern",
    organization: "Rotaract Club of Atria I.T. × Dept. of CSE",
    period: "Mar 2025 – Jun 2025",
    location: "Bengaluru, India",
    type: "Internship",
    isCurrent: false,
    description: "Engineered Campus Connect, a full-stack campus communication platform using the MERN stack.",
    bullets: [
      "Architected the backend REST APIs and secure authentication flows in Node.js and Express.js.",
      "Developed dynamic interactive front-end views using React and Tailwind.",
      "Ranked among the Top 8 out of 60+ projects evaluated across the internship cohort."
    ],
    tags: ["React", "Node.js", "Express.js", "MongoDB", "MERN Stack"]
  }
];

export const education: EducationItem = {
  degree: "B.E. Computer Science and Design Engineering",
  institution: "Atria Institute of Technology, Bengaluru",
  university: "Visvesvaraya Technological University (VTU)",
  period: "2023 – 2027",
  grade: "CGPA 7.8",
  location: "Bengaluru, Karnataka",
  description: "Final-year undergraduate blending core computer science, systems programming, and design engineering principles with a specialized passion for ethical hacking and defensive architectures."
};

export const certifications: CertificationItem[] = [
  {
    name: "Ethical Hacker",
    issuer: "Cisco Networking Academy",
    platform: "Cisco"
  },
  {
    name: "Artificial Intelligence Fundamentals",
    issuer: "IBM SkillsBuild",
    platform: "IBM"
  },
  {
    name: "Applied API Testing & Automation with Postman",
    issuer: "EDUCBA",
    platform: "Coursera"
  },
  {
    name: "Unmanned Aerial Systems: Operations",
    issuer: "University of Alaska Fairbanks",
    platform: "Coursera"
  }
];

