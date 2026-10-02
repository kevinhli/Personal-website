import { useEffect, useRef, useState } from 'react'
import { animate, useMotionValue } from 'framer-motion'
import { createContentTransition } from './contentTransition'

export default function useContentTransition(target, reducedMotion, beforeCommit) {
  const [initialKey] = useState(target)
  const [displayedKey, setDisplayedKey] = useState(target)
  const opacity = useMotionValue(1)
  const controllerRef = useRef(null)
  const beforeCommitRef = useRef(beforeCommit)

  useEffect(() => { beforeCommitRef.current = beforeCommit }, [beforeCommit])
  useEffect(() => {
    const controller = createContentTransition(initialKey, {
      animate: (value, duration) => animate(opacity, value, { duration, ease: [0.22, 1, 0.36, 1] }),
      commit: (key) => {
        beforeCommitRef.current?.()
        setDisplayedKey(key)
      },
      settle: () => {
        opacity.stop()
        opacity.set(1)
      },
    })
    controllerRef.current = controller
    return () => controller.dispose()
  }, [initialKey, opacity])

  useEffect(() => {
    controllerRef.current.request(target, reducedMotion)
  }, [target, reducedMotion])

  return { displayedKey, opacity }
}
