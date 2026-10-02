export const CONTENT_DIM_OPACITY = 0.35
export const CONTENT_DIM_SECONDS = 0.12
export const CONTENT_REVEAL_SECONDS = 0.2

// Keep one readable panel mounted. Requests during the dim reuse its midpoint;
// requests during the reveal continue from the current opacity.
export function createContentTransition(initialKey, { animate, commit, settle }) {
  let displayed = initialKey
  let requested = initialKey
  let phase = 'idle'
  let revision = 0
  let disposed = false

  function reveal(version) {
    phase = 'reveal'
    Promise.resolve(animate(1, CONTENT_REVEAL_SECONDS)).then(() => {
      if (!disposed && version === revision) phase = 'idle'
    })
  }

  function request(key, immediate = false) {
    if (disposed) return
    requested = key
    if (immediate) {
      revision += 1
      phase = 'idle'
      settle()
      if (displayed !== requested) {
        displayed = requested
        commit(displayed)
      }
      return
    }
    if (phase === 'dim') {
      if (requested === displayed) reveal(++revision)
      return
    }
    if (requested === displayed) return

    phase = 'dim'
    const version = ++revision
    Promise.resolve(animate(CONTENT_DIM_OPACITY, CONTENT_DIM_SECONDS)).then(() => {
      if (disposed || version !== revision) return
      displayed = requested
      commit(displayed)
      reveal(version)
    })
  }

  return {
    request,
    getState: () => ({ displayed, requested, phase }),
    dispose: () => {
      disposed = true
      revision += 1
      settle()
    },
  }
}
