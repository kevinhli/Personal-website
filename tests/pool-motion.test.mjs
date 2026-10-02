import test from 'node:test'
import assert from 'node:assert/strict'
import { WATERLINE, FIRST_CHECKPOINT, DIVE_DURATION, GLIDE_DURATION, STROKE_DURATION, MAX_SWIM_SPEED,
  diveKeys, divePhase, entryCamera, limbPoints, poolLayout, projectPoolPoint, projectSwimPoint,
  sampleDive, sampleGlide, sampleStandby, sampleStroke, sampleSwimming, stepSwimmer, swimLimbPoints } from '../src/poolMotion.js'

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const worldPoint = (pose, point) => {
  const projected = projectSwimPoint(point, pose.yaw)
  const angle = pose.rotation * Math.PI / 180
  return [pose.x + projected[0] * Math.cos(angle) - projected[1] * Math.sin(angle),
    pose.y + projected[0] * Math.sin(angle) + projected[1] * Math.cos(angle)]
}
const poseLimb = (pose, start, angles, lengths, far = false, leg = false) => pose.yaw === undefined
  ? limbPoints(start, angles, lengths) : swimLimbPoints(start, angles, lengths, pose.yaw, far, leg)
const nearHand = (pose) => worldPoint(pose, poseLimb(pose, [7, -42], pose.arms.slice(0, 2), [24, 25])[2])
const worldJoints = (pose) => [
  ...poseLimb(pose, [7, -42], pose.arms.slice(0, 2), [24, 25]),
  ...poseLimb(pose, [-5, -42], pose.arms.slice(2), [24, 25], true),
  ...poseLimb(pose, [5, 0], pose.legs.slice(0, 2), [29, 29], false, true),
  ...poseLimb(pose, [-5, 0], pose.legs.slice(2), [29, 29], true, true),
].map((point) => worldPoint(pose, point))

test('all four limbs retain fixed connected bone lengths across the entire dive', () => {
  for (let step = 0; step <= 1000; step++) {
    const pose = sampleDive(step / 1000)
    const limbs = [
      [[7, -42], pose.arms.slice(0, 2), [24, 25]],
      [[-5, -42], pose.arms.slice(2), [24, 25]],
      [[5, 0], pose.legs.slice(0, 2), [29, 29]],
      [[-5, 0], pose.legs.slice(2), [29, 29]],
    ]
    for (const [start, angles, lengths] of limbs) {
      const points = limbPoints(start, angles, lengths)
      assert.deepEqual(points[0], start)
      assert.ok(Math.abs(distance(points[0], points[1]) - lengths[0]) < 1e-8)
      assert.ok(Math.abs(distance(points[1], points[2]) - lengths[1]) < 1e-8)
      assert.ok(points.flat().every(Number.isFinite))
    }
  }
})

test('hands reach water before the head, torso, and feet', () => {
  const before = sampleDive(0.69)
  const entry = sampleDive(0.70)
  assert.ok(nearHand(before)[1] < WATERLINE)
  assert.ok(nearHand(entry)[1] >= WATERLINE)
  assert.ok(worldPoint(entry, [1, -66])[1] + 10 < WATERLINE)
  assert.ok(worldPoint(entry, [0, -24])[1] < WATERLINE)
  assert.ok(worldPoint(entry, limbPoints([5, 0], entry.legs.slice(0, 2), [29, 29])[2])[1] < WATERLINE)
})

test('head follows hands underwater and the full body follows through', () => {
  assert.ok(worldPoint(sampleDive(0.83), [1, -66])[1] > WATERLINE)
  const end = sampleDive(1)
  assert.ok(worldPoint(end, [0, -24])[1] > WATERLINE)
  assert.ok(worldPoint(end, limbPoints([5, 0], end.legs.slice(0, 2), [29, 29])[2])[1] > WATERLINE)
})

test('pose position and limbs remain continuous at every phase boundary', () => {
  for (const key of diveKeys.slice(1, -1)) {
    const before = sampleDive(key.t - 1e-7)
    const after = sampleDive(key.t + 1e-7)
    assert.ok(distance([before.x, before.y], [after.x, after.y]) < 0.001)
    assert.ok(Math.abs(before.rotation - after.rotation) < 0.001)
    assert.ok(distance(nearHand(before), nearHand(after)) < 0.001)
  }
})

