'use client'
import React, { useState, useEffect, useRef } from 'react';

const Conveyor = ({ words, speed = 50, fontSize = 36, font = 'Arial' }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [wordLengths, setWordLengths] = useState([]);
    const offsetRef = useRef(0);
    const [canvasWidth, setCanvasWidth] = useState(0);

    // text-gray-300 color in hex (Tailwind's gray-300)
    const textColor = '#d1d5db';

    // Handle resize to update canvas width
    useEffect(() => {
        const updateCanvasWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth;
                setCanvasWidth(width);

                // Update canvas element width and handle pixel density
                if (canvasRef.current) {
                    const canvas = canvasRef.current;
                    const context = canvas.getContext('2d');

                    // Get device pixel ratio
                    const dpr = window.devicePixelRatio || 1;

                    // Set canvas dimensions accounting for pixel ratio
                    canvas.width = width * dpr;
                    canvas.height = (fontSize * 2) * dpr;

                    // Scale the context based on the device pixel ratio
                    context.scale(dpr, dpr);

                    // Set the CSS dimensions
                    canvas.style.width = `${width}px`;
                    canvas.style.height = `${fontSize * 2}px`;
                }
            }
        };

        // Initial width calculation
        updateCanvasWidth();

        // Listen for window resize events
        window.addEventListener('resize', updateCanvasWidth);

        // Cleanup
        return () => {
            window.removeEventListener('resize', updateCanvasWidth);
        };
    }, [fontSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        // Set semibold font with increased size
        context.font = `600 ${fontSize}px ${font}`;

        // Enable text rendering optimization
        context.textRendering = 'optimizeLegibility';

        // Enable font smoothing if available
        if (typeof context.imageSmoothingEnabled !== 'undefined') {
            context.imageSmoothingEnabled = true;
        }

        // Process the words array to handle nested arrays or other formats
        const processedWords = Array.isArray(words[0]) ? words[0] : words;

        // Calculate word lengths and total width
        const lengths = processedWords.map(word =>
            context.measureText(String(word)).width
        );
        setWordLengths(lengths);
    }, [words, fontSize, font, canvasWidth]);

    useEffect(() => {
        if (!canvasRef.current || wordLengths.length === 0 || canvasWidth === 0) return;

        let animationFrameId;

        // Process the words array correctly
        const processedWords = Array.isArray(words[0]) ? words[0] : words;

        // Calculate total width of all words with spacing
        const spacing = 30; // Increased spacing
        let totalContentWidth = 0;
        for (let i = 0; i < wordLengths.length; i++) {
            totalContentWidth += wordLengths[i];
            if (i < wordLengths.length - 1) {
                totalContentWidth += spacing;
            }
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Calculate the fade width (20% of canvas width on each side)
        const fadeWidth = canvasWidth * 0.2;

        // Function to calculate opacity based on x position
        const getOpacityAtPosition = (x) => {
            if (x < fadeWidth) {
                // Left fade (0% to 100%)
                return x / fadeWidth;
            } else if (x > canvasWidth - fadeWidth) {
                // Right fade (100% to 0%)
                return (canvasWidth - x) / fadeWidth;
            }
            // Middle section (100%)
            return 1;
        };

        const drawWords = () => {
            // Clear with background color
            context.fillStyle = "#020617"; // slate-950 hex color
            context.fillRect(0, 0, canvasWidth, fontSize * 2);

            // Setup text properties
            context.font = `600 ${fontSize}px ${font}`;
            context.textBaseline = 'middle';
            context.shadowColor = 'rgba(0, 0, 0, 0.3)';
            context.shadowBlur = 2;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 1;

            // How many full sets of words we need to fill the screen and create a seamless loop
            const requiredSets = Math.ceil(canvasWidth / totalContentWidth) + 1;

            // Update offset for smooth movement
            offsetRef.current = (offsetRef.current + speed/60) % totalContentWidth;

            // Draw multiple sets of the words
            for (let set = 0; set < requiredSets; set++) {
                let currentX = set * totalContentWidth - offsetRef.current;

                for (let i = 0; i < processedWords.length; i++) {
                    const word = String(processedWords[i]);
                    const wordWidth = wordLengths[i];

                    // For each word, we need to check if it spans the fade regions
                    // If it does, we'll need to draw it character by character
                    if (
                        (currentX < fadeWidth && currentX + wordWidth > fadeWidth) ||
                        (currentX < canvasWidth - fadeWidth && currentX + wordWidth > canvasWidth - fadeWidth)
                    ) {
                        // Word spans a fade region, draw character by character
                        for (let charIndex = 0; charIndex < word.length; charIndex++) {
                            const char = word[charIndex];
                            const charWidth = context.measureText(char).width;
                            const opacity = getOpacityAtPosition(currentX + charWidth/2);

                            if (opacity > 0) {
                                // Only draw if visible
                                const rgbaColor = `rgba(209, 213, 219, ${opacity})`;
                                context.fillStyle = rgbaColor;
                                context.fillText(char, Math.round(currentX), Math.round(fontSize + 5));
                            }

                            currentX += charWidth;
                        }
                    } else {
                        // Word is entirely in a single region
                        const opacity = getOpacityAtPosition(currentX + wordWidth/2);

                        if (opacity > 0) {
                            // Only draw if visible
                            const rgbaColor = `rgba(209, 213, 219, ${opacity})`;
                            context.fillStyle = rgbaColor;
                            context.fillText(word, Math.round(currentX), Math.round(fontSize + 5));
                        }

                        currentX += wordWidth;
                    }

                    currentX += spacing;
                }
            }

            animationFrameId = requestAnimationFrame(drawWords);
        };

        drawWords();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [words, speed, fontSize, font, wordLengths, canvasWidth]); // Removed textColor from dependency array

    return (
        <div
            ref={containerRef}
            className="bg-slate-950 w-full"
            style={{
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    width: '100%'
                }}
            />
        </div>
    );
};

export default Conveyor;