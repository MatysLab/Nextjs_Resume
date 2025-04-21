import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        // Add other paths where you use Tailwind classes
    ],
    theme: {
        extend: {

        },
    },
    plugins: ["@tailwindcss/postcss", require("daisyui")],
}

export default config