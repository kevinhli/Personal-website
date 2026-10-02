// Angles are measured clockwise from vertical. Every limb keeps fixed bone
// lengths; the shoulders, elbows, hips, and knees remain connected in each pose.
export const DIVE_DURATION = 3600
export const WATERLINE = 190
export const GLIDE_DURATION = 1800
export const STROKE_DURATION = 1.5
export const FIRST_CHECKPOINT = 620
export const MAX_SWIM_SPEED = 520

export const smoothstep = (value) => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
}

const mix = (a, b, t) => a + (b - a) * t
const hermite = (from, to, startTangent, endTangent, t) =>
  (2 * t ** 3 - 3 * t ** 2 + 1) * from
  + (t ** 3 - 2 * t ** 2 + t) * startTangent
  + (-2 * t ** 3 + 3 * t ** 2) * to
  + (t ** 3 - t ** 2) * endTangent

export const diveKeys = [
  { t: 0, x: 103, y: 120, rotation: 0, arms: [155, 165, 190, 195], legs: [178, 178, 188, 178] },
  { t: 0.16, x: 103, y: 141, rotation: 22, arms: [78, 32, 96, 52], legs: [114, 212, 129, 221] },
  { t: 0.29, x: 133, y: 110, rotation: 48, arms: [12, 0, -12, -2], legs: [178, 180, 198, 182] },
  { t: 0.46, x: 224, y: 85, rotation: 83, arms: [0, 0, -8, 0], legs: [180, 180, 188, 182] },
  { t: 0.62, x: 304, y: 98, rotation: 122, arms: [0, 0, -7, 0], legs: [180, 180, 187, 182] },
  // Hands reach the waterline first at t = 0.70. The head and torso follow.
  { t: 0.70, x: 342, y: 112, rotation: 145, arms: [0, 0, -6, 0], legs: [180, 180, 186, 180] },
  { t: 0.83, x: 370, y: 212, rotation: 154, arms: [0, 0, -6, 0], legs: [180, 180, 186, 180] },
  { t: 1, x: 433, y: 235, rotation: 112, arms: [0, 0, -8, 0], legs: [180, 180, 188, 180] },
]

export function sampleDive(progress) {
  const t = Math.max(0, Math.min(1, progress))
  const nextIndex = diveKeys.findIndex((pose) => pose.t >= t)
  if (nextIndex <= 0) return diveKeys[0]
  const from = diveKeys[nextIndex - 1]
  const to = diveKeys[nextIndex]
  const linear = (t - from.t) / (to.t - from.t)
  // Smooth the preparation, then use linear travel through the airborne arc.
  const blend = t < 0.29 ? linear * linear * (3 - 2 * linear) : linear
  const mix = (a, b) => a + (b - a) * blend
  const curve = (axis) => {
    if (t < 0.29) return mix(from[axis], to[axis])
    const previous = diveKeys[Math.max(0, nextIndex - 2)]
    const following = diveKeys[Math.min(diveKeys.length - 1, nextIndex + 1)]
    const duration = to.t - from.t
    const startTangent = (to[axis] - previous[axis]) / (to.t - previous.t) * duration
    const endTangent = (following[axis] - from[axis]) / (following.t - from.t) * duration
    const u = linear
    // Cubic Hermite interpolation rounds the flight arc and its water entry.
    return (2 * u ** 3 - 3 * u ** 2 + 1) * from[axis]
      + (u ** 3 - 2 * u ** 2 + u) * startTangent
      + (-2 * u ** 3 + 3 * u ** 2) * to[axis]
      + (u ** 3 - u ** 2) * endTangent
  }
  return {
    t,
    x: curve('x'), y: curve('y'), rotation: mix(from.rotation, to.rotation),
    arms: from.arms.map((angle, i) => mix(angle, to.arms[i])),
    legs: from.legs.map((angle, i) => mix(angle, to.legs[i])),
  }
}

export function boneEnd(start, length, angle) {
  const radians = angle * Math.PI / 180
  return [start[0] + Math.sin(radians) * length, start[1] - Math.cos(radians) * length]
}

