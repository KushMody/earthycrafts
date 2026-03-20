import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import logo1 from '../assets/1-removebg-preview.png'
import logo5 from '../assets/5-removebg-preview.png'

const Loader = ({ onComplete }) => {
  const [startTyping, setStartTyping] = useState(false)
  const [hideCursor, setHideCursor] = useState(false)

  useEffect(() => {
    // Stage 1: Initial Delay reduced for seamless flow
    const startTimer = setTimeout(() => {
      setStartTyping(true)

      // Stage 2: Hide cursor after typing is finished
      const cursorTimer = setTimeout(() => {
        setHideCursor(true)
        if (onComplete) onComplete()
      }, 2500)

      return () => clearTimeout(cursorTimer)
    }, 100) // Reduced to 100ms for no pause transition

    return () => clearTimeout(startTimer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden w-full selection:bg-[#c5a176]/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          gap: startTyping ? (window.innerWidth < 768 ? 4 : 8) : 0
        }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          gap: { duration: 1.2, ease: "linear" }
        }}
        className="flex items-center justify-center p-4"
      >
        {/* Logo (Image 1) */}
        <motion.div
          layout
          className="flex-shrink-0 z-20 flex items-center justify-center"
        >
          <motion.img
            src={logo1}
            alt="Logo"
            animate={{
              width: startTyping ? (window.innerWidth < 768 ? 90 : 160) : (window.innerWidth < 768 ? 180 : 240),
              height: startTyping ? (window.innerWidth < 768 ? 90 : 160) : (window.innerWidth < 768 ? 180 : 240),
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
            duration: 2.0,
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
