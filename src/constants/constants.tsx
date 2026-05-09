import React from 'react';

export const Icons: Record<string, React.FC> = {
  Github: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.25C6.48 2.25 2 6.73 2 12.25c0 4.41 3.03 8.14 7.17 9.49.52.09.71-.22.71-.47 0-.24-.02-.89-.03-1.74-2.93.63-3.54-1.41-3.54-1.41-.48-1.2-1.18-1.52-1.18-1.52-.96-.65.07-.64.07-.64 1.06.07 1.62 1.08 1.62 1.08 1.17 2.01 3.05 1.43 3.79 1.08.12-.85.46-1.43.83-1.76-2.94-.34-6.03-1.47-6.03-6.54 0-1.44.52-2.63 1.38-3.56-.14-.34-.6-1.72.13-3.58 0 0 1.06-.34 3.5 1.31 1.02-.28 2.11-.42 3.19-.42 1.08 0 2.17.14 3.19.42 2.44-1.65 3.5-1.31 3.5-1.31.74 1.86.28 3.24.13 3.58.86.93 1.38 2.12 1.38 3.56 0 5.08-3.09 6.2-6.03 6.54.48.42.92 1.28.92 2.61 0 1.89-.03 3.41-.03 3.87 0 .25.19.56.72.46 4.13-1.35 7.17-5.08 7.17-9.49 0-5.52-4.48-10-10-10z" />
    </svg>
  ),
  Linkedin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Code: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Layout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="9" x2="9" y1="21" y2="9" />
    </svg>
  ),
  Smartphone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  ExternalLink: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  ),
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Sun: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2" />
      <path d="M12 21v2" />
      <path d="M4.22 4.22l1.42 1.42" />
      <path d="M18.36 18.36l1.42 1.42" />
      <path d="M1 12h2" />
      <path d="M21 12h2" />
      <path d="M4.22 19.78l1.42-1.42" />
      <path d="M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  Moon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  ArrowUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6" />
    </svg>
  ),
};

