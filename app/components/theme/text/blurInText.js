"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BlurIn = ({ word, className, variant, duration = 1, children }) => {
  const defaultVariants = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration }}
      variants={combinedVariants}
      className={cn(
        className,
        "font-display tracking-[-0.02em] drop-shadow-sm",
      )}
    >
      {children}
    </motion.div>
  );
};

export default BlurIn;
