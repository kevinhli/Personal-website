import { MAX_SWIM_SPEED, WATERLINE, smoothstep } from './poolMotion.js'

export const DESKTOP_BUBBLE_LIMIT = 26
export const MOBILE_BUBBLE_LIMIT = 16

export function createBubbleField(seed = 73129) {
  return { particles: [], delay: 0, seed, nextId: 0 }
}

// Bubbles keep independent world positions and momentum after emission.
// The shared animation clock freezes this field along with the swimmer.
export function stepBubbleField(field, swimmer, delta, compact = false) {
  const dt = Math.max(0, Math.min(0.04, delta))
  if (dt === 0) return field
  let seed = field.seed
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
  const particles = field.particles.map((bubble) => {
    const age = bubble.age + dt
    const vx = bubble.vx * Math.exp(-1.6 * dt)
    const x = bubble.x + vx * dt + Math.sin(age * bubble.frequency + bubble.phase) * bubble.drift * dt
    const y = bubble.y - bubble.rise * dt
    const radius = bubble.baseRadius * (1 + age / bubble.life * 0.1)
    const opacity = bubble.alpha * smoothstep(age / 0.18) * smoothstep((bubble.life - age) / 0.65)
      * smoothstep((y - WATERLINE - radius) / 9)
    return { ...bubble, age, x, y, vx, radius, opacity }
  }).filter((bubble) => bubble.age < bubble.life && bubble.y - bubble.radius > WATERLINE + 0.5)

  let delay = field.delay - dt
  let nextId = field.nextId
  const { pose, phase, velocity = 0, angularVelocity = 0 } = swimmer
  const underwater = phase === 'glide' || phase === 'swim' || (phase === 'dive' && pose.y > WATERLINE + 8)
  if (underwater && delay <= 0) {
    const activity = Math.min(1, Math.abs(velocity) / MAX_SWIM_SPEED + Math.abs(angularVelocity) / 600)
    const limit = compact ? MOBILE_BUBBLE_LIMIT : DESKTOP_BUBBLE_LIMIT
    if (particles.length < limit) {
      const yaw = (pose.yaw ?? 0) * Math.PI / 180
      const direction = Math.cos(yaw)
      const source = random()
      const trail = source < 0.68
      const breath = source > 0.86
      const radius = trail ? 0.9 + random() * 1.55 : 2 + random() * 2.8
      const along = trail ? -(42 + random() * 28) : breath ? 54 + random() * 10 : random() * 95 - 30
      const x = pose.x + direction * along + (random() - 0.5) * (8 + Math.abs(Math.sin(yaw)) * 20)
      const y = Math.max(WATERLINE + radius + 8, pose.y + (trail ? 12 : breath ? 7 : 22) + random() * (trail ? 17 : 20))
      particles.push({ id: nextId++, x, y, age: 0, radius, baseRadius: radius, opacity: 0,
        alpha: 0.28 + random() * 0.24, life: 2.1 + random() * 2.2,
        vx: velocity * (0.06 + random() * 0.05) - direction * (2 + random() * 5),
        rise: 6 + radius * 1.6 + random() * 5, drift: 1.8 + random() * 3.4,
        frequency: 1.1 + random() * 1.6, phase: random() * Math.PI * 2, trail })
    }
    // Irregular intervals avoid rows of evenly spaced or synchronized bubbles.
    delay = (0.18 + random() * 0.26) / (1 + activity * 0.9) / (compact ? 0.7 : 1)
  }
  return { particles, delay: Math.max(-0.04, delay), seed, nextId }
}