export type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  link: string;
  githubLink?: string;
  tags: string[];
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Ever Teams',
    description: 'Ever Teams is a comprehensive work and project management platform designed to streamline team collaboration. It enables real-time task management, time tracking, productivity monitoring, and seamless integration with popular tools like GitHub and JIRA, empowering teams to deliver projects efficiently.',
    category: 'Web',
    image: '/images/Projects/project1.png',
    link: 'https://app.ever.team/',
    githubLink: 'https://github.com/ever-co/ever-teams',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Time Tracking']
  },
  {
    id: 2,
    title: 'Ever Gauzy Platform',
    description: 'Ever Gauzy Platform is an open-source business management solution that integrates ERP, CRM, HRM, accounting, and project management functionalities. It provides companies with a unified system to manage employees, projects, finances, and operations, enhancing productivity and decision-making.',
    category: 'Web',
    image: '/images/Projects/project2.png',
    link: 'https://gauzy.co/',
    githubLink: 'https://github.com/ever-co/ever-gauzy',
    tags: ['Angular', 'Nest.js', 'PostgreSQL', 'TypeORM']
  },
  {
    id: 3,
    title: 'Acho System',
    description: 'Acho System is a secure and sustainable financial platform offering payment and investment solutions specifically designed for civil servants and employees worldwide. Leveraging microservices architecture, it ensures robust security, scalability, and user-friendly experiences for managing personal finances effectively.',
    category: 'Web',
    image: '/images/Projects/acho.png',
    link: 'https://acho-turbo-fr-website.vercel.app/',
    githubLink: 'https://github.com/ACHO-SYSTEM',
    tags: ['Next.js', 'Nest.js', 'PostgreSQL', 'RabbitMQ', 'Redis', 'Micro Servies', 'TypeORM', 'Turbo']
  },
  {
    id: 4,
    title: 'HIÜRD',
    description: 'HIÜRD is a trusted local service marketplace connecting people for everyday tasks. It facilitates hiring and getting hired through secure payments, local connections, and a focus on building community trust, making it easy to find reliable help for various services.',
    category: 'App',
    image: '/images/Projects/hiurd.webp',
    link: 'https://hiurd.com/',
    githubLink: 'https://github.com/HIURD',
    tags: ['React Native', 'Nest.js', 'Stripe', 'TypeORM', 'Mobile']
  },
  {
    id: 5,
    title: 'AdminAtete',
    description: 'AdminAtete is a document archiving application that digitizes and organizes business documents for secure storage and easy access. It helps companies streamline document management, improve compliance, and enhance operational efficiency with features like search, categorization, and cloud-based storage.',
    category: 'Web',
    image: '/images/Projects/appatete.jpg',
    link: 'https://home-ten-zeta.vercel.app/fr/about/',
    githubLink: 'https://github.com/cedric921',
    tags: ['React JS', 'Express JS', 'PostgreSQL', 'Sequelize']
  },
  {
    id: 6,
    title: 'Focus',
    description: 'Focus is a mobile application centered around inspirational quotes, providing users with a curated collection of motivational content to inspire daily productivity and positivity. It features a sleek interface, personalized recommendations, and cross-platform support for an uplifting user experience.',
    category: 'App',
    image: '/images/Projects/focus.png',
    link: 'https://focus-admin.vercel.app/',
    githubLink: 'https://github.com/cedric921/focus',
    tags: ['React Native', 'Next.js', 'Nest.js', 'PostgreSQL', 'TypeORM', 'Turbo']
  },
   {
    id: 7,
    title: 'Ever Teams Mobile',
    description: 'Ever Teams Mobile brings the full power of project management and team collaboration to mobile devices. Users can manage tasks, track time, collaborate in real-time, and access integrated tools on-the-go, ensuring productivity regardless of location.',
    category: 'App',
    image: '/images/Projects/project1.png',
    link: 'https://app.ever.team/',
    githubLink: 'https://github.com/ever-co/ever-teams',
    tags: ['React Native', 'Nest.js', 'PostgreSQL', 'TypeORM', 'Mobile']
  },
  {
    id: 8,
    title: 'KADEA - Renders (Goma branch)',
    description: 'KADEA Renders is a web platform for KADEA Academy students in the Goma branch to share and showcase their projects. It includes project galleries, collaboration features, and a responsive design to foster learning and networking among students and educators.',
    category: 'Web',
    image: '/images/Projects/gda-renders.png',
    link: 'https://cd-almuni.vercel.app/',
    githubLink: 'https://github.com/Bam92/student-projects-frontend',
    tags: ['Next.js', 'Nest.js', 'PostgreSQL', 'TypeORM', 'Mobile']
  },
  {
    id: 9,
    title: 'Cobiz',
    description: 'Cobiz is a desktop application for comprehensive business management, offering tools for inventory tracking, sales management, financial reporting, and more. Built with Flutter for cross-platform desktop compatibility, it provides a robust backend for efficient business operations.',
    category: 'App',
    image: '/images/Projects/cobiz.jpg',
    link: '#',
    githubLink: 'https://github.com/cedric921/',
    tags: ['Dart', 'Flutter', 'Adonis.js']
  },
  {
    id: 10,
    title: 'Zwa Platform',
    description: 'Zwa Platform is a web application for sharing and selling clothing items, providing users with an online marketplace to showcase and purchase fashion products.',
    category: 'Web',
    image: '/images/Projects/zwa.png',
    link: 'https://zwa-web.vercel.app/',
    githubLink: 'https://github.com/cedric921',
    tags: ['Next.js', 'React', 'Mobile Money']
  },
  {
    id: 11,
    title: 'Afia Platform for Hospital',
    description: 'Afia Platform for Hospital is a comprehensive web application designed for hospital management, including patient records, appointments, and administrative tasks to streamline healthcare operations.',
    category: 'Web',
    image: '/images/Projects/afia-hosp.png',
    link: 'https://afia-cd-hospital.vercel.app',
    githubLink: 'https://github.com/cedric921',
    tags: ['Next.js', 'React', 'React Native', 'Hospital']
  },
  {
    id: 12,
    title: 'Afia Platform',
    description: 'Afia Platform is an online medical record system that allows patients and healthcare providers to manage and access medical information securely and efficiently.',
    category: 'Web',
    image: '/images/Projects/afia-patient.png',
    link: 'https://afia-cd-hospital.vercel.app',
    githubLink: 'https://github.com/cedric921',
    tags: ['Next.js', 'React', 'React Native', 'Hospital', 'medical carnet']
  },
];