export function limbPoints(start, angles, lengths) {
  const joint = boneEnd(start, lengths[0], angles[0])
  return [start, joint, boneEnd(joint, lengths[1], angles[1])]
}

export function divePhase(progress) {
  if (progress < 0.2) return 'Preparation'
  if (progress < 0.34) return 'Launch'
  if (progress < 0.7) return 'Airborne extension'
  if (progress < 0.83) return 'Hands-first entry'
  return 'Underwater follow-through'
}

// A small weight shift and breathing motion while the feet stay planted.
export function sampleStandby(seconds) {
  const pose = sampleDive(0)
  const breath = Math.sin(seconds * 1.4)
  return {
    ...pose,
    rotation: breath * 0.55,
    arms: pose.arms.map((angle, i) => angle + breath * (i % 2 ? 1.4 : 2)),
    legs: pose.legs.map((angle) => angle - breath * 0.55),
  }
}

// The two arms are half a stroke apart. Elbow flexion follows the pull and
// recovery, with three alternating kick beats during each full arm cycle.
// Unwrapped angles keep the recovery continuous at the end of each cycle.
export function sampleStroke(seconds) {
  const phase = seconds / STROKE_DURATION
  const arm = (offset) => {
    const angle = (phase + offset) * 360
    return [angle, angle - 64 * Math.sin((phase + offset) * Math.PI * 2)]
  }
  const kick = Math.sin(phase * Math.PI * 6)
  return {
    arms: [...arm(0), ...arm(-0.5)],
    legs: [180 + kick * 11, 181 + kick * 16,
      180 - kick * 11, 181 - kick * 16],
    bob: Math.sin(phase * Math.PI * 2) * 2,
    roll: Math.sin(phase * Math.PI * 2) * 1.8,
  }
}

// One continuous underwater path brings the dive into the first checkpoint.
// Its initial velocity matches the last dive segment; the swimmer surfaces
// gradually and starts the same stroke clock used for all later travel.
export function sampleGlide(progress) {
  const t = Math.max(0, Math.min(1, progress))
  const blend = smoothstep(t)
  const endDive = sampleDive(1)
  const stroke = sampleStroke(t * GLIDE_DURATION / 1000)
  const seconds = GLIDE_DURATION / 1000
  const last = diveKeys[diveKeys.length - 2]
  const diveSeconds = (1 - last.t) * DIVE_DURATION / 1000
  return {
    x: hermite(endDive.x, FIRST_CHECKPOINT, (endDive.x - last.x) / diveSeconds * seconds, 0, t),
    y: hermite(endDive.y, WATERLINE, (endDive.y - last.y) / diveSeconds * seconds, 0, t) + stroke.bob * blend,
    rotation: mix(endDive.rotation, 90 + stroke.roll, blend),
    arms: endDive.arms.map((angle, i) => mix(angle, stroke.arms[i], blend)),
    legs: endDive.legs.map((angle, i) => mix(angle, stroke.legs[i], blend)),
  }
}

// Match the swimmer's destinations to the real checkpoint button centers.
// The world origin stays fixed as the camera expands to wider screens.
export function poolLayout(width, height, count = 4) {
  // Match the navigation's mobile breakpoint. Extra world width leaves
  // room for a fully extended arm at the last checkpoint on narrow screens.
  const compact = width <= 700
  const viewWidth = Math.max(660, width / Math.max(1, height) * 320)
  const navigationWidth = Math.min(width - (compact ? 24 : 48), 1200)
  const fractions = Array.from({ length: count }, (_, i) =>
    ((width - navigationWidth) / 2 + navigationWidth * (i + 0.5) / count) / width)
  return {
    entryWidth: compact ? 440 : 560,
    viewWidth,
    origin: FIRST_CHECKPOINT - fractions[0] * viewWidth,
    checkpoints: fractions.map((fraction) => FIRST_CHECKPOINT + (fraction - fractions[0]) * viewWidth),
  }
}

