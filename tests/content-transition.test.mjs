import test from 'node:test'
import assert from 'node:assert/strict'
import { createContentTransition } from '../src/contentTransition.js'

function transitionHarness(initialKey = 'intro') {
  const animations = []
  const commits = []
  let settles = 0
  const controller = createContentTransition(initialKey, {
    animate: (opacity, duration) => new Promise((resolve) => {
      animations.push({ opacity, duration, resolve })
    }),
    commit: (key) => commits.push(key),
    // Leave canceled promises unresolved until a test explicitly completes them.
    settle: () => { settles += 1 },
  })
  return {
    controller, animations, commits,
    get settles() { return settles },
    finish: async (index) => {
      assert.ok(animations[index], `Animation ${index} exists`)
      animations[index].resolve()
      await Promise.resolve()
    },
  }
}

test('rapid requests during the dim commit only the latest section', async () => {
  const { controller, animations, commits, finish } = transitionHarness()
  controller.request('experience')
  controller.request('projects')
  controller.request('contact')
  assert.equal(animations.length, 1)
  assert.deepEqual(controller.getState(), { displayed: 'intro', requested: 'contact', phase: 'dim' })
  assert.deepEqual(commits, [])

  await finish(0)
  assert.deepEqual(commits, ['contact'])
  assert.deepEqual(controller.getState(), { displayed: 'contact', requested: 'contact', phase: 'reveal' })
  await finish(1)
  assert.equal(controller.getState().phase, 'idle')
})

test('returning to the displayed section cancels the pending replacement', async () => {
  const { controller, animations, commits, finish } = transitionHarness()
  controller.request('experience')
  controller.request('intro')
  assert.equal(animations.length, 2)
  assert.equal(animations[1].opacity, 1)

  await finish(0)
  assert.deepEqual(commits, [])
  assert.deepEqual(controller.getState(), { displayed: 'intro', requested: 'intro', phase: 'reveal' })
  await finish(1)
  assert.equal(controller.getState().phase, 'idle')
})

test('retargeting during the reveal ignores stale completions and skips intermediate requests', async () => {
  const { controller, animations, commits, finish } = transitionHarness()
  controller.request('experience')
  await finish(0)
  assert.deepEqual(commits, ['experience'])

  controller.request('projects')
  controller.request('contact')
  assert.equal(animations.length, 3)
  await finish(1)
  assert.deepEqual(controller.getState(), { displayed: 'experience', requested: 'contact', phase: 'dim' })
  await finish(2)
  assert.deepEqual(commits, ['experience', 'contact'])
  assert.equal(controller.getState().phase, 'reveal')
  await finish(3)
  assert.deepEqual(controller.getState(), { displayed: 'contact', requested: 'contact', phase: 'idle' })
})

test('reselecting the current destination does not restart animations or recommit content', async () => {
  const harness = transitionHarness()
  const { controller, animations, commits, finish } = harness
  controller.request('intro')
  assert.equal(animations.length, 0)

  controller.request('projects')
  controller.request('projects')
  assert.equal(animations.length, 1)
  await finish(0)
  controller.request('projects')
  assert.equal(animations.length, 2)
  await finish(1)
  controller.request('projects')
  assert.equal(animations.length, 2)
  assert.deepEqual(commits, ['projects'])
  assert.equal(harness.settles, 0)
})

test('reduced motion commits immediately during either phase and invalidates pending callbacks', async () => {
  for (const initialPhase of ['dim', 'reveal']) {
    const harness = transitionHarness()
    const { controller, animations, commits, finish } = harness
    controller.request('experience')
    if (initialPhase === 'reveal') await finish(0)
    const pendingIndex = animations.length - 1
    const previousCommits = [...commits]

    controller.request('contact', true)
    assert.equal(harness.settles, 1)
    assert.deepEqual(commits, [...previousCommits, 'contact'])
    assert.deepEqual(controller.getState(), { displayed: 'contact', requested: 'contact', phase: 'idle' })
    const count = animations.length
    await finish(pendingIndex)
    assert.equal(animations.length, count)
    assert.deepEqual(commits, [...previousCommits, 'contact'])
    assert.deepEqual(controller.getState(), { displayed: 'contact', requested: 'contact', phase: 'idle' })
  }
})

test('disposing during either phase prevents pending or future requests from committing', async () => {
  for (const initialPhase of ['dim', 'reveal']) {
    const harness = transitionHarness()
    const { controller, animations, commits, finish } = harness
    controller.request('projects')
    if (initialPhase === 'reveal') await finish(0)
    const pendingIndex = animations.length - 1
    const previousCommits = [...commits]
    const count = animations.length

    controller.dispose()
    assert.equal(harness.settles, 1)
    controller.request('contact')
    controller.request('experience', true)
    await finish(pendingIndex)
    assert.deepEqual(commits, previousCommits)
    assert.equal(animations.length, count)
    assert.equal(harness.settles, 1)
  }
})

test('animated replacements retain readable opacity and use short bounded fades', async () => {
  const { controller, animations, finish } = transitionHarness()
  controller.request('experience')
  await finish(0)
  controller.request('projects')
  controller.request('contact')
  await finish(2)
  await finish(3)

  assert.ok(animations.some(({ opacity }) => opacity < 1), 'Outgoing content dims before replacement')
  assert.ok(animations.some(({ opacity }) => opacity === 1), 'Incoming content returns to full opacity')
  for (const { opacity, duration } of animations) {
    assert.ok(opacity >= 0.3 && opacity <= 1, 'No fade targets a blank or nearly blank panel')
    assert.ok(duration > 0 && duration <= 0.25, 'Each phase remains brief and responsive')
  }
})
