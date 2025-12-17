/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
            DEFAULT: "#7f13ec", // from home.html
            dark: "#630eb8",    // from home.html
            light: "#8B5CF6",   // from dashboard.html (Violet-500)
            ...colors.blue, // Keep existing primary as fallback/mixin if needed, but we are overriding DEFAULT
        },
        secondary: colors.slate,
        "brand-purple": "#6425EA", // from login.html
        "brand-purple-hover": "#501dbb",
        "brand-purple-light": "#f3effd",

        // Backgrounds
        "background-light": "#f7f6f8", // merged
        "background-dark": "#191022",  // from home.html
        "surface-light": "#ffffff",
        "surface-dark": "#2d1f3f",
        
        // Sidebar (dashboard)
        "sidebar-bg": "#1F2235",
        "sidebar-hover": "#2D3045",
        
        // Cards (dashboard)
        "card-purple": "#A855F7",
        "card-green": "#22C55E",
        "card-cyan": "#06B6D4",
        "card-orange": "#F59E0B",
        "card-red": "#EF4444",
        "card-indigo": "#6366F1",
        "card-pink": "#EC4899",
      },
      fontFamily: {
        sans: ['Poppins', 'Plus Jakarta Sans', 'Noto Sans', 'sans-serif'], // Default sans
        display: ['Lexend', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
}
