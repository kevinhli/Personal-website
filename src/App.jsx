import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaAws, FaDatabase, FaRobot } from 'react-icons/fa6'
import { LuAppWindow, LuWorkflow } from 'react-icons/lu'
import {
  SiAnthropic,
  SiApachespark,
  SiFirebase,
  SiGit,
  SiGithub,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiReact,
} from 'react-icons/si'
import profilePhoto from './assets/kevin-profile.jpg'
import southCarolinaLogo from '../pictures/southcarolina.png'
import southernCaliforniaLogo from '../pictures/southerncalifornia.png'
import './App.css'

const MotionDiv = motion.div

const sections = [
  {
    id: 'intro',
    meter: 25,
    navLabel: 'Intro + About',
    title: 'Kevin Liu',
    subtitle: 'Senior Business Admin and Division Power BI Group Lead at NASA JPL.',
    copy: 'I build reporting systems, internal tools, and AI-assisted workflows that help teams turn operational complexity into clear decisions.',
  },
  {
    id: 'experience',
    meter: 50,
    navLabel: 'Experience',
    title: 'Experience',
    subtitle: null,
    copy: null,
    details: [
      {
        label: 'Current',
        value: 'JPL analytics lead',
        note: 'Power BI leadership, operational reporting, and AI-assisted process improvement inside a high-accountability environment.',
      },
      {
        label: 'Education',
        value: 'B.S. + M.S.',
        note: 'Operations, analytics, and applied data science training across South Carolina and USC.',
      },
      {
        label: 'Recognition',
        value: 'Awarded',
        note: 'Includes 3x NASA Team Award, Oracle Top Talent, and USC Academic Achievement Scholarship recognition.',
      },
    ],
  },
  {
    id: 'projects',
    meter: 75,
    navLabel: 'Projects',
    title: 'Projects',
    subtitle: null,
    copy: null,
    tracks: {
      work: {
        label: 'Work Projects',
        title: 'Work Projects',
        subtitle: null,
        copy: null,
        details: [],
      },
      school: {
        label: 'Personal & School',
        title: 'Personal & School',
        subtitle: null,
        copy: null,
        details: [],
      },
    },
  },
  {
    id: 'contact',
    meter: 100,
    navLabel: 'Contact',
    title: 'Contact',
    subtitle: 'For roles, collaborations, or conversations worth continuing.',
    copy: 'Use the form to send a note directly to Kevin.',
  },
]

const introSkills = [
  { label: 'Power BI', Icon: FaDatabase, tone: '#f2b73c' },
  { label: 'Power Automate', Icon: LuWorkflow, tone: '#3b82f6' },
  { label: 'Power Apps', Icon: LuAppWindow, tone: '#8b5cf6' },
  { label: 'MySQL', Icon: SiMysql, tone: '#0ea5e9' },
  { label: 'PostgreSQL', Icon: SiPostgresql, tone: '#1d4ed8' },
  { label: 'Python', Icon: SiPython, tone: '#3b82f6' },
  { label: 'Git', Icon: SiGit, tone: '#f97316' },
  { label: 'GitHub', Icon: SiGithub, tone: '#111827' },
  { label: 'AWS', Icon: FaAws, tone: '#f59e0b' },
  { label: 'Node.js', Icon: SiNodedotjs, tone: '#22c55e' },
  { label: 'Oracle Database', Icon: FaDatabase, tone: '#ef4444' },
  { label: 'Firebase', Icon: SiFirebase, tone: '#f59e0b' },
  { label: 'Spark', Icon: SiApachespark, tone: '#fb7185' },
  { label: 'MongoDB', Icon: SiMongodb, tone: '#22c55e' },
  { label: 'React', Icon: SiReact, tone: '#06b6d4' },
  { label: 'Codex', Icon: SiOpenai, tone: '#2563eb' },
  { label: 'Claude Code', Icon: SiAnthropic, tone: '#a855f7' },
  { label: 'Agent building', Icon: FaRobot, tone: '#0891b2' },
]

const introBio = [
  'I am a data and operations professional who genuinely loves figuring out how things work, how systems connect, and how better processes can create smarter outcomes. My background blends technical problem-solving with hands-on operational experience, and I am currently employed at the NASA Jet Propulsion Laboratory.',
  'That same mindset has shaped my life outside of work as well. Swimming has been a huge part of who I am. I was a varsity swimmer and qualified for Olympic Trials twice, and that discipline, energy, and drive for continuous improvement carry into how I approach my work and this portfolio.',
  'I earned my undergraduate degree from the University of South Carolina in Operations and Supply Chain Management with a concentration in Data Analytics, and I am finishing my master\'s degree at the University of Southern California in Computer Science with a focus in Applied Data Science. I also love integrating AI into my daily work to sharpen analysis and improve efficiency.',
]

