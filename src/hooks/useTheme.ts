import { EnvConfig } from "../config/env.config";
import { textPresetStyles } from "../plugins/text-plugin.js";

export type TextPreset = keyof typeof textPresetStyles;

export type FontWeightToken = "regular" | "medium" | "semibold" | "bold";

export interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    white: string;
    black: string;
    error: string;
    success: string;
    warning: string;
    transparent: string;
  };
  textPresets: typeof textPresetStyles;
  fontFamily: {
    sans: readonly string[];
  };
  fontWeight: Record<FontWeightToken, number>;
}

const fontWeight: Record<FontWeightToken, number> = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export function useTheme(): ThemeTokens {
  return {
    colors: {
      primary: EnvConfig.PRIMARY_COLOR,
      secondary: EnvConfig.SECONDARY_COLOR,
      white: "#FFFFFF",
      black: "#000000",
      error: "#FD2148",
      success: "#24A148",
      warning: "#F1C21B",
      transparent: "rgba(0,0,0,0)",
    },
    textPresets: textPresetStyles,
    fontFamily: {
      sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
    },
    fontWeight,
  };
}
