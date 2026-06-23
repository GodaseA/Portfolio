import React, { useState } from 'react';
import { FiBriefcase, FiExternalLink } from 'react-icons/fi';
import './ExperienceSection.css';

/* ─── Data ───────────────────────────────────────────────── */
const EXPERIENCES = [
  {
    id: 1,
    company: 'TechVault Solutions',
    date: 'Jan 2022 – Present',
    title: 'Senior Full-Stack Engineer',
    description:
      'Led a team of 12 engineers building a cloud-native document management system. Architected microservices with Node.js and React, reducing latency by 40%.',
    achievements: [
      'Migrated legacy monolith to Kubernetes-based microservices.',
      'Implemented real-time collaboration features using WebSockets.',
      'Mentored 5 junior developers through code reviews and pair programming.',
    ],
    tech: ['React', 'Node.js', 'TypeScript', 'Kubernetes', 'MongoDB'],
  },
  {
    id: 2,
    company: 'Apex Fintech Inc.',
    date: 'Jun 2019 – Dec 2021',
    title: 'Frontend Developer',
    description:
      'Built and maintained the consumer-facing dashboard for a high-growth trading platform. Focused on performance, accessibility, and pixel-perfect UI.',
    achievements: [
      'Redesigned the portfolio tracker, increasing user engagement by 25%.',
      'Introduced Jest and Cypress testing, raising coverage from 40% to 85%.',
      'Collaborated with UX designers to implement a responsive design system.',
    ],
    tech: ['React', 'Redux', 'Tailwind CSS', 'Jest', 'Webpack'],
  },
  {
    id: 3,
    company: 'CloudSphere AI',
    date: 'Aug 2017 – May 2019',
    title: 'Junior Software Engineer',
    description:
      'Developed features for an AI-driven analytics platform. Worked on both frontend and backend, with a focus on data visualization and REST APIs.',
    achievements: [
      'Built interactive charts and dashboards using D3.js and Recharts.',
      'Optimized API response times by 30% with caching and indexing.',
      'Maintained CI/CD pipelines using GitHub Actions and Docker.',
    ],
    tech: ['React', 'Python', 'Flask', 'D3.js', 'PostgreSQL'],
  },
  {
    id: 4,
    company: 'EdgeWare Systems',
    date: 'Jan 2016 – Jul 2017',
    title: 'Software Engineer Intern',
    description:
      'Worked on the backend team building RESTful APIs for an enterprise resource planning system. Gained hands-on experience with database design and testing.',
    achievements: [
      'Developed 15+ REST endpoints for inventory management.',
      'Wrote unit and integration tests using Jest and Supertest.',
      'Assisted in migrating from MySQL to PostgreSQL.',
    ],
    tech: ['Node.js', 'Express', 'PostgreSQL', 'Jest', 'Docker'],
  },
  {
    id: 5,
    company: 'NovaTech Labs',
    date: 'Sep 2015 – Dec 2015',
    title: 'Frontend Intern',
    description:
      'Assisted in building a design system and component library for a healthcare startup. Focused on accessibility and cross-browser compatibility.',
    achievements: [
      'Built 12 reusable React components with Storybook.',
      'Implemented dark mode support using CSS variables.',
      'Optimized bundle size by 30% with code splitting.',
    ],
    tech: ['React', 'Storybook', 'CSS Modules', 'Webpack'],
  },
  {
    id: 6,
    company: 'CodeMentor Hub',
    date: 'Jan 2015 – Aug 2015',
    title: 'Teaching Assistant',
    description:
      'Supported 50+ students in an intensive web development bootcamp. Led code reviews, held office hours, and created supplementary learning materials.',
    achievements: [
      'Assisted students with JavaScript, React, and Node.js coursework.',
      'Conducted weekly code review sessions for 20 project teams.',
      'Created a 20-page guide on best practices for React hooks.',
    ],
    tech: ['JavaScript', 'React', 'Node.js', 'Git'],
  },
];

/* ─── Component ──────────────────────────────────────────── */
export default function ExperienceSection() {
  const [active, setActive] = useState(EXPERIENCES[0]);

  return (
    <section id="experience" className="ex-root">
      {/* Header */}
      <div className="ex-header">
        <p className="ex-eyebrow">Career Timeline</p>
        <div className="ex-header-row">
          <h2 className="ex-headline">
            Professional <span>Experience.</span>
          </h2>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="ex-view-all"
          >
            <FiExternalLink size={16} />
            View Full Resume
            <svg className="ex-view-all-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Two-column body */}
      <div className="ex-body">
        {/* Left: experience list */}
        <ul className="ex-list" role="list">
          {EXPERIENCES.map((exp, i) => (
            <li key={exp.id}>
              <button
                className={`ex-row ${active.id === exp.id ? 'ex-row--active' : ''}`}
                onMouseEnter={() => setActive(exp)}
                onClick={() => setActive(exp)}
                aria-pressed={active.id === exp.id}
              >
                <span className="ex-index">0{i + 1}</span>

                {/* Timeline marker */}
                <div className="ex-marker">
                  <div className="ex-dot" />
                  {i < EXPERIENCES.length - 1 && <div className="ex-line" />}
                </div>

                <span className="ex-company">{exp.company}</span>

                <span className="ex-date">{exp.date}</span>

                <svg className="ex-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {/* Right: sticky detail panel */}
        <div className="ex-panel" aria-live="polite" aria-atomic="true">
          <div className="ex-panel-body">
            <h3 className="ex-panel-title">{active.title}</h3>
            <p className="ex-panel-company">{active.company}</p>
            <p className="ex-panel-date">{active.date}</p>
            <div className="ex-panel-divider" />
            <p className="ex-panel-desc">{active.description}</p>
            <ul className="ex-panel-achievements">
              {active.achievements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="ex-panel-tech">
              {active.tech.map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}