const experienceTimeline = [
  {
    organization: 'NASA Jet Propulsion Laboratory',
    location: 'Pasadena, CA',
    roles: [
      {
        title: 'Senior Business Admin / Division Power BI Group Lead',
        dates: 'Oct 2022 - Present',
        bullets: [
          'Leads division-wide Power BI reporting used by 250+ stakeholders to monitor financial status, workforce planning, and operational performance across more than $200M in active projects.',
          'Develops and refines SQL queries plus Python workflows that unify financial, workforce, subcontract, and planning data into executive-ready reporting.',
          'Utilized prompt engineering and agent creation across GenAI tools including ChatGPT, Gemini, Codex, and Claude Code to create workflow automation that standardizes processes, reduces waste, and accelerates analysis work inside the group.',
          'Utilized Power Apps and Power Automate to create custom applications and workflow automations that improve process visibility, streamline approvals, and support day-to-day operational execution.',
          'Delivered technical briefings and dashboard reviews for executive and non-technical audiences during monthly and quarterly operating reviews.',
          'Documented metric lineage and data-model mappings from Oracle source systems through Power BI outputs to keep reporting traceable and consistent.',
          'Led weekly group meetings focused on Power BI standards, reporting process improvements, and division reporting priorities.',
        ],
      },
    ],
  },
  {
    organization: 'Oracle',
    location: 'San Antonio, TX',
    roles: [
      {
        title: 'Program Team Lead / Business Analyst III',
        dates: 'Mar 2022 - Oct 2022',
        bullets: [
          'Led the workflow of Oracle cloud deals across a team of 30, prioritizing incidents from sales, operations, and internal teams for the highest-impact response.',
          'Became a go-to resource for retrieving and working with data across Oracle databases using SQL.',
        ],
      },
      {
        title: 'Workflow Administrator',
        dates: 'Jun 2021 - Oct 2022',
        bullets: [
          'Helped found a workflow-focused operations team built to improve internal efficiency, KPI performance, and process quality across Oracle organizations and third-party teams.',
          'Created documentation, tested optimization methods, and implemented process improvements through Confluence and structured operational change.',
        ],
      },
      {
        title: 'Global Sales and Consulting Operations Analyst II',
        dates: 'Oct 2020 - Oct 2022',
        bullets: [
          'Acted as a knowledge expert on end-to-end Oracle systems and processes, troubleshooting complex ticket-based issues across CPQ, SPM, CLM, and related tools.',
          'Served as a liaison between sales and cross-functional teams, driving problem resolution and customer experience through direct coordination.',
        ],
      },
    ],
  },
  {
    organization: 'Sonoco Products',
    location: 'Hartsville, SC',
    roles: [
      {
        title: 'Consulting Intern - Data Analyst',
        dates: 'Jan 2020 - May 2020',
        bullets: [
          'Analyzed accessorial cost data and identified opportunities estimated to reduce roughly $3.2M in unnecessary annual spend.',
          'Built monitoring processes and visualization logic in Power BI, Excel, and Microsoft Access SQL to support sustainable cost control.',
        ],
      },
    ],
  },
  {
    organization: 'Covestro LLC',
    location: 'Pittsburgh, PA',
    roles: [
      {
        title: 'Supply Chain Center Order Management Intern',
        dates: 'May 2019 - Aug 2019',
        bullets: [
          'Managed customer orders in SAP from entry through invoicing on an exception basis while coordinating across internal and external stakeholders.',
        ],
      },
    ],
  },
]

const educationItems = [
  {
    school: 'University of Southern California',
    degree: 'Master of Science, Computer Science',
    focus: 'Applied Data Science',
    dates: 'Aug 2023 - May 2026',
    location: 'Los Angeles, CA',
  },
  {
    school: 'University of South Carolina',
    degree: 'Bachelor of Science, Operations and Supply Chain Management',
    focus: 'Data Analytics',
    dates: 'Aug 2016 - May 2020',
    location: 'Columbia, SC',
    note: 'Varsity swim team scholarship athlete and 2-time Olympic Trials qualifier.',
  },
]

const awardItems = [
  '5x NASA Team Award',
  'Oracle Top Talent (Top 8% in work contribution)',
  'USC Academic Achievement Scholarship',
  'President\'s List recipient',
  'SEC Conference Honor Roll',
  'Athletic Director\'s Honor Roll',
]

