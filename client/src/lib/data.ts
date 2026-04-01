/*
 * PSP Portfolio — Data Layer
 * Design: Y2K Futurism / Sony XMB Interface
 * All portfolio content is centralized here for easy editing.
 */

export const WAVE_BACKGROUNDS = {
  blue: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390118009/HdL3XfgffMxqYaueysqd54/psp-wave-bg-FpiQGyojB3UPxmkXwgFp5F.webp",
  green: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390118009/HdL3XfgffMxqYaueysqd54/psp-wave-green-KaLYbGVtKyZ7nxkAxnPiyi.webp",
  orange: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390118009/HdL3XfgffMxqYaueysqd54/psp-wave-orange-WGanSMvRx35tiFjApT2TWs.webp",
  purple: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390118009/HdL3XfgffMxqYaueysqd54/psp-wave-purple-6ydTCNsUbiwaiN7icHo8M7.webp",
};

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  bgKey: keyof typeof WAVE_BACKGROUNDS;
  items: CategoryItem[];
}

export interface CategoryItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  meta?: Record<string, string>;
  /** Generic open action (mailto, external, etc.) */
  link?: string;
  /** Primary project / demo site — shown as main button in project detail */
  websiteUrl?: string;
  /** YouTube (or youtu.be) URL — embedded in project detail when set */
  videoUrl?: string;
  /** Project: your role (lead dev, full-stack, etc.) */
  myRole?: string;
  /** Project: screenshot carousel URLs */
  screenshots?: string[];
  /** Project: source repo */
  repoUrl?: string;
  /** Project: live demo (if different from websiteUrl) */
  demoUrl?: string;
}

/** Global strings used across the shell and simple layout — edit GitHub URL here. */
export const OWNER = {
  name: "Mohamed Sawan",
  title: "Software Engineer",
  tagline: "Building the future, one line of code at a time.",
  /** Public path — replace `client/public/resume.pdf` with your real résumé when ready. */
  resumePdfUrl: "/resume.pdf",
  githubUrl: "https://github.com/m7mdsawan",
};

