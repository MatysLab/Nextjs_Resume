'use client';
import React from "react";

const RegisterButton = () => {
    return (
        <button
            onClick={() => console.log("Register button")}
            className="text-black bg-[#d1ad6d] border border-[#d1ad6d] rounded-4xl px-4 py-2 cursor-pointer transition-colors"
        >
            Sign up
        </button>
    );
};

export default RegisterButton;
