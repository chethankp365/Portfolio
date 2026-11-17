export interface SkillCategory {
  category: string;
  command: string;
  description: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Cybersecurity & Offensive",
    command: "nmap -sV --script vuln",
    description: "Hands-on penetration testing, exploit analysis, and threat detection tooling",
    skills: [
      "Kali Linux",
      "Nmap",
      "Vulnerability Assessment",
      "SQLi",
      "XSS",
      "Privilege Escalation",
      "MITRE ATT&CK",
      "Sigma Rules"
    ]
  },
  {
    category: "Languages",
    command: "cat /proc/version && which python3",
    description: "Multi-paradigm programming for system exploits, scripting, and enterprise backends",
    skills: ["Python", "Java", "JavaScript", "TypeScript", "Dart"]
  },
  {
    category: "Web & Backend",
    command: "netstat -tuln | grep LISTEN",
    description: "High-performance microservices, APIs, and responsive front-end interfaces",
    skills: ["React", "FastAPI", "Spring Boot", "Flutter", "WebSockets", "REST"]
  },
  {
    category: "AI & ML",
    command: "python -c 'import torch; print(torch.cuda.is_available())'",
    description: "Agentic pipelines, computer vision, speech models, and generative LLMs",
    skills: [
      "PyTorch",
      "Whisper",
      "YOLOv8",
      "LLM Integration",
      "Prompt Engineering"
    ]
  },
  {
    category: "Data & Storage",
    command: "psql -U chethan -d security_db",
    description: "Relational, spatial, and vector database persistence with row-level security",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "SQLite"]
  },
  {
    category: "Tools & Infrastructure",
    command: "docker ps --format 'table {{.Names}}\t{{.Status}}'",
    description: "Containerization, automated deployment, constraint optimization, and design",
    skills: ["Git", "Docker", "Ansible", "Figma", "OR-Tools", "CP-SAT"]
  }
];

