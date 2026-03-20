import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import logo1 from '../assets/1-removebg-preview.png'
import logo5 from '../assets/5-removebg-preview.png'

const Loader = ({ onComplete }) => {
  const [logoScaled, setLogoScaled] = useState(false)
  const [startTyping, setStartTyping] = useState(false)
  const [hideCursor, setHideCursor] = useState(false)

  useEffect(() => {
    // Stage 1: No delay, start logo scaling as it fades in
    setLogoScaled(true)

    // Stage 2: Wait for logo scaling (0.4s) to finish, then start text
    const textTimer = setTimeout(() => {
      setStartTyping(true)

      // Stage 3: Wait for text typing (2.0s duration) + buffer before completion
      const completionTimer = setTimeout(() => {
        setHideCursor(true)
        if (onComplete) onComplete()
      }, 2200)

      return () => clearTimeout(completionTimer)
    }, 400) // Matches logo scaling duration

    return () => clearTimeout(textTimer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden w-full selection:bg-[#c5a176]/30">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          gap: startTyping ? (window.innerWidth < 768 ? 4 : 8) : 0
        }}
        transition={{
          opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          gap: { duration: 1.2, ease: "linear" }
        }}
        className="flex items-center justify-center p-4"
      >
        {/* Logo (Image 1) */}
        <motion.div
          layout
          transition={{ layout: { duration: 0.6, ease: "linear" } }}
          className="flex-shrink-0 z-20 flex items-center justify-center"
        >
          <motion.img
            src={logo1}
            alt="Logo"
            animate={{
              width: logoScaled ? (window.innerWidth < 768 ? 90 : 160) : (window.innerWidth < 768 ? 180 : 240),
              height: logoScaled ? (window.innerWidth < 768 ? 90 : 160) : (window.innerWidth < 768 ? 180 : 240),
            }}
            transition={{
              duration: 0.5,
              ease: "linear"
            }}
            className="object-contain"
          />
        </motion.div>

        {/* Typing Container for Text (Image 5) */}
        <motion.div
          layout
          initial={{ width: 0, opacity: 0, scale: 1 }}
          animate={{
            width: startTyping ? (window.innerWidth < 768 ? 160 : 250) : 0,
            opacity: startTyping ? 1 : 0
          }}
          style={{ originX: 0 }}
          transition={{
            duration: 1.2,
            ease: "linear",
            delay: 0.1,
            layout: { duration: 1.2, ease: "linear" }
          }}
          className="relative overflow-hidden z-10 flex items-center"
        >
          <img
            src={logo5}
            alt="Earthy Crafts"
            className="object-contain object-left pointer-events-none"
            style={{
              height: window.innerWidth < 768 ? '100px' : '200px',
              minWidth: '400px'
            }}
          />

          {/* Professional Blinking Cursor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: hideCursor ? 0 : (startTyping ? [1, 0, 1] : 0)
            }}
            transition={{
              opacity: hideCursor
                ? { duration: 0.3 }
                : { repeat: Infinity, duration: 0.8, ease: "steps(2, start)" }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-10 md:h-20 bg-[#c5a176] shadow-[0_0_12px_rgba(197,161,118,0.6)]"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Loader