const workProjectCards = [
  {
    organization: 'JPL',
    stack: 'Power BI - SQL',
    title: 'Financial Dashboard',
    tag: 'Internal',
    description:
      'Tracks division funding status and financial performance with live operational reporting. The dashboard is backed by custom SQL retrieval logic and built to support high-visibility planning conversations.',
  },
  {
    organization: 'JPL',
    stack: 'Power BI - SQL - Workday data',
    title: 'Personnel Reference Tool',
    tag: 'Internal',
    description:
      'Brings together Workday reporting, personnel records, compensation information, and organization-level summaries into one reference experience for managers and operations teams.',
  },
  {
    organization: 'JPL',
    stack: 'Python - CSS/JS - Postgres',
    title: 'Onboarding / Offboarding Tool',
    tag: 'Internal',
    description:
      'Internal web application that shows where employees are in the onboarding or offboarding approval process, what actions remain open, and what can be completed directly in the workflow.',
  },
  {
    organization: 'JPL',
    stack: 'Power BI - SQL',
    title: 'Badge-In / Badge-Out Status',
    tag: 'Internal',
    description:
      'Monitors whether employees meet onsite badge criteria and surfaces status in a simple operational reporting view powered by custom SQL queries.',
  },
  {
    organization: 'Oracle',
    stack: 'Oracle Analytics Cloud',
    title: 'Service-Level Agreement Dashboard',
    tag: 'Internal',
    description:
      'Tracks resolution status for incident and workflow tickets, monitors SLA performance, and surfaces support metrics that help teams prioritize backlogs and response quality.',
  },
  {
    organization: 'Sonoco',
    stack: 'Power BI',
    title: 'Cost Reduction Dashboard',
    tag: 'Internal',
    description:
      'Highlighted waste categories and spending patterns that were estimated to reduce roughly $3M per year across targeted cost areas.',
  },
]

const schoolProjectGroups = ['Personal', 'School']

const bubbleSeeds = [
  { x: 10, size: 0.48, delay: 0.3, duration: 10.4 },
  { x: 21, size: 0.62, delay: 1.1, duration: 12.3 },
  { x: 34, size: 0.56, delay: 1.9, duration: 11.1 },
  { x: 48, size: 0.74, delay: 0.9, duration: 13.8 },
  { x: 61, size: 0.58, delay: 1.5, duration: 12.1 },
  { x: 76, size: 0.82, delay: 2.3, duration: 14.2 },
  { x: 89, size: 0.54, delay: 1.2, duration: 11.6 },
]

const checkpointPosition = (meter) => 18 + ((meter - 25) / 75) * 74
const startAnchor = 6.2
const navLineStart = checkpointPosition(25)
const navLineEnd = checkpointPosition(100)

