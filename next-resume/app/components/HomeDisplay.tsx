import React from "react";
import HomeDisplayButton from "./HomeDisplayButton";

const HomeDisplay = () => {
    return (
        <div>
            <div className="bg-gradient-to-br from-black via-gray-900 to-black flex relative overflow-hidden h-149">
                    <div className={
                        "flex flex-col md:flex-row items-center justify-center " +
                        "min-h-100 bg-transparent text-white " +
                        "px-4 md:px-4 lg:px-9 rounded-4xl shadow-2xl " +
                        "z-10 mt-20 mb-30"
                    }
                    >

                    <div
                    className="text-center md:text-left max-w-2xl space-y-6 flex-grow md:flex-grow-0"
                >
                    <h1
                        className={
                            "text-1xl sm:text-2xl md:text-3xl lg:text-4xl " +
                            "font-semibold text-white " + // White heading
                            " "
                        }
                    >
                        Optimize. Sell. Grow.
                        <br/>
                        Your Investments.
                    </h1>
                    <p
                        className="text-gray-300 text-lg sm:text-xl md:text-1xl"
                    >
                        <strong className="text-orange-200">Nuvault</strong> is the app designed to help you optimize your
                        investments—from collectibles to assets.
                        Stay ahead and grow your portfolio with ease. Make every investment count.
                    </p>
                    <div>
                        <HomeDisplayButton/>
                    </div>
                </div>
            </div>
                <div className="absolute top-0 right-0 h-full select-none">
                    <img
                        src="/BeckettGradedCards.png"
                        alt="logo"
                        className="h-full w-auto object-contain select-none"
                    />
                </div>

            </div>
        </div>
    );
};

export default HomeDisplay;