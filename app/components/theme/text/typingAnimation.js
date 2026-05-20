"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TypingAnimation({
    text,
    duration = 200,
    className,
}) {
    const [displayedText, setDisplayedText] = useState("");
    const [i, setI] = useState(0);

    const defaultVariants = {
        hidden: {  opacity: 0 },
        visible: { opacity: 1 },
    };

    useEffect(() => {
        const typingEffect = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prevState) => prevState + text.charAt(i));
                setI(i + 1);
            } else {
                clearInterval(typingEffect);
            }
        }, duration);

        return () => {
            clearInterval(typingEffect);
        };
    }, [duration, i, text]);

    return (
        <motion.h1
            initial="hidden"
            animate="visible"
            transition={1}
            variants={defaultVariants}
            className={cn(
                "font-display tracking-[-0.02em] drop-shadow-sm",
                className,
            )}
        >
            {displayedText ? displayedText : text}
        </motion.h1>
    );
}