test('standing and preparation keep the feet on the starting platform', () => {
  for (const progress of [0, 0.16]) {
    const pose = sampleDive(progress)
    const foot = worldPoint(pose, limbPoints([5, 0], pose.legs.slice(0, 2), [29, 29])[2])
    assert.ok(foot[0] >= 80 && foot[0] <= 130)
    assert.ok(Math.abs(foot[1] - 178) < 4)
  }
})

test('phase labels and clamped samples provide deterministic fallbacks', () => {
  assert.equal(divePhase(0), 'Preparation')
  assert.equal(divePhase(0.29), 'Launch')
  assert.equal(divePhase(0.46), 'Airborne extension')
  assert.equal(divePhase(0.70), 'Hands-first entry')
  assert.equal(divePhase(0.90), 'Underwater follow-through')
  assert.deepEqual(sampleDive(-1), sampleDive(0))
  assert.deepEqual(sampleDive(2), sampleDive(1))
})

test('waiting movement keeps both feet on the block', () => {
  for (let seconds = 0; seconds < 10; seconds += 0.05) {
    const pose = sampleStandby(seconds)
    for (const [start, angles] of [[[5, 0], pose.legs.slice(0, 2)], [[-5, 0], pose.legs.slice(2)]]) {
      const foot = worldPoint(pose, limbPoints(start, angles, [29, 29])[2])
      assert.ok(foot[0] > 80 && foot[0] < 130)
      assert.ok(Math.abs(foot[1] - 178) < 4)
    }
  }
})

test('dive, underwater glide, and ongoing swimming meet without a position or limb jump', () => {
  const dive = sampleDive(1)
  const glideStart = sampleGlide(0)
  const glideEnd = sampleGlide(1)
  const swim = sampleSwimming({ x: FIRST_CHECKPOINT, heading: 0 }, GLIDE_DURATION / 1000)
  for (const [before, after] of [[dive, glideStart], [glideEnd, swim]]) {
    assert.ok(distance([before.x, before.y], [after.x, after.y]) < 1e-8)
    assert.ok(Math.abs(before.rotation - after.rotation) < 1e-8)
    assert.ok(distance(nearHand(before), nearHand(after)) < 1e-8)
    assert.ok(before.arms.every((angle, i) => Math.abs(angle - after.arms[i]) < 1e-8))
    assert.ok(before.legs.every((angle, i) => Math.abs(angle - after.legs[i]) < 1e-8))
  }
})

test('both arms complete a coordinated continuous stroke with alternating leg kicks', () => {
  const poses = Array.from({ length: 121 }, (_, i) => sampleSwimming({ x: 620, heading: 0 }, i / 120 * STROKE_DURATION))
  const hands = poses.map(nearHand)
  assert.ok(Math.max(...hands.map((hand) => hand[1])) - Math.min(...hands.map((hand) => hand[1])) > 40)
  assert.ok(Math.max(...poses.map((pose) => pose.legs[0])) - Math.min(...poses.map((pose) => pose.legs[0])) > 20)
  for (const pose of poses) {
    assert.ok(Math.abs(pose.arms[0] - pose.arms[2] - 180) < 1e-8)
    assert.ok(Math.abs(pose.legs[0] + pose.legs[2] - 360) < 1e-8)
    for (const [start, angles, lengths] of [
      [[7, -42], pose.arms.slice(0, 2), [24, 25]], [[-5, -42], pose.arms.slice(2), [24, 25]],
      [[5, 0], pose.legs.slice(0, 2), [29, 29]], [[-5, 0], pose.legs.slice(2), [29, 29]],
    ]) {
      const points = limbPoints(start, angles, lengths)
      assert.ok(Math.abs(distance(points[0], points[1]) - lengths[0]) < 1e-8)
      assert.ok(Math.abs(distance(points[1], points[2]) - lengths[1]) < 1e-8)
    }
  }
  assert.ok(distance(hands[0], hands.at(-1)) < 1e-8)
  assert.ok(distance(nearHand(sampleSwimming({ x: 620, heading: 0 }, STROKE_DURATION - 1e-7)),
    nearHand(sampleSwimming({ x: 620, heading: 0 }, STROKE_DURATION + 1e-7))) < 0.001)
  assert.notDeepEqual(sampleStroke(20), sampleStroke(20.3))
})

