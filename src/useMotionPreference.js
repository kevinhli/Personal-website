import { useReducedMotion } from 'framer-motion'

export default function useMotionPreference() {
  const systemPreference = useReducedMotion()
  // Allows local visual QA of the same fallback without changing OS settings.
  const previewPreference = import.meta.env.DEV && new URLSearchParams(window.location.search).get('motion') === 'reduce'
  return Boolean(systemPreference || previewPreference)
}
