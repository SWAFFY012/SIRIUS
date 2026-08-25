import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

const TRANSFORMS = [
  { x: -0.8, y: -0.6, rotationZ: -29 },
  { x: -0.2, y: -0.4, rotationZ: -6 },
  { x: -0.05, y: 0.1, rotationZ: 12 },
  { x: -0.05, y: -0.1, rotationZ: -9 },
  { x: -0.1, y: 0.55, rotationZ: 3 },
  { x: 0, y: -0.1, rotationZ: 9 },
  { x: 0, y: 0.15, rotationZ: -12 },
  { x: 0, y: 0.15, rotationZ: -17 },
  { x: 0, y: -0.65, rotationZ: 9 },
  { x: 0.1, y: 0.4, rotationZ: 12 },
  { x: 0, y: -0.15, rotationZ: -9 },
  { x: 0.2, y: 0.15, rotationZ: 12 },
  { x: 0.8, y: 0.6, rotationZ: 20 },
]

const TRANSITION = { duration: 0.75, ease: [0.33, 1, 0.68, 1] }

export default function TextDisperse({ children, className = "", ...props }) {
  const [isAnimated, setIsAnimated] = useState(false)
  const reducedMotion = useReducedMotion()

  const handlePointerEnter = (event) => {
    if (event.pointerType === "mouse" && !reducedMotion) setIsAnimated(true)
  }

  const handlePointerLeave = (event) => {
    if (event.pointerType === "mouse") setIsAnimated(false)
  }

  return (
    <span
      className={`text-disperse ${className}`.trim()}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {Array.from(children).map((char, index) => {
        const transform = TRANSFORMS[index % TRANSFORMS.length]

        return (
          <motion.span
            className="text-disperse__char"
            key={`${char}-${index}`}
            animate={
              isAnimated
                ? {
                    x: `${transform.x}em`,
                    y: `${transform.y}em`,
                    rotateZ: transform.rotationZ,
                    zIndex: 1,
                  }
                : { x: 0, y: 0, rotateZ: 0, zIndex: 0 }
            }
            transition={TRANSITION}
          >
            {char}
          </motion.span>
        )
      })}
    </span>
  )
}
