'use client';

import React, { useEffect, useRef } from 'react';

// SoundController component that manages audio playback
const SoundController = ({
    play = false,
    soundUrl,
    volume = 1,
    onEnd,
    onError,
    loop = false
}) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current || !soundUrl) return;

        // Set audio properties
        audioRef.current.volume = Math.min(Math.max(volume, 0), 1);
        audioRef.current.loop = loop;

        if (play) {
            // Play sound
            audioRef.current.currentTime = 0;
            const playPromise = audioRef.current.play();

            if (playPromise) {
                playPromise.catch((error) => {
                    console.error('Error playing sound:', error);
                    if (onError) onError(error);
                });
            }
        } else {
            // Stop sound
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [play, soundUrl, volume, loop]);

    const handleEnded = () => {
        if (onEnd) onEnd();
    };

    return (
        <audio
            ref={audioRef}
            src={soundUrl}
            onEnded={handleEnded}
            preload="auto"
        />
    );
};

export default SoundController;