export const EXPERIENCES = [
  { id: 1, role: 'Frontend Web Developer', company: 'Buku My Class', period: 'Dec 2018 - Sep 2021', location: 'Remote', description: 'Worked as a Full Stack Developer (Frontend and Backend) and Frontend Developer (React.js) for Buku, an application enabling secondary school students to access class notes from anywhere.' },
  { id: 2, role: 'Frontend Developer', company: 'One Stop Center', period: 'Sep 2021 - Feb 2022', location: 'Remote', description: 'Worked as a Frontend Developer (Angular) on a web application that manages parcel-related information and shares it across multiple company agencies.' },
  { id: 3, role: 'Backend Developer', company: 'Attendacy GDA (KADEA)', period: 'Sept 2022 - Dec 2022', location: 'Remote', description: 'Worked as a Full-stack Developer (Express.js, React.js) for Attendacy GDA, an application to manage student attendance within a coding academy.' },
  { id: 4, role: 'Frontend Developer', company: 'CRES Startup', period: 'Dec 2022 - Jun 2023', location: 'Hybrid, Goma', description: 'Worked as a Full-stack Web Developer (Nest.js, Next.js) for a start-up and research center focused on creating web applications and artificial intelligence solutions for business management and data collection.' },
  { id: 5, role: 'Full Stack Engineer', company: 'AdminAtete', period: 'Feb 2023 - Jul 2023', location: 'Remote, Belgium', description: 'Developed as a Full-stack Developer (Express.js, Next.js) for AdminAtete, a tech startup offering digital solutions for business services, including a document archiving application.' },
  { id: 6, role: 'Full Stack Engineer', company: 'Ever Technologies', period: 'Nov 2023 - Present', location: 'Remote, Bulgaria, USA', description: 'Worked as a Full-stack Developer (Nest.js, Next.js, React Native) on Ever Teams (Open Work and Project Management Platform) and Ever Gauzy (Open Business Management Platform - ERP/CRM/HRM/ATS/PM). Also involved in various client projects.' },
];

export const SKILLS = [
  { name: 'React.js', level: 'Expert', category: 'Front End', logoUrl: 'https://cdn.simpleicons.org/react' },
  { name: 'Vue.js', level: 'Expert', category: 'Front End', logoUrl: 'https://cdn.simpleicons.org/vuedotjs' },
  { name: 'Angular', level: 'Expert', category: 'Front End', logoUrl: 'https://cdn.simpleicons.org/angular' },
  { name: 'TypeScript', level: 'Expert', category: 'Front End', logoUrl: 'https://cdn.simpleicons.org/typescript' },
  { name: 'JavaScript', level: 'Expert', category: 'Front End', logoUrl: 'https://cdn.simpleicons.org/javascript' },
  { name: 'HTML/CSS', level: 'Expert', category: 'Front End', logoUrl: 'https://cdn.simpleicons.org/html5' },
  { name: 'Tailwind CSS', level: 'Expert', category: 'Front End', logoUrl: 'https://cdn.simpleicons.org/tailwindcss' },
  { name: 'Framer Motion', level: 'Advanced', category: 'Front End', logoUrl: 'https://cdn.simpleicons.org/framer' },
  { name: 'GSAP', level: 'Advanced', category: 'Front End', logoUrl: 'https://cdn.simpleicons.org/greensock' },
  { name: 'Three.js', level: 'Intermediate', category: 'Front End', logoUrl: 'https://cdn.simpleicons.org/threedotjs' },
  { name: 'Node.js', level: 'Advanced', category: 'Back End', logoUrl: 'https://cdn.simpleicons.org/nodedotjs' },
  { name: 'Express.js', level: 'Advanced', category: 'Back End', logoUrl: 'https://cdn.simpleicons.org/express' },
  { name: 'MongoDB', level: 'Advanced', category: 'Back End', logoUrl: 'https://cdn.simpleicons.org/mongodb' },
  { name: 'NestJS', level: 'Expert', category: 'Back End', logoUrl: 'https://cdn.simpleicons.org/nestjs' },
  { name: 'PostgreSQL', level: 'Intermediate', category: 'Back End', logoUrl: 'https://cdn.simpleicons.org/postgresql' },
  { name: 'Docker', level: 'Intermediate', category: 'Back End', logoUrl: 'https://cdn.simpleicons.org/docker' },
  { name: 'AWS', level: 'Intermediate', category: 'Back End', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'Redis', level: 'Intermediate', category: 'Back End', logoUrl: 'https://cdn.simpleicons.org/redis' },
  { name: 'TensorFlow', level: 'Advanced', category: 'A.I', logoUrl: 'https://cdn.simpleicons.org/tensorflow' },
  { name: 'Machine Learning', level: 'Advanced', category: 'A.I', logoUrl: 'https://cdn.simpleicons.org/scikitlearn' },
  { name: 'Natural Language Processing', level: 'Intermediate', category: 'A.I', logoUrl: 'https://cdn.simpleicons.org/huggingface' },
  { name: 'Computer Vision', level: 'Intermediate', category: 'A.I', logoUrl: 'https://cdn.simpleicons.org/opencv' },
  { name: 'Deep Learning', level: 'Intermediate', category: 'A.I', logoUrl: 'https://cdn.simpleicons.org/keras' },
];
