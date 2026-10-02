import { useEffect, useId, useRef, useState } from 'react'
import useMotionPreference from './useMotionPreference'
import { createBubbleField, stepBubbleField } from './poolBubbles'
import { DIVE_DURATION, GLIDE_DURATION, FIRST_CHECKPOINT, WATERLINE, divePhase, entryCamera, limbPoints,
  poolLayout, projectPoolPoint, projectSwimPoint, sampleDive, sampleGlide, sampleStandby, sampleSwimming,
  smoothstep, stepSwimmer, swimLimbPoints } from './poolMotion'
import './PoolScene.css'

function Limb({ start, angles, lengths, pose, far = false, leg = false }) {
  const points = pose.yaw === undefined ? limbPoints(start, angles, lengths)
    : swimLimbPoints(start, angles, lengths, pose.yaw, far, leg).map((point) => projectSwimPoint(point, pose.yaw))
  const end = points[2]
  return (
    <g className={far ? 'human-limb human-limb-far' : 'human-limb'}>
      <polyline points={points.map((point) => point.join(',')).join(' ')}
        fill="none" stroke={far ? '#af7355' : '#e4ad82'} strokeWidth={leg ? 9 : 7}
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[1][0]} cy={points[1][1]} r={leg ? 4.5 : 3.5} fill={far ? '#af7355' : '#e4ad82'} />
      <path d={leg ? `M${end[0] - 3},${end[1]} l10,1` : `M${end[0]},${end[1]} l0,${-5 * Math.cos((pose.yaw ?? 0) * Math.PI / 180)}`}
        stroke={far ? '#af7355' : '#e4ad82'} strokeWidth={leg ? 6 : 5} strokeLinecap="round" />
    </g>
  )
}

export function HumanSwimmer({ pose }) {
  const point = (x, y, z = 0) => projectSwimPoint([x, y, z], pose.yaw).join(' ')
  const yaw = (pose.yaw ?? 0) * Math.PI / 180
  const front = Math.sin(yaw) ** 2
  return (
    <g className="human-swimmer" transform={`translate(${pose.x} ${pose.y}) rotate(${pose.rotation})`}>
      <Limb start={[-5, -42]} angles={pose.arms.slice(2)} lengths={[24, 25]} pose={pose} far />
      <Limb start={[-5, 0]} angles={pose.legs.slice(2)} lengths={[29, 29]} pose={pose} far leg />
      <path d={`M${point(-11, -45, -6)} Q${point(-9, -50, -3)} ${point(0, -50)} Q${point(9, -50, 3)} ${point(12, -44, 6)} L${point(9, -22, 7)} L${point(7, -4, 4)} Q${point(0, 1)} ${point(-7, -4, -4)} L${point(-10, -23, -7)} Z`}
        fill="#e4ad82" stroke="#173a49" strokeWidth="1.2" />
      <path d={`M${point(-8, -13, -6)} L${point(8, -13, 6)} L${point(9, 3, 6)} L${point(1, 5, 1)} L${point(-1, 0, -1)} L${point(-8, 4, -6)} Z`} fill="#102b3e" />
      <path d={`M${point(-3, -50, -2)} L${point(-3, -56, -2)} L${point(4, -56, 2)} L${point(4, -50, 2)}`} fill="#e4ad82" />
      <g className="human-head" transform={`translate(${point(1, -66)})`}>
        <circle r="10" fill="#e4ad82" stroke="#173a49" strokeWidth="1" />
        <g transform={`scale(1 ${Math.cos(yaw)})`} opacity={1 - front}>
          <path d="M-10 1 A10 10 0 0 1 10 0 L3 1 Z" fill="#f7f4ee" stroke="#173a49" strokeWidth="1" />
          <path d="M6 2 L12 4 L8 7" fill="#e4ad82" />
          <path d="M2 1 L9 1 L10 4 L4 4 Z" fill="#102b3e" />
          <circle cx="-1" cy="4" r="1.8" fill="#c48c69" />
        </g>
        <g opacity={front}>
          <path d="M-8 -6 Q-13 0 -8 6 L-5 8 Q-8 0 -5 -8 Z" fill="#f7f4ee" stroke="#173a49" strokeWidth="1" />
          <path d="M2 -8 h3 v6 h-3 Z M2 2 h3 v6 h-3 Z M3 -2 V2" fill="#102b3e" stroke="#102b3e" />
          <circle cx="7" r="1.7" fill="#c48c69" />
        </g>
      </g>
      <Limb start={[5, 0]} angles={pose.legs.slice(0, 2)} lengths={[29, 29]} pose={pose} leg />
      <Limb start={[7, -42]} angles={pose.arms.slice(0, 2)} lengths={[24, 25]} pose={pose} />
    </g>
  )
}