test('every checkpoint pair is reached smoothly, with bounded travel and turns', () => {
  for (const [width, height] of [[1440, 264], [768, 264], [390, 238], [320, 238]]) {
    const layout = poolLayout(width, height)
    for (const from of layout.checkpoints) for (const to of layout.checkpoints) {
      let state = { x: from, velocity: 0, heading: 0, targetHeading: 0 }
      for (let i = 0; i < 600; i++) {
        const next = stepSwimmer(state, to, 1 / 60)
        assert.ok(Math.abs(next.x - state.x) <= MAX_SWIM_SPEED / 60 + 1e-8)
        assert.ok(Math.abs(next.heading - state.heading) <= 220 / 60 + 1e-8)
        state = next
      }
      assert.ok(Math.abs(state.x - to) < 0.01)
    }
  }
})

test('rapid retargeting retains position, velocity, and stroke phase', () => {
  let state = { x: 620, velocity: 0, heading: 0, targetHeading: 0 }
  let seconds = 0
  for (const destination of [1800, 620, 1000, 1500, 620]) {
    for (let i = 0; i < 15; i++) {
      const previous = state
      state = stepSwimmer(state, destination, 1 / 60)
      seconds += 1 / 60
      assert.ok(Math.abs(state.x - previous.x) < 9)
      assert.ok(Number.isFinite(nearHand(sampleSwimming(state, seconds))[0]))
    }
  }
  assert.equal(sampleStroke(seconds).arms[0], seconds / STROKE_DURATION * 360)
  assert.ok(seconds > 1)
})

test('the camera keeps the complete body in frame through mobile entry and edge checkpoints', () => {
  const bodyPoints = (pose) => {
    const head = worldPoint(pose, [1, -66])
    return [
      ...worldJoints(pose), [head[0] - 10, head[1]], [head[0] + 10, head[1]],
    ]
  }
  for (const width of [320, 390, 700]) {
    const layout = poolLayout(width, 238)
    for (let elapsed = 0; elapsed <= DIVE_DURATION + GLIDE_DURATION; elapsed += 10) {
      const pose = elapsed <= DIVE_DURATION ? sampleDive(elapsed / DIVE_DURATION)
        : sampleGlide((elapsed - DIVE_DURATION) / GLIDE_DURATION)
      const camera = entryCamera(pose, elapsed, layout)
      assert.ok(bodyPoints(pose).every(([x]) => x >= camera.origin && x <= camera.origin + camera.width), `Entry at ${elapsed}ms, width ${width}`)
    }
    for (const x of [layout.checkpoints[0], layout.checkpoints.at(-1)]) {
      for (const heading of [0, 45, 90, 135, 180]) for (let seconds = 0; seconds < STROKE_DURATION; seconds += 0.01) {
        const pose = sampleSwimming({ x, heading }, seconds)
        assert.ok(bodyPoints(pose).every(([worldX]) => worldX >= layout.origin && worldX <= layout.origin + layout.viewWidth))
      }
    }
  }
})

test('direction changes ease in, keep the head level, and retain connected 3D limbs', () => {
  let state = { x: 1400, velocity: 400, heading: 0, targetHeading: 0, angularVelocity: 0 }
  let previous = sampleSwimming(state, 10)
  let sawFront = false
  let sawLeft = false
  for (let i = 1; i <= 240; i++) {
    const next = stepSwimmer(state, 620, 1 / 60)
    const pose = sampleSwimming(next, 10 + i / 60)
    assert.ok(Math.abs(pose.rotation - 90) < 5)
    const head = worldPoint(pose, [1, -66])
    assert.ok(Math.abs(head[1] - WATERLINE) < 10, `Head stayed at the surface on frame ${i}`)
    assert.ok(Math.abs(pose.rotation - previous.rotation) < 1)
    assert.ok(distance(worldPoint(previous, [1, -66]), head) < 10)
    if (i === 1) {
      assert.ok(next.heading < 1)
      assert.ok(next.velocity > 0 && next.velocity < state.velocity)
    }
    if (next.velocity < -30) assert.ok(next.heading > 90)
    if (next.heading > 80 && next.heading < 100) sawFront = true
    if (next.heading > 175) sawLeft = true
    for (const [start, angles, lengths, far, leg] of [
      [[7, -42], pose.arms.slice(0, 2), [24, 25], false, false],
      [[-5, -42], pose.arms.slice(2), [24, 25], true, false],
      [[5, 0], pose.legs.slice(0, 2), [29, 29], false, true],
      [[-5, 0], pose.legs.slice(2), [29, 29], true, true],
    ]) {
      const points = swimLimbPoints(start, angles, lengths, pose.yaw, far, leg)
      const distance3D = (a, b) => Math.hypot(...a.map((value, axis) => value - b[axis]))
      assert.ok(Math.abs(distance3D(points[0], points[1]) - lengths[0]) < 1e-8)
      assert.ok(Math.abs(distance3D(points[1], points[2]) - lengths[1]) < 1e-8)
      assert.ok(points.flat().every(Number.isFinite))
    }
    state = next
    previous = pose
  }
  assert.ok(sawFront && sawLeft)
})

