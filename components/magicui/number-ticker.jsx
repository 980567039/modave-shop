import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  currency = null,
  // Add speed configuration props
  stiffness = 200,  // Increased from 100
  damping = 20,     // Decreased from 160
  duration = 1.5,    // New prop to control animation duration
  removePriceFormat = false
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
    // Add duration constraint
    duration: duration * 1000,
    // Add bounce for more dynamic animation
    bounce: 0.25
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        // Add velocity for faster initial movement
        motionValue.set(direction === "down" ? 0 : value, {
          velocity: direction === "down" ? -2000 : 2000
        });
      }, delay * 1000);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    const formatOptions = {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    };

    if (currency) {
      formatOptions.style = 'currency';
      formatOptions.currency = currency;
    }

    const formatter = new Intl.NumberFormat("en-US", formatOptions);

    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = !removePriceFormat ? formatter.format(Number(latest.toFixed(decimalPlaces))) : latest.toFixed();
      }
    });

    return () => unsubscribe();
  }, [springValue, decimalPlaces, currency]);

  return (
    <span
      className={cn(
        "inline-block tabular-nums text-black dark:text-white tracking-wider",
        className
      )}
      ref={ref}
    />
  );
}