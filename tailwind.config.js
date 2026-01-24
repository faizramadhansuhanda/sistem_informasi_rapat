import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },

            animation: {
                blink: 'blink 1s infinite',
            },
            keyframes: {
                blink: {
                    '0%, 50%, 100%': { opacity: 1 },
                    '25%, 75%': { opacity: 0 },
                },
            },
        },
    },
    plugins: [forms],
};
 