import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import logo1 from '../assets/1-removebg-preview.png'
import logo5 from '../assets/5-removebg-preview.png'

const Loader = ({ onComplete }) => {
  const [startTyping, setStartTyping] = useState(false)
  const [hideCursor, setHideCursor] = useState(false)

  useEffect(() => {
    // Stage 1: Initial Delay
    const startTimer = setTimeout(() => {
      setStartTyping(true)

      // Stage 2: Hide cursor after typing is finished
      // Duration (2.2s) + Delay (0.2s) + Buffer (0.1s) = 2.5s total after startTyping
      const cursorTimer = setTimeout(() => {
        setHideCursor(true)
        // Trigger completion after cursor is hidden
        if (onComplete) onComplete()
      }, 2500)

      return () => clearTimeout(cursorTimer)
    }, 600)

    return () => clearTimeout(startTimer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden w-full selection:bg-[#c5a176]/30">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
          layout: { duration: 1.2, ease: [0.4, 0, 0.2, 1] }
        }}
        className="flex items-center"
      >
        {/* Logo (Image 1) */}
        <motion.div
          layout
          className="flex-shrink-0 z-20"
        >
          <motion.img
            src={logo1}
            alt="Logo"
            animate={{
              width: startTyping ? (window.innerWidth < 768 ? 96 : 160) : (window.innerWidth < 768 ? 192 : 240),
              height: startTyping ? (window.innerWidth < 768 ? 96 : 160) : (window.innerWidth < 768 ? 192 : 240),
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 1
            }}
            className="object-contain"
          />
        </motion.div>

        {/* Typing Container for Text (Image 5) */}
        <motion.div
          layout
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: startTyping ? (window.innerWidth < 768 ? 180 : 250) : 0,
            opacity: startTyping ? 1 : 0
          }}
          transition={{
            duration: 2.2,
            ease: [0.4, 0, 0.2, 1],
            delay: 0.2,
            layout: { duration: 1.2, ease: [0.4, 0, 0.2, 1] }
          }}
          className="relative overflow-hidden z-10 flex items-center ml-1"
        >
          <img
            src={logo5}
            alt="Earthy Crafts"
            className="object-contain object-left pointer-events-none"
            style={{
              height: startTyping ? (window.innerWidth < 768 ? '120px' : '200px') : (window.innerWidth < 768 ? '192px' : '240px'),
              minWidth: '500px',
              transition: 'height 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />

          {/* Professional Blinking Cursor - Direct Opacity Animation for Reliability */}
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
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-14 md:h-20 bg-[#c5a176] shadow-[0_0_12px_rgba(197,161,118,0.6)]"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Loader
