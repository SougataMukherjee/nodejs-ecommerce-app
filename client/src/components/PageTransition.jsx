import { motion } from "framer-motion";

const DURATION = 0.6;
const EASE = [0.76, 0, 0.24, 1];
const COLOR = "#ff6600";

export default function PageTransition({ children }) {
  return (
    <>
      {children}
      {/* Wipe: single panel slides left-to-right to cover the page on exit */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{ duration: DURATION, ease: EASE }}
        style={{
          position: "fixed",
          inset: 0,
          background: COLOR,
          transformOrigin: "left",
          zIndex: 9999,
        }}
      />
      {/* Reveal: single panel retracts left-to-right to show the new page */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 0 }}
        transition={{ duration: DURATION, ease: EASE }}
        style={{
          position: "fixed",
          inset: 0,
          background: COLOR,
          transformOrigin: "right",
          zIndex: 9999,
        }}
      />
    </>
  );
}