test('retargeting halfway through a turn preserves angular momentum and stroke continuity', () => {
  let state = { x: 1100, velocity: 320, heading: 0, targetHeading: 0, angularVelocity: 0 }
  let seconds = 23.7
  for (const [destination, frames] of [[620, 40], [1600, 8], [620, 9], [1600, 120], [620, 180]]) {
    for (let i = 0; i < frames; i++) {
      const previous = state
      const previousPose = sampleSwimming(previous, seconds)
      state = stepSwimmer(previous, destination, 1 / 60)
      seconds += 1 / 60
      const pose = sampleSwimming(state, seconds)
      assert.ok(Math.abs(state.heading - previous.heading) < 4)
      assert.ok(Math.abs(state.angularVelocity - previous.angularVelocity) < 45)
      assert.ok(Math.abs(state.velocity - previous.velocity) < 80)
      assert.ok(distance(worldPoint(previousPose, [1, -66]), worldPoint(pose, [1, -66])) < 12)
      const previousJoints = worldJoints(previousPose)
      worldJoints(pose).forEach((joint, index) => assert.ok(distance(previousJoints[index], joint) < 16))
      assert.equal(pose.arms[0], sampleStroke(seconds).arms[0])
      assert.ok(Math.abs(pose.rotation - 90) < 5)
    }
  }
})

test('the banner marker matches checkpoint centers and follows the entry camera smoothly', () => {
  // Known centered SVG fits cover both horizontal and vertical letterboxing.
  assert.deepEqual(projectPoolPoint({ x: 430, y: 160 }, { origin: 100, width: 660 }, 330, 240), { x: 165, y: 120 })
  assert.deepEqual(projectPoolPoint({ x: 330, y: 160 }, { origin: 100, width: 460 }, 920, 320), { x: 460, y: 160 })
  for (const [width, height] of [[3435, 264], [1440, 264], [1440, 208], [768, 264], [701, 264], [700, 238], [390, 238], [320, 238]]) {
    const layout = poolLayout(width, height)
    const navigationWidth = Math.min(width - (width <= 700 ? 24 : 48), 1200)
    for (let i = 0; i < layout.checkpoints.length; i++) {
      const pose = sampleSwimming({ x: layout.checkpoints[i], heading: 0 }, 0)
      const marker = projectPoolPoint(pose, entryCamera(pose, DIVE_DURATION + GLIDE_DURATION, layout), width, height)
      const buttonCenter = (width - navigationWidth) / 2 + navigationWidth * (i + 0.5) / 4
      assert.ok(Math.abs(marker.x - buttonCenter) < 1e-8)
    }
    let previous
    for (let elapsed = 0; elapsed <= DIVE_DURATION + GLIDE_DURATION; elapsed += 10) {
      const pose = elapsed <= DIVE_DURATION ? sampleDive(elapsed / DIVE_DURATION)
        : sampleGlide((elapsed - DIVE_DURATION) / GLIDE_DURATION)
      const marker = projectPoolPoint(pose, entryCamera(pose, elapsed, layout), width, height)
      assert.ok(marker.x >= 0 && marker.x <= width)
      assert.ok(marker.y >= 0 && marker.y <= height)
      if (previous) assert.ok(Math.abs(marker.x - previous.x) < width * 0.01)
      previous = marker
    }
  }
})
