import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import useMotionPreference from './useMotionPreference'
import useContentTransition from './useContentTransition'
import PoolScene from './PoolScene'
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
    subtitle: 'Financial Data Scientist at NASA Jet Propulsion Laboratory',
    copy: 'My background spans data analytics, SQL and Python programming, operational reporting, and data visualization. I build reporting systems, internal tools, and AI-assisted workflows that help teams turn complex data into clear decisions.',
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
        value: 'Data Scientist - Financial Strategy Planning and Analysis',
        note: 'NASA Jet Propulsion Laboratory, September 2026–Present.',
      },
      {
        label: 'Education',
        value: 'B.S. + M.S.',
        note: 'Operations, analytics, and applied data science training across South Carolina and USC.',
      },
      {
        label: 'Recognition',
        value: 'Awarded',
        note: 'Includes 5x NASA Team Award, Oracle Top Talent, and USC Academic Achievement Scholarship recognition.',
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
  },
  {
    id: 'contact',
    meter: 100,
    navLabel: 'Contact',
    title: 'Contact',
    subtitle: null,
    copy: null,
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
  'I work at NASA Jet Propulsion Laboratory. My background combines data analytics and programming with hands-on operational experience. I enjoy developing tools and workflows, reporting systems, and Power BI visualizations that help teams understand their data and make informed decisions.',
  'That same mindset has shaped my life outside of work as well. Swimming has been a huge part of who I am. I was a varsity swimmer and qualified for Olympic Trials twice, and that discipline, energy, and drive for continuous improvement carry into how I approach my work and this portfolio.',
  'I earned my undergraduate degree from the University of South Carolina in Operations and Supply Chain Management with a concentration in Data Analytics. I graduated from the University of Southern California in June 2026 with a master\'s degree in Computer Science with a focus in Applied Data Science. I also enjoy integrating AI into my work to sharpen analysis and improve efficiency.',
]

