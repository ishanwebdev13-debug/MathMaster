import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export default function Logo({ className = "", size = 32, animated = false }: LogoProps) {
  const Comp = animated ? motion.svg : "svg";
  const animProps = animated
    ? {
        initial: { rotate: -10, scale: 0.8, opacity: 0 },
        animate: { rotate: 0, scale: 1, opacity: 1 },
        transition: { duration: 0.5, ease: "easeOut" },
      }
    : {};

  return (
    <Comp
      {...animProps}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Unlimited logo"
    >
      {/* Background circle */}
      <circle cx="32" cy="32" r="30" fill="url(#logo-grad)" />
      
      {/* Infinity symbol (∞) */}
      <motion.text
        x="32"
        y="34"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="46"
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
        initial={animated ? { scale: 0, opacity: 0 } : undefined}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        transition={animated ? { duration: 0.5, delay: 0.2, ease: "backOut" } : undefined}
      >
        ∞
      </motion.text>

      <defs>
        <linearGradient id="logo-grad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A7CF7" />
          <stop offset="1" stopColor="#7B5CF7" />
        </linearGradient>
      </defs>
    </Comp>
  );
}
