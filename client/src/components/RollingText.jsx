import { motion } from "framer-motion";

const DURATION = 0.25;
const STAGGER = 0.025;

export default function RollingText({ children }) {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className="relative inline-block overflow-hidden whitespace-nowrap"
      style={{ lineHeight: 1.2 }}
    >
      <div>
        {children.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </motion.span>
  );
}
