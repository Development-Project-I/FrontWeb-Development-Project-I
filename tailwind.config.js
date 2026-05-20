import { EnvConfig } from "./src/config/env.config";
import textPlugin, { textPresetStyles } from "./src/plugins/text-plugin.js";

const presetSafelist = Object.keys(textPresetStyles).map((key) => `preset-${key}`);

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [...presetSafelist, "font-regular", "font-medium", "font-semibold", "font-bold"],
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
            fontFamily: {
                sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [textPlugin],
};