export const categories: Category[] = [
  {
    id: "profile",
    label: "Profile",
    icon: "User",
    color: "#0070d1",
    bgKey: "blue",
    items: [
      {
        id: "about",
        title: "About Me",
        subtitle: "Software Engineering Student",
        description:
          "Senior Software Engineering student with proven experience leading large development teams and shipping production applications. Strong track record in full-stack web and mobile development, technical leadership, and project management. Successfully launched live platforms including an interactive quiz system, automated booking interfaces, and an AI-powered tourism application.",
      },
      {
        id: "education",
        title: "Education",
        subtitle: "Al Yamamah University — Riyadh, Saudi Arabia",
        description: "B.Sc. in Software Engineering",
        meta: {
          GPA: "3.72 / 4.00",
          Graduation: "Expected June 2026",
          Honors: "Dean's List (2023–2026)",
        },
      },
      {
        id: "languages",
        title: "Languages",
        subtitle: "Bilingual Proficiency",
        meta: {
          English: "High-level professional proficiency",
          Arabic: "Native proficiency",
        },
      },
      {
        id: "resume-umd",
        title: "Resume — UMD",
        subtitle: "Portfolio disc · PDF download",
        description:
          "A minimal placeholder PDF ships at `client/public/resume.pdf` so the download works out of the box—replace that file with your final résumé.",
        link: OWNER.resumePdfUrl,
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    icon: "Gamepad2",
    color: "#00c853",
    bgKey: "green",
    items: [
      {
        id: "khatak",
        title: "Khatak — Tourism App",
        subtitle: "PwC Empowerthon",
        description:
          "A React Native app generating quests based on user mood. Integrated OpenAI API for quest generation and an AI voice guide for destination storytelling. Used Google Maps API for navigation and Whisper for cost-efficient voice-based interaction.",
        tags: ["React Native", "OpenAI API", "Google Maps", "Whisper"],
        myRole: "Full-stack mobile — OpenAI + Maps integration, voice pipeline",
        screenshots: [
          "https://picsum.photos/seed/khatak-a/800/450",
          "https://picsum.photos/seed/khatak-b/800/450",
          "https://picsum.photos/seed/khatak-c/800/450",
        ],
        demoUrl: "https://example.com/khatak-demo",
        repoUrl: "https://github.com/example/khatak",
        // websiteUrl: "https://your-demo-or-store-link.com",
        // videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID",
      },
      {
        id: "uthor",
        title: "Uthor — Mineral Analysis Tool",
        subtitle: "1st Place (Regional) — Future Minerals Pioneers Hackathon 2025",
        description:
          "An AI-powered mineral analysis tool developed during the Future Minerals Pioneers Hackathon. Advanced to global finals competing against 50+ countries.",
        tags: ["AI/ML", "Hackathon Winner", "Global Finals"],
        myRole: "ML + product demo — model integration, hackathon submission lead",
        screenshots: [
          "https://picsum.photos/seed/uthor-a/800/450",
          "https://picsum.photos/seed/uthor-b/800/450",
        ],
        demoUrl: "https://example.com/uthor-demo",
        repoUrl: "https://github.com/example/uthor",
      },
      {
        id: "fazzah",
        title: "Fazzah — Live Quiz Platform",
        subtitle: "3,000+ Users in First Month",
        description:
          "Launched a real-time interactive quiz platform that reached 3,000+ users within the first month of deployment. Features live scoring, real-time updates, and engaging quiz mechanics.",
        tags: ["Real-time", "WebSockets", "3K+ Users"],
        myRole: "Full-stack — realtime engine, deployment, early growth",
        screenshots: ["https://picsum.photos/seed/fazzah-a/800/450", "https://picsum.photos/seed/fazzah-b/800/450"],
        demoUrl: "https://example.com/fazzah-demo",
        repoUrl: "https://github.com/example/fazzah",
      },
      {
        id: "yu-communities",
        title: "YU Communities",
        subtitle: "React Native App",
        description:
          "Cross-platform mobile app for students to track and register for campus club activities at Al Yamamah University.",
        tags: ["React Native", "Cross-platform", "Student Life"],
        myRole: "Mobile + API — student-facing flows, club admin features",
        screenshots: ["https://picsum.photos/seed/yu-comm-a/800/450"],
        demoUrl: "https://example.com/yu-communities-demo",
        repoUrl: "https://github.com/example/yu-communities",
      },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    icon: "Cpu",
    color: "#ff6d00",
    bgKey: "orange",
    items: [
      {
        id: "languages-prog",
        title: "Languages",
        subtitle: "Programming & Markup",
        meta: {
          JavaScript: "90",
          Python: "75",
          Java: "70",
          HTML: "95",
          CSS: "90",
        },
      },
      {
        id: "frameworks",
        title: "Frameworks",
        subtitle: "Libraries & Platforms",
        meta: {
          React: "90",
          "React Native": "85",
          "Three.js": "60",
          "PyTorch": "40",
        },
      },
      {
        id: "tools",
        title: "APIs & Tools",
        subtitle: "Development Ecosystem",
        meta: {
          "OpenAI API": "80",
          "Google Maps API": "75",
          Whisper: "70",
          Git: "90",
          GitHub: "90",
          Webflow: "75",
          Salla: "70",
        },
      },
      {
        id: "soft-skills",
        title: "Soft Skills",
        subtitle: "Leadership & Communication",
        description:
          "Team leadership, project/time management, mentorship of 45+ students across 9 projects. Excellent public speaker with strong written/verbal communication. Passionate fast learner who exceeds deadlines.",
        tags: ["Leadership", "Public Speaking", "Mentorship", "Project Management"],
      },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    icon: "Briefcase",
    color: "#9c27b0",
    bgKey: "purple",
    items: [
      {
        id: "gdsc",
        title: "Tech & Innovation Leader",
        subtitle: "Google Developer Student Club",
        description:
          "Lead a technical department of 45+ students, overseeing the development and delivery of 9 major projects. Direct project lifecycles and technical strategy, providing hands-on mentorship to 28+ students per term. Facilitate Git & GitHub workshops for 76+ students.",
        meta: {
          Period: "Jan 2025 – Present",
          Team: "45+ Students",
          Projects: "9 Major Projects",
        },
      },
      {
        id: "freelance",
        title: "IT Specialist (Freelance)",
        subtitle: "INTHEINNER WELLBEING CENTER",
        description:
          "Engineered a custom React booking system with custom UI at half the cost of existing solutions. Architected and deployed a Salla e-commerce storefront, enabling online sales and bookings. Enhanced Webflow website features and translated content.",
        meta: {
          Period: "Oct 2025 – Present",
          Stack: "React, Salla, Webflow",
        },
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    icon: "Mail",
    color: "#0070d1",
    bgKey: "blue",
    items: [
      {
        id: "email",
        title: "Email",
        subtitle: "mohamed.sawan041@gmail.com",
        link: "mailto:mohamed.sawan041@gmail.com",
      },
      {
        id: "linkedin",
        title: "LinkedIn",
        subtitle: "linkedin.com/in/mohamedsawan",
        link: "https://linkedin.com/in/mohamedsawan",
      },
      {
        id: "github",
        title: "GitHub",
        subtitle: OWNER.githubUrl.replace(/^https:\/\//, ""),
        link: OWNER.githubUrl,
      },
      {
        id: "phone",
        title: "Phone",
        subtitle: "+966 599755297",
        link: "tel:+966599755297",
      },
      {
        id: "location",
        title: "Location",
        subtitle: "Riyadh, Saudi Arabia",
      },
      {
        id: "resume-umd-contact",
        title: "UMD — Résumé (PDF)",
        subtitle: "Download portfolio résumé",
        description:
          "Same file as Profile → Resume — UMD. Replace `client/public/resume.pdf` with your own PDF anytime.",
        link: OWNER.resumePdfUrl,
      },
    ],
  },
  {
    id: "games",
    label: "Games",
    icon: "Joystick",
    color: "#ff4081",
    bgKey: "purple",
    items: [
      {
        id: "mini-snake",
        title: "Grid Snake",
        subtitle: "Arrows or D-Pad",
        description:
          "Steer the snake, eat the dots, don’t hit the walls or yourself. ✕ restarts after game over. ○ goes back to the list.",
        tags: ["D-Pad", "✕"],
      },
      {
        id: "mini-catch",
        title: "Catch",
        subtitle: "Left / Right",
        description:
          "Move the paddle to catch falling sparks (◀ ▶ or WASD). Three misses and it’s over. ✕ restarts when game over.",
        tags: ["◀ ▶", "WASD"],
      },
      {
        id: "mini-reaction",
        title: "Reaction",
        subtitle: "One button",
        description:
          "Tap when the panel turns green. Too early fails the round. ✕ or Enter / Space to play.",
        tags: ["✕", "Tap"],
      },
    ],
  },
];
