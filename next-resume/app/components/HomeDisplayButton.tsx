'use client'
import React from "react";

const HomeDisplayButton = () => {
    return (
        <button
            className={
                "bg-linear-to-bl from-[#1818ba] to-[#202088] " + // Light blue to dark blue gradient
                "text-white font-semibold " +
                "px-8 py-3 sm:px-10 sm:py-4 md:px-10 md:py-3 " +
                "rounded-full shadow-md hover:shadow-lg " +
                "transition-all duration-200 " +
                "hover:scale-105 border-none cursor-pointer select-none"
            }
            onClick={() => console.log("clicked")}
        >
            Get Started
        </button>
    )
}

export default HomeDisplayButton;