function PoolSwimmer({ direction, meter, duration, moving }) {
  return (
    <MotionDiv
      className="water-swimmer-shell"
      initial={false}
      animate={{ left: `${checkpointPosition(meter)}%` }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <div
        className={`pool-swimmer-frame ${moving ? 'is-moving' : ''}`}
        style={{ transform: `scaleX(${direction < 0 ? -1 : 1})` }}
      >
        <svg className={`pool-swimmer ${moving ? 'is-moving' : ''}`} viewBox="0 0 300 150">
          <ellipse className="swimmer-shadow" cx="152" cy="91" rx="70" ry="11" />
          <path className="swimmer-wake" d="M56 81 C80 71 105 71 130 80 C148 86 166 89 186 85" />
          <path
            className="swimmer-wake swimmer-wake-secondary"
            d="M62 94 C85 87 107 89 128 98 C143 102 158 104 175 100"
          />

          <path
            className="swimmer-body"
            d="M182 73 C177 64 167 58 153 56 C135 54 118 57 105 64 C94 70 88 80 91 89 C95 100 111 107 133 107 C157 107 176 101 188 91 C194 86 194 79 188 74 Z"
          />
          <path
            className="swimmer-legs"
            d="M108 76 C92 74 79 78 67 86 C73 90 81 92 87 97 C96 104 105 109 118 109 C122 103 119 94 114 87 C112 83 110 80 108 76 Z"
          />
          <circle className="swimmer-head" cx="197" cy="82" r="10" />

          <g className="swimmer-arm-group swimmer-arm-front">
            <path className="swimmer-arm" d="M177 69 C191 60 208 58 227 61" />
          </g>
          <g className="swimmer-arm-group swimmer-arm-back">
            <path className="swimmer-arm" d="M167 87 C152 101 134 110 112 112" />
          </g>
        </svg>
      </div>
    </MotionDiv>
  )
}

function StarterStand() {
  return (
    <div className="starter-stand-shell" aria-hidden="true">
      <span className="starter-label starter-label-stand">Kevin</span>
      <svg className="starter-stand" viewBox="0 0 160 160">
        <circle cx="80" cy="24" r="12" fill="#051929" />
        <path
          d="M69 41 C61 56 59 74 63 92 C67 111 74 126 84 138 C94 126 101 110 104 92 C107 74 103 56 94 41 C87 35 76 35 69 41 Z"
          fill="#051929"
        />
        <path d="M69 57 C60 63 53 72 48 84" fill="none" stroke="#051929" strokeWidth="10" strokeLinecap="round" />
        <path d="M91 57 C100 63 107 72 112 84" fill="none" stroke="#051929" strokeWidth="10" strokeLinecap="round" />
        <path d="M77 103 C71 116 67 128 66 140" fill="none" stroke="#051929" strokeWidth="10" strokeLinecap="round" />
        <path d="M89 103 C95 116 99 128 100 140" fill="none" stroke="#051929" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function StarterDiver({ interfaceOpen }) {
  return (
    <MotionDiv
      className="starter-diver-shell"
      initial={{
        left: `${startAnchor}%`,
        top: '44.3%',
      }}
      animate={{
        left: `${checkpointPosition(25)}%`,
        top: interfaceOpen ? '44.4%' : '46.8%',
      }}
      transition={{ duration: 1.25, ease: [0.18, 0.92, 0.24, 1] }}
      aria-hidden="true"
    >
      <span className="starter-label starter-label-flight">Kevin</span>
      <MotionDiv
        className="starter-diver-body"
        initial={{ rotate: 0, scale: 1 }}
        animate={{ rotate: 78, scale: 0.88 }}
        transition={{ duration: 1.25, ease: [0.18, 0.92, 0.24, 1] }}
      >
        <svg className="starter-diver" viewBox="0 0 160 160">
          <circle cx="82" cy="26" r="11" fill="#051929" />
          <path
            d="M70 43 C62 57 60 73 63 91 C66 107 73 122 84 134 C95 123 103 108 105 92 C107 76 103 60 95 47 C89 40 79 38 70 43 Z"
            fill="#051929"
          />
          <path d="M73 54 C64 61 57 69 52 80" fill="none" stroke="#051929" strokeWidth="10" strokeLinecap="round" />
          <path d="M93 54 C102 60 109 68 115 79" fill="none" stroke="#051929" strokeWidth="10" strokeLinecap="round" />
          <path d="M79 101 C72 113 68 124 67 137" fill="none" stroke="#051929" strokeWidth="10" strokeLinecap="round" />
          <path d="M89 101 C95 113 99 124 101 137" fill="none" stroke="#051929" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </MotionDiv>
    </MotionDiv>
  )
}

function SkillsSection() {
  return (
    <section className="skills-section" aria-labelledby="skills-heading">
      <h2 id="skills-heading">Skills</h2>
      <div className="skills-grid" aria-label="Skills">
        {introSkills.map((skill) => (
          <span key={skill.label} className="skill-chip">
            <i className="skill-chip-icon" style={{ '--skill-tone': skill.tone }}>
              <skill.Icon />
            </i>
            <span className="skill-chip-label">
              {skill.label.split(' ').map((part) => (
                <span key={`${skill.label}-${part}`}>{part}</span>
              ))}
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}

function AlmaMaterMarks() {
  return (
    <div className="alma-mater-stack" aria-label="Academic background">
      <MotionDiv
        className="alma-mater-card alma-mater-card-sc"
        initial={{ opacity: 0, x: 24, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.78, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={southCarolinaLogo}
          alt="University of South Carolina logo"
          className="alma-mater-logo alma-mater-logo-sc"
        />
      </MotionDiv>

      <MotionDiv
        className="alma-mater-card alma-mater-card-usc"
        initial={{ opacity: 0, x: 24, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.78, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={southernCaliforniaLogo}
          alt="University of Southern California logo"
          className="alma-mater-logo alma-mater-logo-usc"
        />
      </MotionDiv>
    </div>
  )
}

function HeroAside() {
  return (
    <div className="hero-aside">
      <MotionDiv
        className="portrait-figure"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={profilePhoto} alt="Portrait of Kevin Liu" />
      </MotionDiv>
      <AlmaMaterMarks />
    </div>
  )
}

function IntroAbout({ onNavigateContact }) {
  return (
    <section className="about-block" aria-labelledby="about-heading">
      <h2 id="about-heading">About Me</h2>
      <div className="about-copy">
        {introBio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="about-cta">
          Interested in working together?{' '}
          <button type="button" className="about-cta-link" onClick={onNavigateContact}>
            Reach out through the contact page.
          </button>
        </p>
      </div>
    </section>
  )
}

function ProjectCard({ card, showOrganization = true }) {
  return (
    <article className="project-card">
      {card.tag ? <span className="project-card-tag">{card.tag}</span> : null}
      <div className={`project-card-meta ${showOrganization ? '' : 'is-compact'}`.trim()}>
        {showOrganization ? <span>{card.organization}</span> : null}
        <strong>{card.stack}</strong>
      </div>
      <h3>{card.title}</h3>
      <p>{card.description}</p>
    </article>
  )
}

function ExperienceMain() {
  return (
    <section className="experience-sheet" aria-label="Experience timeline">
      <div className="timeline-stack">
        {experienceTimeline.map((entry) => (
          <article key={entry.organization} className="timeline-group">
            <div className="timeline-role-list">
              {entry.roles.map((role, roleIndex) => (
                <section key={`${entry.organization}-${role.title}`} className="timeline-role">
                  {roleIndex === 0 ? (
                    <div className="timeline-role-context">
                      <span>{entry.organization}</span>
                      <span>{entry.location}</span>
                    </div>
                  ) : null}
                  <div className="timeline-role-head">
                    <h4>{role.title}</h4>
                    <span>{role.dates}</span>
                  </div>
                  <ul>
                    {role.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ExperienceAside() {
  return (
    <div className="experience-aside-stack">
      <section className="detail-panel detail-panel-education">
        <h3>Education</h3>
        <div className="education-list">
          {educationItems.map((item) => (
            <article key={item.school} className="education-item">
              <h4>{item.school}</h4>
              <p>
                {item.degree} - {item.focus}
              </p>
              <span>
                {item.location} - {item.dates}
              </span>
              {item.note ? <small>{item.note}</small> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="detail-panel detail-panel-plain">
        <h3>Awards</h3>
        <ul className="simple-list">
          {awardItems.map((award) => (
            <li key={award}>{award}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function ProjectCards({ cards }) {
  return (
    <div className="project-card-grid">
      {cards.map((card) => (
        <ProjectCard key={`${card.organization}-${card.title}`} card={card} />
      ))}
    </div>
  )
}

function WorkProjectGroups({ cards }) {
  const groupedCards = cards.reduce((groups, card) => {
    const group = groups.get(card.organization) ?? []
    group.push(card)
    groups.set(card.organization, group)
    return groups
  }, new Map())

  return (
    <div className="project-groups">
      {[...groupedCards.entries()].map(([organization, organizationCards]) => (
        <section key={organization} className="project-group">
          <header className="project-group-header">
            <div className="project-group-title-block">
              <h3>{organization}</h3>
            </div>
            <span className="project-group-count">{organizationCards.length} projects</span>
          </header>
          <div className="project-card-grid project-card-grid-grouped">
            {organizationCards.map((card) => (
              <ProjectCard key={`${card.organization}-${card.title}`} card={card} showOrganization={false} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function EmptyProjectGroups({ groups }) {
  return (
    <div className="project-groups">
      {groups.map((group) => (
        <section key={group} className="project-group project-group-empty">
          <header className="project-group-header">
            <div className="project-group-title-block">
              <h3>{group}</h3>
            </div>
          </header>
        </section>
      ))}
    </div>
  )
}

function ProjectTabs({ mode, onChange, tracks }) {
  return (
    <div className="project-tabs" role="tablist" aria-label="Project tracks">
      {Object.entries(tracks).map(([key, track]) => (
        <button
          key={key}
          type="button"
          className={`project-tab ${mode === key ? 'is-active' : ''}`}
          onClick={() => onChange(key)}
          role="tab"
          aria-selected={mode === key}
        >
          {track.label}
        </button>
      ))}
    </div>
  )
}

function ContactAside({ contactState, contactStatus, contactError, onChange, onSubmit }) {
  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <label>
        <span>Your Name</span>
        <input
          type="text"
          name="name"
          value={contactState.name}
          onChange={onChange}
          placeholder="Who is reaching out?"
          required
        />
      </label>

      <label>
        <span>Company</span>
        <input
          type="text"
          name="company"
          value={contactState.company}
          onChange={onChange}
          placeholder="Where are you reaching out from?"
        />
      </label>

      <label>
        <span>Subject</span>
        <input
          type="text"
          name="optional"
          value={contactState.optional}
          onChange={onChange}
          placeholder="Anything extra to add"
        />
      </label>

      <label className="contact-message">
        <span>Message</span>
        <textarea
          name="message"
          rows="5"
          value={contactState.message}
          onChange={onChange}
          placeholder="Describe the role, project, or idea."
          required
        />
      </label>

      <div className="contact-actions">
        <button type="submit" className="submit-button" disabled={contactStatus === 'sending'}>
          {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
      </div>

      {contactStatus === 'sent' ? <p className="submitted-note">Message sent to Kevin successfully.</p> : null}
      {contactStatus === 'error' ? <p className="submitted-note submitted-note-error">{contactError}</p> : null}
    </form>
  )
}

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [isDiving, setIsDiving] = useState(false)
  const [isInterfaceOpen, setIsInterfaceOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('intro')
  const [pendingSection, setPendingSection] = useState(null)
  const [swimmerMeter, setSwimmerMeter] = useState(25)
  const [swimmerDuration, setSwimmerDuration] = useState(0.68)
  const [travelDirection, setTravelDirection] = useState(1)
  const [projectMode, setProjectMode] = useState('work')
  const [contactStatus, setContactStatus] = useState('idle')
  const [contactError, setContactError] = useState('')
  const [contactState, setContactState] = useState({
    name: '',
    company: '',
    optional: '',
    message: '',
  })

  const timeoutIdsRef = useRef([])
  const lastStepAtRef = useRef(0)

  const sectionMap = useMemo(
    () => Object.fromEntries(sections.map((section) => [section.id, section])),
    [],
  )

  const activeIndex = sections.findIndex((section) => section.id === activeSection)
  const destinationId = hasStarted ? pendingSection ?? activeSection : 'intro'
  const destinationMeter = sectionMap[destinationId]?.meter ?? 25
  const lineProgress = ((destinationMeter - 25) / 75) * 100
  const displayedSection = sectionMap[activeSection]
  const contentKey = displayedSection.id
  const projectCards = projectMode === 'work' ? workProjectCards : []

  const mainTitle = displayedSection.title
  const mainSubtitle = displayedSection.subtitle
  const mainCopy = displayedSection.copy
  const headingClassName =
    displayedSection.id === 'projects'
      ? 'info-heading info-heading-experience'
      : `info-heading info-heading-${displayedSection.id}`
  const clearScheduled = useCallback(() => {
    timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutIdsRef.current = []
  }, [])

  const schedule = useCallback((callback, delay) => {
    const timeoutId = window.setTimeout(callback, delay)
    timeoutIdsRef.current.push(timeoutId)
  }, [])

  useEffect(() => clearScheduled, [clearScheduled])

  const handleStart = useCallback(() => {
    if (hasStarted || isDiving) {
      return
    }

    clearScheduled()
    setIsDiving(true)
    setPendingSection('intro')
    setTravelDirection(1)
    setSwimmerDuration(0.68)

    schedule(() => {
      setIsInterfaceOpen(true)
    }, 90)

    schedule(() => {
      setHasStarted(true)
      setActiveSection('intro')
      setSwimmerMeter(25)
    }, 980)

    schedule(() => {
      setPendingSection(null)
      setIsDiving(false)
    }, 1860)
  }, [clearScheduled, hasStarted, isDiving, schedule])

  const navigateTo = useCallback(
    (targetId) => {
      if (!hasStarted || pendingSection || targetId === activeSection) {
        return
      }

      const target = sectionMap[targetId]
      if (!target) {
        return
      }

      clearScheduled()

      const currentMeter = sectionMap[activeSection].meter
      const distance = Math.abs(target.meter - currentMeter)
      const duration = Math.max(0.42, Math.min(0.68, distance / 140 + 0.28))

      setPendingSection(targetId)
      setTravelDirection(target.meter >= currentMeter ? 1 : -1)
      setSwimmerDuration(duration)
      setSwimmerMeter(target.meter)

      schedule(() => {
        setActiveSection(targetId)
      }, duration * 1000 * 0.24)

      schedule(() => {
        setPendingSection(null)
      }, duration * 1000 + 18)
    },
    [activeSection, clearScheduled, hasStarted, pendingSection, schedule, sectionMap],
  )

  useEffect(() => {
    const onWheel = (event) => {
      if (!hasStarted || pendingSection || event.ctrlKey || event.metaKey) {
        return
      }

      if (!(event.target instanceof HTMLElement)) {
        return
      }

      if (!event.target.closest('.pool-stage')) {
        return
      }

      const interactive = event.target.closest('textarea, input, button, a')
      if (interactive) {
        return
      }

      const primaryDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY

      if (Math.abs(primaryDelta) < 24) {
        return
      }

      const now = Date.now()
      if (now - lastStepAtRef.current < 640) {
        event.preventDefault()
        return
      }

      const direction = primaryDelta > 0 ? 1 : -1
      const nextIndex = Math.max(0, Math.min(sections.length - 1, activeIndex + direction))
      if (nextIndex === activeIndex) {
        return
      }

      event.preventDefault()
      lastStepAtRef.current = now
      navigateTo(sections[nextIndex].id)
    }

    const onKeyDown = (event) => {
      if (!hasStarted || pendingSection) {
        return
      }

      if (event.target instanceof HTMLElement) {
        const interactive = event.target.closest('textarea, input')
        if (interactive) {
          return
        }
      }

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault()
        navigateTo(sections[Math.min(sections.length - 1, activeIndex + 1)].id)
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        navigateTo(sections[Math.max(0, activeIndex - 1)].id)
      }

      if (event.key === 'Home') {
        event.preventDefault()
        navigateTo('intro')
      }

      if (event.key === 'End') {
        event.preventDefault()
        navigateTo('contact')
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeIndex, hasStarted, navigateTo, pendingSection])

  const handleContactChange = (event) => {
    const { name, value } = event.target
    if (contactStatus !== 'idle') {
      setContactStatus('idle')
      setContactError('')
    }
    setContactState((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    setContactStatus('sending')
    setContactError('')

    try {
      const formData = new FormData()
      formData.append('name', contactState.name)
      formData.append('company', contactState.company)
      formData.append('optional', contactState.optional)
      formData.append('message', contactState.message)
      formData.append('_subject', `Portfolio inquiry from ${contactState.name || 'website visitor'}`)
      formData.append('_captcha', 'false')
      formData.append('_template', 'table')

      const response = await fetch('https://formsubmit.co/ajax/kevinhumingliu@gmail.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Unable to send the message right now.')
      }

      setContactStatus('sent')
      setContactState({
        name: '',
        company: '',
        optional: '',
        message: '',
      })
    } catch (error) {
      setContactStatus('error')
      setContactError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while trying to send your message.',
      )
    }
  }

  return (
    <div className="app-shell">
      <main
        className={`swim-world ${isInterfaceOpen ? 'is-interface-open' : 'is-prelaunch'} ${hasStarted ? 'has-started' : ''} ${isDiving ? 'is-diving' : ''}`}
      >
        <section className="pool-stage" aria-label="Interactive pool navigation">
          <div className="pool-frame" aria-hidden="true" />
          <div className="pool-sheen" aria-hidden="true" />

          <AnimatePresence>
            {hasStarted ? (
              <MotionDiv
                className="checkpoint-track"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                aria-label="Pool checkpoints"
              >
                <div className="checkpoint-track-shell">
                  <div
                    className="checkpoint-track-line"
                    style={{
                      left: `${navLineStart}%`,
                      width: `${navLineEnd - navLineStart}%`,
                    }}
                    aria-hidden="true"
                  >
                    <MotionDiv
                      className="checkpoint-track-fill"
                      initial={false}
                      animate={{ width: `${lineProgress}%` }}
                      transition={{ duration: swimmerDuration, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  {sections.map((section) => {
                    const isActive = destinationId === section.id

                    return (
                      <button
                        key={section.id}
                        type="button"
                        className={`checkpoint-button ${isActive ? 'is-active' : ''}`}
                        style={{ left: `${checkpointPosition(section.meter)}%` }}
                        onClick={() => navigateTo(section.id)}
                        aria-current={isActive ? 'true' : undefined}
                        disabled={!hasStarted}
                      >
                        <span>{section.navLabel}</span>
                        <i className="checkpoint-dot" aria-hidden="true" />
                      </button>
                    )
                  })}
                </div>
              </MotionDiv>
            ) : null}
          </AnimatePresence>

          {isInterfaceOpen ? (
            <>
              <div className="finish-wall-zone" style={{ left: `${checkpointPosition(100)}%` }} aria-hidden="true">
                <span className="finish-wall-face" />
              </div>

              <div className="checkpoint-guides" aria-hidden="true">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="checkpoint-guide"
                    style={{ left: `${checkpointPosition(section.meter)}%` }}
                  />
                ))}
              </div>

              {hasStarted ? (
                <MotionDiv
                  className="checkpoint-guide-active"
                  aria-hidden="true"
                  initial={false}
                  animate={{ left: `${checkpointPosition(swimmerMeter)}%` }}
                  transition={{ duration: swimmerDuration, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
            </>
          ) : null}

          <div className="bubble-field" aria-hidden="true">
            {bubbleSeeds.map((bubble, index) => (
              <span
                key={index}
                className="bubble"
                style={{
                  '--x': bubble.x,
                  '--size': bubble.size,
                  '--delay': bubble.delay,
                  '--duration': bubble.duration,
                }}
              />
            ))}
          </div>

          <div className="lane-rope lane-rope-upper" />
          <div className="lane-rope lane-rope-lower" />
          <div className="lane-band lane-band-main" />

          {!hasStarted ? (
            <div className="starting-block-lane" style={{ left: `${startAnchor}%` }} aria-hidden="true">
              <span className="starting-block-platform" />
              <span className="starting-block-base" />
            </div>
          ) : null}

          {!hasStarted && !isDiving ? (
            <div className="starter-stand-anchor" style={{ left: `${startAnchor}%` }}>
              <StarterStand />
            </div>
          ) : null}

          {isDiving ? <StarterDiver interfaceOpen={isInterfaceOpen} /> : null}

          {hasStarted && !isDiving ? (
            <PoolSwimmer
              direction={travelDirection}
              meter={swimmerMeter}
              duration={swimmerDuration}
              moving={hasStarted}
            />
          ) : null}

          {!hasStarted && !isDiving ? (
            <div className="start-overlay">
              <button type="button" className="dive-button" onClick={handleStart} disabled={isDiving}>
                Dive In
              </button>
            </div>
          ) : null}
        </section>

        <section className={`info-stage ${isInterfaceOpen ? 'is-live' : 'is-hidden'}`}>
          <AnimatePresence mode="wait" initial={false}>
            <MotionDiv
              key={contentKey}
              className={`info-layout info-layout-${displayedSection.id}`}
              initial={{ opacity: 0.01, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0.01, x: -22 }}
              transition={{ duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
            >
              <MotionDiv
                className="info-main"
                initial={{ opacity: 0, x: -26 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.76, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className={headingClassName}>{mainTitle}</h1>
                {mainSubtitle ? <p className="info-subtitle">{mainSubtitle}</p> : null}
                {mainCopy ? <p className="info-copy">{mainCopy}</p> : null}

                {displayedSection.id === 'intro' ? (
                  <div className="intro-actions">
                    <a
                      className="intro-link-button"
                      href="https://www.linkedin.com/in/kevinhumingliu/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                    <a
                      className="intro-link-button intro-link-button-github"
                      href="https://github.com/kevinhli"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                    <SkillsSection />
                  </div>
                ) : displayedSection.id === 'experience' ? (
                  <ExperienceMain />
                ) : displayedSection.id === 'projects' ? (
                  <>
                    <ProjectTabs mode={projectMode} onChange={setProjectMode} tracks={displayedSection.tracks} />
                    <AnimatePresence mode="wait" initial={false}>
                      <MotionDiv
                        key={projectMode}
                        className="project-mode-panel"
                        initial={{ opacity: 0.01, x: 28 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0.01, x: -22 }}
                        transition={{ duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {projectMode === 'work' ? (
                          <WorkProjectGroups cards={projectCards} />
                        ) : (
                          <EmptyProjectGroups groups={schoolProjectGroups} />
                        )}
                      </MotionDiv>
                    </AnimatePresence>
                  </>
                ) : null}
              </MotionDiv>

              {displayedSection.id === 'intro' ? (
                <MotionDiv
                  className="intro-about-column"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.76, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <IntroAbout onNavigateContact={() => navigateTo('contact')} />
                </MotionDiv>
              ) : null}

              {displayedSection.id !== 'projects' ? (
                <MotionDiv
                  className={`info-side ${displayedSection.id === 'intro' ? 'info-side-intro' : ''}`}
                  initial={{ opacity: 0, x: 34 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.82, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {displayedSection.id === 'intro' ? (
                    <HeroAside />
                  ) : displayedSection.id === 'experience' ? (
                    <ExperienceAside />
                  ) : displayedSection.id === 'contact' ? (
                    <ContactAside
                      contactState={contactState}
                      contactStatus={contactStatus}
                      contactError={contactError}
                      onChange={handleContactChange}
                      onSubmit={handleContactSubmit}
                    />
                  ) : null}
                </MotionDiv>
              ) : null}
            </MotionDiv>
          </AnimatePresence>
        </section>
      </main>
    </div>
  )
}

export default App