const experienceTimeline = [
  {
    organization: 'NASA Jet Propulsion Laboratory',
    location: 'Pasadena, CA',
    roles: [
      {
        title: 'Data Scientist - Financial Strategy Planning and Analysis',
        dates: 'September 2026–Present',
        bullets: [],
      },
      {
        title: 'Earth Science Business Administrator',
        dates: 'Oct 2022 - Sep 2026',
        bullets: [
          'Led division-wide Power BI reporting used by 250+ stakeholders to monitor financial status, workforce planning, and operational performance across more than $200M in active projects.',
          'Developed and refined SQL queries plus Python workflows that unified financial, workforce, subcontract, and planning data into executive-ready reporting.',
          'Utilized prompt engineering and agent creation across GenAI tools including ChatGPT, Gemini, Codex, and Claude Code to create workflow automation that standardizes processes, reduces waste, and accelerates analysis work inside the group.',
          'Utilized Power Apps and Power Automate to create custom applications and workflow automations that improve process visibility, streamline approvals, and support day-to-day operational execution.',
          'Delivered technical briefings and dashboard reviews for executive and non-technical audiences during monthly and quarterly operating reviews.',
          'Documented metric lineage and data-model mappings from Oracle source systems through Power BI outputs to keep reporting traceable and consistent.',
          'As Division Power BI Group Lead, led weekly group meetings focused on Power BI standards, reporting process improvements, and division reporting priorities.',
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
    dates: 'Aug 2023 - Jun 2026',
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
    stack: 'Python - CSS - Node.js - SQL',
    title: 'Natural Language SQL Assistant',
    tag: 'In Development',
    description:
      'Developing a natural language SQL assistant that translates plain-language reporting requests into custom SQL queries. Incorporates business rules, database schemas, column definitions, and reference queries to interpret requirements and generate context-aware SQL. Deployed through a GitHub Enterprise Pages workflow.',
  },
  {
    organization: 'JPL',
    stack: 'Power BI - Power Automate - Semantic Modeling',
    title: 'Financial Dashboard',
    tag: 'Internal',
    description:
      'Tracks division funding status and financial performance with live operational reporting. The dashboard is backed by custom SQL retrieval logic and built to support high-visibility planning conversations.',
  },
  {
    organization: 'JPL',
    stack: 'Power BI - Python - Workday data',
    title: 'Personnel Reference Tool',
    tag: 'Internal',
    description:
      'Supported the development of the Personnel Reference Tool and Workday reporting across the division.',
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
    stack: 'Power Apps',
    title: 'Individual Development Plan Tool',
    tag: 'Internal',
    description:
      'Power Apps tool that gives managers a clearer way to track employee goals, development priorities, and longer-term growth plans in one structured internal workflow.',
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
              {skill.label}
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}

function UniversityMark({ src, alt, width, height, bounds }) {
  const [left, top, markWidth, markHeight] = bounds
  return (
    <span className="alma-mater-mark" style={{
      '--mark-ratio': markWidth / markHeight,
      '--image-width': `${width / markWidth * 100}%`,
      '--image-left': `${-left / markWidth * 100}%`,
      '--image-top': `${-top / markHeight * 100}%`,
    }}>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="alma-mater-logo" />
    </span>
  )
}

function AlmaMaterMarks() {
  return (
    <div className="alma-mater-stack" aria-label="Academic background">
      <MotionDiv
        className="alma-mater-card alma-mater-card-sc"
        initial={false}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.78, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <UniversityMark
          src={southCarolinaLogo}
          alt="University of South Carolina logo"
          width={1280}
          height={1406}
          bounds={[12, 9, 1261, 1392]}
        />
      </MotionDiv>

      <MotionDiv
        className="alma-mater-card alma-mater-card-usc"
        initial={false}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.78, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <UniversityMark
          src={southernCaliforniaLogo}
          alt="University of Southern California logo"
          width={3840}
          height={2160}
          bounds={[1280, 118, 1288, 1924]}
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
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={profilePhoto} alt="Portrait of Kevin Liu" width="911" height="983" decoding="async" fetchPriority="high" />
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
          <article key={entry.organization} className={`timeline-group${entry.roles.length > 1 ? ' timeline-group-connected' : ''}`}>
            <header className="timeline-role-context">
              <h2>{entry.organization}</h2>
              <span>{entry.location}</span>
            </header>
            <div className="timeline-role-list">
              {entry.roles.map((role) => (
                <section key={`${entry.organization}-${role.title}`} className="timeline-role">
                  <div className="timeline-role-head">
                    <h3>{role.title}</h3>
                    <span>{role.dates}</span>
                  </div>
                  {role.bullets.length > 0 ? (
                    <ul>{role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                  ) : null}
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

function ContactAside({ contactState, contactStatus, contactError, onChange, onSubmit }) {
  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <label>
        <span>Your Name</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          maxLength={120}
          value={contactState.name}
          onChange={onChange}
          placeholder="Who is reaching out?"
          required
        />
      </label>

      <label>
        <span>Your Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          maxLength={254}
          value={contactState.email}
          onChange={onChange}
          placeholder="Where can Kevin reply?"
          required
        />
      </label>

      <label>
        <span>Company</span>
        <input
          type="text"
          name="company"
          autoComplete="organization"
          maxLength={160}
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
          maxLength={200}
          value={contactState.optional}
          onChange={onChange}
          placeholder="Anything extra to add"
        />
      </label>

      <label className="contact-message">
        <span>Message</span>
        <textarea
          name="message"
          maxLength={5000}
          rows="3"
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

      <p className="contact-service-note"><a href="mailto:kevinhumingliu@gmail.com">Email Kevin directly</a></p>
      {contactStatus === 'sent' ? <p className="submitted-note" role="status">Message sent to Kevin successfully.</p> : null}
      {contactStatus === 'error' ? <p className="submitted-note submitted-note-error" role="alert">{contactError}</p> : null}
    </form>
  )
}

function App() {
  const reducedMotion = useMotionPreference()
  const contentRef = useRef(null)
  const [hasEntered, setHasEntered] = useState(false)
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window.location.hash.slice(1)
    return sections.some((section) => section.id === hash) ? hash : 'intro'
  })
  const [contactStatus, setContactStatus] = useState('idle')
  const [contactError, setContactError] = useState('')
  const [contactState, setContactState] = useState({
    name: '',
    email: '',
    company: '',
    optional: '',
    message: '',
  })

  const sectionMap = useMemo(() => Object.fromEntries(sections.map((section) => [section.id, section])), [])
  const beforeContentCommit = useCallback(() => {
    const region = contentRef.current
    if (region?.contains(document.activeElement) && document.activeElement !== region) {
      region.focus({ preventScroll: true })
    }
  }, [])
  const { displayedKey: displayedId, opacity: contentOpacity } = useContentTransition(activeSection, reducedMotion, beforeContentCommit)
  const displayedSection = sectionMap[displayedId]
  const mainTitle = displayedSection.title
  const mainSubtitle = displayedSection.subtitle
  const mainCopy = displayedSection.copy
  const headingClassName = 'info-heading'

  const navigateTo = useCallback((targetId) => {
    if (!sectionMap[targetId]) return
    setActiveSection(targetId)
    if (window.location.hash !== '#' + targetId) window.history.pushState(null, '', '#' + targetId)
  }, [sectionMap])

  // Reset after the replacement is mounted, while the single content layer is
  // dimmed. The outgoing page keeps its scroll position throughout departure.
  useLayoutEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [displayedId])

  useEffect(() => {
    const onHistory = () => {
      const hash = window.location.hash.slice(1)
      const targetId = sectionMap[hash] ? hash : 'intro'
      setActiveSection(targetId)
    }
    const onWheel = (event) => {
      if (!hasEntered || event.ctrlKey || event.metaKey || !event.target.closest?.('.pool-scene')) return
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (Math.abs(delta) < 30) return
      event.preventDefault()
      const now = Date.now()
      if (now - lastWheel < 650) return
      lastWheel = now
      const index = sections.findIndex((section) => section.id === activeSection)
      const next = Math.max(0, Math.min(sections.length - 1, index + Math.sign(delta)))
      navigateTo(sections[next].id)
    }
    const onKeyDown = (event) => {
      if (!event.target.closest?.('.pool-navigation')) return
      const index = sections.findIndex((section) => section.id === activeSection)
      let next
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % sections.length
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + sections.length - 1) % sections.length
      if (event.key === 'Home') next = 0
      if (event.key === 'End') next = sections.length - 1
      if (next === undefined) return
      event.preventDefault()
      navigateTo(sections[next].id)
      document.querySelectorAll('.pool-navigation button')[next]?.focus()
    }
    let lastWheel = 0
    window.addEventListener('popstate', onHistory)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('popstate', onHistory)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeSection, navigateTo, sectionMap, hasEntered])

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
      formData.append('email', contactState.email)
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
        signal: AbortSignal.timeout(15000),
      })

      const result = await response.json()
      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error('Unable to send the message right now.')
      }

      setContactStatus('sent')
      setContactState({
        name: '',
        email: '',
        company: '',
        optional: '',
        message: '',
      })
    } catch (error) {
      setContactStatus('error')
      setContactError(
        error instanceof Error
          ? error.name === 'TimeoutError'
            ? 'Sending timed out. Please try again or use the email link below.'
            : error.message
          : 'Something went wrong while trying to send your message.',
      )
    }
  }

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
    <div className={`app-shell ${hasEntered ? 'has-entered' : 'is-at-block'} ${reducedMotion ? 'reduced-motion' : ''}`}>
      {hasEntered && <a href="#portfolio-content" className="skip-link" onClick={(event) => { event.preventDefault(); contentRef.current?.focus() }}>Skip to content</a>}
      <main className="swim-world">
        <PoolScene sections={sections} activeSection={activeSection} onNavigate={navigateTo} hasEntered={hasEntered}
          onEnter={() => {
            setHasEntered(true)
            if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => document.querySelector('.pool-navigation button[aria-current="page"]')?.focus({ preventScroll: true }))
          }} />

        <section className={`info-stage${displayedId === 'contact' ? ' info-stage-contact' : ''}`} id="portfolio-content" ref={contentRef} aria-label={mainTitle} tabIndex={-1}
          aria-busy={activeSection !== displayedId}
          inert={!hasEntered} aria-hidden={!hasEntered}>
          <span className="sr-only" role="status">{displayedSection.navLabel}</span>
            <MotionDiv
              className={`info-layout info-layout-${displayedSection.id}`}
              data-section={displayedId}
              style={{ opacity: contentOpacity }}
            >
              <div className="info-main">
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
                  <WorkProjectGroups cards={workProjectCards} />
                ) : null}
              </div>

              {displayedSection.id === 'intro' ? (
                <div className="intro-about-column">
                  <IntroAbout onNavigateContact={() => navigateTo('contact')} />
                </div>
              ) : null}

              {displayedSection.id !== 'projects' ? (
                <div className={`info-side ${displayedSection.id === 'intro' ? 'info-side-intro' : ''}`}>
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
                </div>
              ) : null}
            </MotionDiv>
        </section>
      </main>
    </div>
    </MotionConfig>
  )
}

export default App