function PoolIllustration({ frame, layout, camera, entered }) {
  const id = useId().replaceAll(':', '')
  const { pose, progress, elapsed, phase, strokeSeconds, heading } = frame
  const { origin, width } = camera
  const direction = Math.cos(heading * Math.PI / 180)
  const splash = Math.max(0, Math.min(1, (progress - 0.70) / 0.3))
  const visibleSplash = phase === 'dive' && progress >= 0.70 && progress < 1
  const lanes = entered ? smoothstep((elapsed - DIVE_DURATION * 0.7) / GLIDE_DURATION) : 0
  return (
    <svg className="pool-illustration" viewBox={`${origin} 0 ${width} 320`}
      data-phase={phase} data-world-x={pose.x.toFixed(3)} data-world-y={pose.y.toFixed(3)}
      data-heading={heading.toFixed(3)} data-stroke-seconds={strokeSeconds.toFixed(3)}
      data-body-rotation={pose.rotation.toFixed(3)}
      data-bubble-count={frame.bubbles.length}
      data-dive-progress={progress.toFixed(3)}>
      <defs>
        <clipPath id={`${id}-air`}><rect x="-3000" y="-500" width="10000" height={WATERLINE + 500} /></clipPath>
        <clipPath id={`${id}-water`}><rect x="-3000" y={WATERLINE} width="10000" height="600" /></clipPath>
        <radialGradient id={`${id}-bubble`} cx="30%" cy="24%" r="78%">
          <stop offset="0" stopColor="#effcff" stopOpacity="0.24" />
          <stop offset="0.35" stopColor="#d8f7ff" stopOpacity="0.04" />
          <stop offset="0.7" stopColor="#8ed2e8" stopOpacity="0.01" />
          <stop offset="1" stopColor="#e6faff" stopOpacity="0.16" />
        </radialGradient>
        <pattern id={`${id}-rope`} width="64" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 3 H64" stroke="#f3f6ee" strokeWidth="6" />
          <path d="M22 3 H36" stroke="#ce6864" strokeWidth="6" />
          <path d="M36 3 H50" stroke="#70cde2" strokeWidth="6" />
        </pattern>
      </defs>
      <path d="M-3000 190 H7000" stroke="#edfaff" strokeWidth="1.3" opacity="0.58" />
      <g opacity={lanes * 0.68}>
        <rect x="148" y="137" width="6500" height="6" fill={`url(#${id}-rope)`} />
        <rect x="148" y="276" width="6500" height="6" fill={`url(#${id}-rope)`} />
        {layout.checkpoints.map((x, i) => <path key={i} d={`M${x} 282 v20 m-12,-20 h24`}
          fill="none" stroke="#eaf5ef" strokeWidth="2" opacity="0.5" />)}
      </g>
      <path d="M-3000 191 H138 V310 H-3000 Z" fill="#f0eee5" />
      <path d="M138 192 V310" stroke="#d3d4cd" strokeWidth="3" />
      <path d="M0 229 H135 M0 263 H135 M0 297 H135 M30 192 V310 M78 192 V310 M126 192 V310" stroke="#d3d4cd" strokeWidth="1" />
      <path d="M91 190 V178 H112 V190" fill="#173a49" />
      <path d="M80 178 H127 L130 184 H80 Z" fill="#f7f4ee" stroke="#173a49" strokeWidth="1.5" />
      <text x="98" y="216" fill="#264b59" fontSize="10" fontFamily="inherit">01</text>
      <g className="pool-bubbles" clipPath={`url(#${id}-water)`} aria-hidden="true">
        {frame.bubbles.map((bubble) => (
          <g key={bubble.id} className="pool-bubble" transform={`translate(${bubble.x} ${bubble.y})`} opacity={bubble.opacity}>
            <circle r={bubble.radius} fill={`url(#${id}-bubble)`} stroke="#d9f7ff" strokeOpacity="0.62" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
            {bubble.radius > 1.6 && <path d={`M${-bubble.radius * 0.66} ${-bubble.radius * 0.12} A${bubble.radius * 0.7} ${bubble.radius * 0.7} 0 0 1 ${bubble.radius * 0.12} ${-bubble.radius * 0.66}`}
              fill="none" stroke="#f2fcff" strokeOpacity="0.82" strokeWidth="0.7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />}
          </g>
        ))}
      </g>
      {(phase === 'glide' || phase === 'swim') && <g transform={`translate(${pose.x} ${WATERLINE})`}
        fill="none" stroke="#e5f7fa" strokeWidth="1.6" opacity={0.35 + Math.sin(strokeSeconds * 4) * 0.12}>
        <path d={`M${-94 * direction} 2 Q${-75 * direction} -4 ${-54 * direction} 2 M${-110 * direction} 10 Q${-82 * direction} 4 ${-64 * direction} 10`} />
        <ellipse cx={38 * direction} cy="0" rx={8 + (24 + Math.sin(strokeSeconds * 4) * 5) * Math.abs(direction)} ry="3" />
      </g>}
      <g clipPath={`url(#${id}-air)`}><HumanSwimmer pose={pose} /></g>
      <g clipPath={`url(#${id}-water)`} opacity="0.72"><HumanSwimmer pose={pose} /></g>
      {visibleSplash && (
        <g className="dive-splash" fill="none" stroke="#edfaff" strokeLinecap="round" opacity={1 - splash * 0.8}>
          <ellipse cx="400" cy="192" rx={12 + splash * 70} ry={2 + splash * 6} strokeWidth="1.7" />
          <ellipse cx="400" cy="192" rx={7 + splash * 45} ry={1 + splash * 4} strokeWidth="1" />
          {[[-20, -23], [12, -32], [28, -17], [-36, -10], [39, -7]].map(([dx, dy], i) => (
            <path key={i} d={`M${400 + dx * (0.3 + splash)},${189 + dy * Math.sin(splash * Math.PI)} l${dx * 0.08},-3`}
              strokeWidth="2.5" />
          ))}
        </g>
      )}
    </svg>
  )
}

const initialFrame = { pose: sampleStandby(0), progress: 0, elapsed: 0, phase: 'standby', strokeSeconds: 0, heading: 0, bubbles: [] }

export default function PoolScene({ sections, activeSection, onNavigate, hasEntered, onEnter }) {
  const reducedMotion = useMotionPreference()
  const canAnimate = !reducedMotion && typeof window.requestAnimationFrame === 'function'
  const sceneRef = useRef(null)
  const sizeRef = useRef({ width: 560, height: 320 })
  const [size, setSize] = useState({ width: 560, height: 320 })
  const [frame, setFrame] = useState(initialFrame)
  const engine = useRef({ phase: 'standby', clock: 0, elapsed: 0, target: 0, entryPose: initialFrame.pose,
    bubbles: createBubbleField(),
    swimmer: { x: FIRST_CHECKPOINT, velocity: 0, heading: 0, targetHeading: 0 } })
  const activeIndex = sections.findIndex((section) => section.id === activeSection)

  useEffect(() => { engine.current.target = activeIndex }, [activeIndex])

  useEffect(() => {
    if (canAnimate || !hasEntered) return
    const layout = poolLayout(sizeRef.current.width, sizeRef.current.height, sections.length)
    engine.current.phase = 'swim'
    engine.current.elapsed = DIVE_DURATION + GLIDE_DURATION
    engine.current.swimmer = { x: layout.checkpoints[activeIndex], velocity: 0, heading: 0, targetHeading: 0 }
  }, [canAnimate, hasEntered, activeIndex, sections.length])

  useEffect(() => {
    const measure = () => {
      const box = sceneRef.current.getBoundingClientRect()
      sizeRef.current = { width: box.width || 560, height: box.height || 320 }
      setSize(sizeRef.current)
    }
    measure()
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null
    observer?.observe(sceneRef.current)
    window.addEventListener('resize', measure)
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  useEffect(() => {
    if (!canAnimate) return
    let animationFrame
    let lastTick = performance.now()
    const resetTime = () => { lastTick = performance.now() }
    const tick = (now) => {
      const delta = document.hidden ? 0 : Math.min(0.04, (now - lastTick) / 1000)
      lastTick = now
      const current = engine.current
      current.clock += delta
      if (current.phase !== 'standby') current.elapsed += delta * 1000
      const progress = Math.min(1, current.elapsed / DIVE_DURATION)
      const strokeSeconds = Math.max(0, (current.elapsed - DIVE_DURATION) / 1000)
      let pose
      if (current.phase === 'standby') pose = sampleStandby(current.clock)
      else if (current.elapsed < DIVE_DURATION) {
        current.phase = 'dive'
        pose = sampleDive(progress)
        const settle = 1 - smoothstep(progress / 0.12)
        const standing = sampleDive(0)
        pose = { ...pose, rotation: pose.rotation + (current.entryPose.rotation - standing.rotation) * settle,
          arms: pose.arms.map((angle, i) => angle + (current.entryPose.arms[i] - standing.arms[i]) * settle),
          legs: pose.legs.map((angle, i) => angle + (current.entryPose.legs[i] - standing.legs[i]) * settle) }
      } else if (current.elapsed < DIVE_DURATION + GLIDE_DURATION) {
        current.phase = 'glide'
        pose = sampleGlide((current.elapsed - DIVE_DURATION) / GLIDE_DURATION)
      } else {
        if (current.phase !== 'swim') {
          current.swimmer = { x: FIRST_CHECKPOINT, velocity: 0, heading: 0, targetHeading: 0 }
          current.phase = 'swim'
        }
        const layout = poolLayout(sizeRef.current.width, sizeRef.current.height, sections.length)
        const destination = layout.checkpoints[current.target] + Math.sin(strokeSeconds * 0.8) * 3
        current.swimmer = stepSwimmer(current.swimmer, destination, delta)
        pose = sampleSwimming(current.swimmer, strokeSeconds)
      }
      current.bubbles = stepBubbleField(current.bubbles, { pose, phase: current.phase,
        velocity: current.swimmer.velocity, angularVelocity: current.swimmer.angularVelocity }, delta, sizeRef.current.width <= 700)
      setFrame({ pose, progress, elapsed: current.elapsed, phase: current.phase, strokeSeconds, heading: current.swimmer.heading,
        bubbles: current.bubbles.particles })
      animationFrame = requestAnimationFrame(tick)
    }
    animationFrame = requestAnimationFrame(tick)
    document.addEventListener('visibilitychange', resetTime)
    return () => { cancelAnimationFrame(animationFrame); document.removeEventListener('visibilitychange', resetTime) }
  }, [canAnimate, sections.length])

  const startDive = () => {
    const current = engine.current
    current.entryPose = frame.pose
    current.phase = canAnimate ? 'dive' : 'swim'
    current.elapsed = canAnimate ? 0 : DIVE_DURATION + GLIDE_DURATION
    onEnter()
  }

  const layout = poolLayout(size.width, size.height, sections.length)
  const displayedFrame = canAnimate ? frame : hasEntered
    ? { ...initialFrame, pose: sampleSwimming({ x: layout.checkpoints[activeIndex], heading: 0 }, 0),
      phase: 'swim', progress: 1, elapsed: DIVE_DURATION + GLIDE_DURATION }
    : initialFrame
  const camera = entryCamera(displayedFrame.pose, hasEntered ? displayedFrame.elapsed : 0, layout)
  const swimmerPosition = projectPoolPoint(displayedFrame.pose, camera, size.width, size.height)
  const guideOpacity = hasEntered ? smoothstep((displayedFrame.elapsed - DIVE_DURATION) / 900) : 0
  return (
    <section className="pool-stage"
      style={{ '--swimmer-x': `${swimmerPosition.x}px`, '--swimmer-guide-height': `${Math.max(0, swimmerPosition.y - 12)}px`,
        '--swimmer-guide-opacity': guideOpacity }}
      aria-label="Interactive pool navigation">
      <nav className="pool-navigation" aria-label="Pool checkpoints" inert={!hasEntered} aria-hidden={!hasEntered}>
        {sections.map((section) => (
          <button key={section.id} type="button" onClick={() => onNavigate(section.id)}
            className={`checkpoint-button ${activeSection === section.id ? 'is-active' : ''}`}
            aria-current={activeSection === section.id ? 'page' : undefined} aria-controls="portfolio-content">
            <span>{section.navLabel}</span><span className="checkpoint-meter" aria-hidden="true">{section.meter} m</span>
          </button>
        ))}
      </nav>
      {hasEntered && <div className="pool-progress-marker" aria-hidden="true" />}
      <div className="pool-scene" ref={sceneRef} aria-hidden="true">
        <div className="pool-swimmer-guide" />
        <PoolIllustration frame={displayedFrame} layout={layout} camera={camera} entered={hasEntered} />
      </div>
      {!hasEntered && <>
        <div className="entry-heading"><h1>Kevin Liu</h1></div>
        <div className="pool-entry">
          <button className="dive-button" type="button" onClick={startDive}>Dive In</button>
        </div>
      </>}
      {hasEntered && <span className="sr-only" role="status">
        {displayedFrame.phase === 'dive' ? divePhase(displayedFrame.progress) : 'Portfolio ready. Choose a pool checkpoint to explore.'}
      </span>}
    </section>
  )
}
