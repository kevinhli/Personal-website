import test from 'node:test'
import assert from 'node:assert/strict'
import { createBubbleField, stepBubbleField, DESKTOP_BUBBLE_LIMIT, MOBILE_BUBBLE_LIMIT } from '../src/poolBubbles.js'
import { WATERLINE, sampleDive, sampleSwimming, stepSwimmer } from '../src/poolMotion.js'

const submerged = (x = 620, heading = 0, seconds = 0, velocity = 0) => ({
  pose: sampleSwimming({ x, heading }, seconds), phase: 'swim', velocity,
})

test('bubbles remain underwater, vary independently, and stay within the particle budget', () => {
  for (const compact of [false, true]) {
    let field = createBubbleField()
    const births = []
    const radii = new Set()
    const rises = new Set()
    for (let i = 0; i < 2400; i++) {
      const previousId = field.nextId
      field = stepBubbleField(field, submerged(620 + i * 3, 0, i / 60, 400), 1 / 60, compact)
      assert.ok(field.particles.length <= (compact ? MOBILE_BUBBLE_LIMIT : DESKTOP_BUBBLE_LIMIT))
      if (field.nextId > previousId) {
        births.push(i)
        const born = field.particles.at(-1)
        radii.add(born.radius.toFixed(2))
        rises.add(born.rise.toFixed(2))
        assert.equal(born.opacity, 0)
      }
      for (const bubble of field.particles) {
        assert.ok(bubble.y - bubble.radius > WATERLINE)
        assert.ok(bubble.opacity >= 0 && bubble.opacity <= 0.52)
        assert.ok([bubble.x, bubble.y, bubble.radius, bubble.opacity].every(Number.isFinite))
      }
    }
    assert.ok(radii.size > 20 && rises.size > 20)
    assert.ok(new Set(births.slice(1).map((time, i) => time - births[i])).size > 5)
  }
})

test('the field waits for water entry and freezes when the animation clock is suspended', () => {
  let field = createBubbleField()
  for (let i = 0; i < 60; i++) {
    field = stepBubbleField(field, { pose: sampleDive(0.6), phase: 'dive' }, 1 / 60)
  }
  assert.equal(field.particles.length, 0)
  field = stepBubbleField(field, { pose: sampleDive(0.9), phase: 'dive' }, 1 / 60)
  assert.ok(field.particles.length > 0)
  const paused = stepBubbleField(field, submerged(1700, 180), 0)
  assert.equal(paused, field)
})

test('a turn leaves existing bubbles drifting upward without moving them to the new swimmer position', () => {
  let field = createBubbleField()
  for (let i = 0; i < 60; i++) field = stepBubbleField(field, submerged(1200, 0, i / 60, 300), 1 / 60)
  const previous = new Map(field.particles.map((bubble) => [bubble.id, bubble]))
  field = stepBubbleField(field, submerged(620, 180, 1.02, -300), 1 / 60)
  const existing = field.particles.filter((bubble) => previous.has(bubble.id))
  assert.ok(existing.length > 0)
  for (const bubble of existing) {
    const before = previous.get(bubble.id)
    assert.ok(bubble.y < before.y)
    assert.ok(Math.abs(bubble.x - before.x) < 2)
    assert.ok(Math.abs(bubble.radius - before.radius) < 0.02)
    assert.ok(Math.abs(bubble.opacity - before.opacity) < 0.09)
  }
})

test('rapid navigation preserves the bubble field while new trail emissions follow the turn', () => {
  let state = { x: 1200, velocity: 320, heading: 0, targetHeading: 0, angularVelocity: 0 }
  let field = createBubbleField()
  let seconds = 0
  let sawLeftTrail = false
  let sawRightTrail = false
  for (const [destination, frames] of [[1700, 90], [620, 45], [1700, 15], [620, 240], [1700, 240]]) {
    for (let i = 0; i < frames; i++) {
      state = stepSwimmer(state, destination, 1 / 60)
      seconds += 1 / 60
      const previous = new Map(field.particles.map((bubble) => [bubble.id, bubble]))
      field = stepBubbleField(field, { pose: sampleSwimming(state, seconds), phase: 'swim',
        velocity: state.velocity, angularVelocity: state.angularVelocity }, 1 / 60)
      for (const bubble of field.particles) {
        if (previous.has(bubble.id)) {
          assert.ok(Math.abs(bubble.x - previous.get(bubble.id).x) < 2)
        } else if (bubble.trail) {
          if (state.heading < 5) { assert.ok(bubble.x < state.x); sawRightTrail = true }
          if (state.heading > 175) { assert.ok(bubble.x > state.x); sawLeftTrail = true }
        }
      }
    }
  }
  assert.ok(sawLeftTrail && sawRightTrail)
})
