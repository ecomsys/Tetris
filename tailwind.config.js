/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],

    safelist: [

        "xs:block",
        "sm:block",
        "md:block",
        "lg:block",
        "xl:block",
        "2xl:block",
        "3xl:block",

        // hidden
        "xs:hidden",
        "sm:hidden",
        "md:hidden",
        "lg:hidden",
        "xl:hidden",
        "2xl:hidden",
        "3xl:hidden",
    ],
    theme: {
        screens: {            
            xs: '30rem',
            sm: '40rem',
            md: '48rem',           
            lg: '64rem',
            xl: '80rem',
            '2xl': '96rem',
            '3xl': '117.5rem',

        }
    },

    extend: {
        colors: {
            white: "#ffffff",
            black: "#000000",
            yellow: "#efff5b",
            gold: "#CE9D35",
            green: "#4cd964",
            orange: "#f54f11",
            grey: "#a0a0a0",
            blue: "#007aff"
        },

        fontFamily: {
            inter: ["Inter", "sans-serif"],
            montserrat: ["Montserrat", "sans-serif"]
        },       
    },

    plugins: [],
};