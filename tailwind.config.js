import { EnvConfig } from "./src/config/env.config";

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": EnvConfig.PRIMARY_COLOR,
                "secondary": EnvConfig.SECONDARY_COLOR,

                "white": "#FFFFFF",
                "black": "#000000",

                "error": "#FD2148",

                "success": "#24A148",

                "warning": "#F1C21B",

                "transparent": "rgba(0,0,0,0)",
            },
        },
    },
    plugins: [],
}