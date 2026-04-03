import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  duration?: number
  formatter?: (n: number) => string
}

/**
 * Renders a number that counts up/down with a smooth spring animation.
 * A "thoughtful micro-interaction" that makes metrics feel alive.
 */
export const AnimatedNumber = ({
  value,
  duration = 800,
  formatter = (n) => n.toLocaleString(),
}: AnimatedNumberProps) => {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    const from = prevRef.current
    const to = value
    prevRef.current = to

    if (from === to) return

    let frame: number
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (to - from) * eased)
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return <>{formatter(display)}</>
}
