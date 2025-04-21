'use client'
import React from "react";

const HomeDisplayButton = () => {
    return (
        <button
            className={
                "bg-gradient-to-r bg-[#d1ad6d] " + // Darker button
                "text-black font-semibold " +
                "px-8 py-3 sm:px-10 sm:py-4 md:px-10 md:py-3 " +
                "rounded-full shadow-md hover:shadow-lg " +
                "transition-all duration-200 " +
                "hover:scale-105 border-none cursor-pointer select-none"
            }
            onClick={() => console.log("clicked")}
        >
            Manage your investments
        </button>
    )
}

export default HomeDisplayButton;