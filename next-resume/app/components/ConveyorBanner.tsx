'use client';
import React, { useState, useEffect, useRef } from 'react';

interface ConveyorProps {
    words: string[][]; // Use string[][] to represent the array of words
    speed?: number;
    fontSize?: number;
    font?: string;
}

const Conveyor: React.FC<ConveyorProps> = ({
                                               words,
                                               speed = 50,
                                               fontSize = 36,
                                               font = 'Arial',
                                           }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [wordLengths, setWordLengths] = useState<number[]>([]);
    const offsetRef = useRef(0);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: HTMLImageElement }>({});
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [dpr, setDpr] = useState(1);

    // Update DPR on mount and resize
    useEffect(() => {
        const updateDpr = () => {
            setDpr(window.devicePixelRatio || 1);
        };

        updateDpr();
        window.addEventListener('resize', updateDpr);

        return () => {
            window.removeEventListener('resize', updateDpr);
        };
    }, []);

    // Handle resize to update canvas width
    useEffect(() => {
        const updateCanvasWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth;
                setCanvasWidth(width);
            }
        };

        updateCanvasWidth();
        window.addEventListener('resize', updateCanvasWidth);

        return () => {
            window.removeEventListener('resize', updateCanvasWidth);
        };
    }, []);

    // Update canvas dimensions when canvasWidth or dpr changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Set canvas dimensions accounting for pixel ratio
        canvas.width = canvasWidth * dpr;
        canvas.height = (fontSize * 2.5) * dpr;

        // Scale the context based on the device pixel ratio
        context.scale(dpr, dpr);

        // Set the CSS dimensions
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${fontSize * 2.5}px`;

    }, [canvasWidth, fontSize, dpr]);

    // Load brand logos
    useEffect(() => {
        const processWords = words[0] || words; // Ensure we're working with a 1D array
        const logos: { [key: string]: HTMLImageElement } = {};
        let loadedCount = 0;
        const totalImages = processWords.length;

        const loadImage = (word: string) => {
            const cleanWord = String(word).trim().toLowerCase().replace(/\s+/g, '-');
            const img = new Image();

            img.onload = () => {
                loadedCount++;
                logos[cleanWord] = img; // Store the loaded image
                if (loadedCount === totalImages) {
                    setLoadedImages(logos);
                    setImagesLoaded(true);
                }
            };

            img.onerror = () => {
                loadedCount++; // Ensure we don't get stuck on errors
                console.warn(`Failed to load logo for: ${cleanWord}`);
                if (loadedCount === totalImages) {
                    setLoadedImages(logos); // Ensure loadedImages is set even with errors
                    setImagesLoaded(true);
                }
            };

            try {
                img.src = `../public/logos/${cleanWord}.png`; // Corrected path
            } catch (error) {
                console.error(`Error loading logo for ${cleanWord}:`, error);
                loadedCount++;
                if (loadedCount === totalImages) {
                    setLoadedImages(logos); // Ensure loadedImages is set even with errors
                    setImagesLoaded(true);
                }
            }
        };

        // If there are no images to load, mark as loaded
        if (totalImages === 0) {
            setImagesLoaded(true);
            return;
        }

        processWords.forEach(loadImage);

        return () => {
            // Cleanup:  Consider aborting image loads if needed.  In modern browsers,
            // you could use AbortController.  For simplicity here, we'll just
            // let them complete.  If you have a *lot* of images and this component
            // unmounts frequently, AbortController would be a good addition.
        };
    }, [words]); // Dependency on words

    // Calculate word lengths
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imagesLoaded) return; // Don't proceed until images are loaded.

        const context = canvas.getContext('2d');
        if (!context) return;

        context.font = `600 ${fontSize}px ${font}`;
        context.textRendering = 'optimizeLegibility';
        if (typeof context.imageSmoothingEnabled !== 'undefined') {
            context.imageSmoothingEnabled = true;
        }

        const processWords = words[0] || words;
        const lengths = processWords.map((word) => context.measureText(String(word)).width);
        setWordLengths(lengths);

    }, [words, fontSize, font, imagesLoaded]); // Dependency on imagesLoaded

    // Animation and drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || wordLengths.length === 0 || canvasWidth === 0 || !imagesLoaded) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        let animationFrameId: number;
        const processWords = words[0] || words;

        const spacing = 80;
        const logoSize = fontSize * 1.2;
        const logoTextGap = 15;

        let totalContentWidth = 0;
        for (let i = 0; i < wordLengths.length; i++) {
            totalContentWidth += wordLengths[i] + logoSize + logoTextGap;
            if (i < wordLengths.length - 1) {
                totalContentWidth += spacing;
            }
        }

        const createBackgroundGradient = () => {
            const gradient = context.createLinearGradient(0, 0, canvasWidth, 0);
            gradient.addColorStop(0, '#0a2352');
            gradient.addColorStop(1, '#000000');
            return gradient;
        };

        const fadeWidth = canvasWidth * 0.2;

        const getOpacityAtPosition = (x: number) => {
            if (x < fadeWidth) {
                return x / fadeWidth;
            } else if (x > canvasWidth - fadeWidth) {
                return (canvasWidth - x) / fadeWidth;
            }
            return 1;
        };

        const drawWords = () => {
            context.fillStyle = createBackgroundGradient();
            context.fillRect(0, 0, canvasWidth, fontSize * 2.5);

            context.font = `600 ${fontSize}px ${font}`;
            context.textBaseline = 'middle';
            context.shadowColor = 'rgba(0, 0, 0, 0.3)';
            context.shadowBlur = 2;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 1;

            const requiredSets = Math.ceil(canvasWidth / totalContentWidth) + 1;
            offsetRef.current = (offsetRef.current + speed / 60) % totalContentWidth;

            for (let set = 0; set < requiredSets; set++) {
                let currentX = set * totalContentWidth - offsetRef.current;

                for (let i = 0; i < processWords.length; i++) {
                    const word = String(processWords[i]);
                    const wordWidth = wordLengths[i];
                    const cleanWord = word.trim().toLowerCase().replace(/\s+/g, '-');
                    const logo = loadedImages[cleanWord];
                    const totalItemWidth = logoSize + logoTextGap + wordWidth;

                    if (currentX > -totalItemWidth && currentX < canvasWidth) {
                        if (logo) {
                            const logoOpacity = getOpacityAtPosition(currentX + logoSize / 2);
                            if (logoOpacity > 0) {
                                context.save();
                                context.globalAlpha = logoOpacity;
                                try {
                                    context.drawImage(
                                        logo,
                                        Math.round(currentX),
                                        Math.round(fontSize + 5 - logoSize / 2),
                                        logoSize,
                                        logoSize
                                    );
                                } catch (error) {
                                    console.warn(`Error drawing logo for ${word}:`, error);
                                }
                                context.restore();
                            }
                        }

                        const textX = currentX + logoSize + logoTextGap;

                        if (
                            (textX < fadeWidth && textX + wordWidth > fadeWidth) ||
                            (textX < canvasWidth - fadeWidth && textX + wordWidth > canvasWidth - fadeWidth)
                        ) {
                            let charX = textX;
                            for (let charIndex = 0; charIndex < word.length; charIndex++) {
                                const char = word[charIndex];
                                const charWidth = context.measureText(char).width;
                                const opacity = getOpacityAtPosition(charX + charWidth / 2);

                                if (opacity > 0) {
                                    const rgbaColor = `rgba(255, 255, 255, ${opacity})`;
                                    context.fillStyle = rgbaColor;
                                    context.fillText(char, Math.round(charX), Math.round(fontSize + 5));
                                }

                                charX += charWidth;
                            }
                        } else {
                            const opacity = getOpacityAtPosition(textX + wordWidth / 2);
                            if (opacity > 0) {
                                const rgbaColor = `rgba(255, 255, 255, ${opacity})`;
                                context.fillStyle = rgbaColor;
                                context.fillText(word, Math.round(textX), Math.round(fontSize + 5));
                            }
                        }
                    }
                    currentX += totalItemWidth + spacing;
                }
            }
            animationFrameId = requestAnimationFrame(drawWords);
        };

        drawWords();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [words, speed, fontSize, font, wordLengths, canvasWidth, loadedImages, imagesLoaded]);

    return (
        <div
            ref={containerRef}
            className="w-full"
            style={{
                overflow: 'hidden',
                position: 'relative',
                background: 'linear-gradient(to right, #0a2352, #000000)',
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    width: '100%',
                    opacity: 0.5,
                }}
            />
        </div>
    );
};

export default Conveyor;
