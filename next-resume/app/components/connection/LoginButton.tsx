'use client';
import React from "react";

const LoginButton = () => {
    return (
        <button
            onClick={() => console.log("Login button")}
            className="text-[#d1ad6d] bg-transparent border-2 border-[#d1ad6d] rounded-4xl px-4 py-2 cursor-pointer hover:bg-[#d1ad6d] hover:text-black transition-colors"
        >
            Login
        </button>
    );
};

export default LoginButton;