export function entryCamera(pose, elapsed, layout) {
  const blend = smoothstep(elapsed / (DIVE_DURATION + GLIDE_DURATION))
  return {
    // Hold enough space behind the body during underwater follow-through.
    // The camera catches up naturally as the swimmer reaches the surface.
    origin: Math.min(layout.origin * blend, Math.max(0, pose.x - 78)),
    width: mix(layout.entryWidth, layout.viewWidth, blend),
  }
}

// Use the SVG's centered aspect-ratio fit, including any letterboxing, so
// the banner marker and its guide stay directly above the swimmer.
export function projectPoolPoint(point, camera, width, height) {
  const scale = Math.min(width / camera.width, height / 320)
  return {
    x: (width - camera.width * scale) / 2 + (point.x - camera.origin) * scale,
    y: (height - 320 * scale) / 2 + point.y * scale,
  }
}

// Turn around the vertical axis with a critically damped angular spring.
// Both angular and travel velocity survive retargeting; forward travel eases
// back in as the swimmer comes around to face the destination.
export function stepSwimmer(state, destination, delta) {
  const dt = Math.max(0, Math.min(0.04, delta))
  const error = destination - state.x
  const desiredHeading = Math.abs(error) > 18 ? (error < 0 ? 180 : 0) : state.targetHeading
  const angularVelocity = state.angularVelocity ?? 0
  const offset = state.heading - desiredHeading
  const spring = 2.8
  const tangent = angularVelocity + spring * offset
  const decay = Math.exp(-spring * dt)
  const heading = desiredHeading + (offset + tangent * dt) * decay
  const nextAngularVelocity = (angularVelocity - spring * tangent * dt) * decay
  const facing = Math.cos((heading - desiredHeading) * Math.PI / 180)
  const alignment = smoothstep(Math.max(0, facing))
  const targetVelocity = Math.max(-MAX_SWIM_SPEED, Math.min(MAX_SWIM_SPEED, error * 2.3)) * alignment
  const velocity = mix(state.velocity, targetVelocity, 1 - Math.exp(-5.5 * dt))
  return {
    x: state.x + velocity * dt,
    velocity,
    heading,
    angularVelocity: nextAngularVelocity,
    targetHeading: desiredHeading,
  }
}

// Perspective of a horizontal swimmer turning in the water. The screen's
// vertical axis stays upright; longitudinal distance foreshortens through
// the turn and depth becomes visible instead of flipping the body over.
export function projectSwimPoint([x, y, z = 0], yaw = 0) {
  const angle = yaw * Math.PI / 180
  return [x, y * Math.cos(angle) + z * Math.sin(angle)]
}

export function swimLimbPoints(start, angles, lengths, yaw, far = false, leg = false) {
  const points = limbPoints(start, angles, lengths)
  const side = far ? -1 : 1
  const sweep = Math.sin(yaw * Math.PI / 180) * side * (leg ? 0.5 : 0.85)
  // Rotate the stroke plane into depth while retaining each 3D bone length.
  return points.map(([x, y]) => [start[0] + (x - start[0]) * Math.cos(sweep), y,
    side * 5 + (x - start[0]) * Math.sin(sweep)])
}

export function sampleSwimming(state, seconds) {
  const stroke = sampleStroke(seconds)
  const yaw = state.heading * Math.PI / 180
  const turn = Math.sin(yaw) ** 2
  return {
    x: state.x,
    y: WATERLINE + stroke.bob + turn * 5,
    rotation: 90 + stroke.roll * Math.cos(yaw) + Math.sin(yaw * 2) * 3,
    yaw: state.heading,
    arms: stroke.arms.map((angle, i) => i % 2
      ? stroke.arms[i - 1] + (angle - stroke.arms[i - 1]) * (1 + turn * 0.25) : angle),
    legs: stroke.legs.map((angle, i) => 180 + (angle - 180) * (1 + turn * 0.6)
      + (i % 2 ? (i < 2 ? 10 : -10) * turn : 0)),
  }
}
