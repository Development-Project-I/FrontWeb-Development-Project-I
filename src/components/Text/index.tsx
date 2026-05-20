import clsx from "clsx";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { ThemeTokens } from "../../hooks/useTheme";
import { textPresetStyles } from "../../plugins/text-plugin.js";

export type TextPreset = keyof typeof textPresetStyles;

export type FontWeight = "regular" | "medium" | "semibold" | "bold";

export type ThemeColorKey = keyof ThemeTokens["colors"];

export type TextColor = ThemeColorKey | (string & {});

function parsePx(value: string): number {
  return Number.parseFloat(value);
}

export const fontSizeMapper: Record<
  TextPreset,
  { fontSize: number; lineHeight: number }
> = Object.fromEntries(
  (Object.keys(textPresetStyles) as TextPreset[]).map((key) => {
    const { fontSize, lineHeight } = textPresetStyles[key];
    return [key, { fontSize: parsePx(fontSize), lineHeight: parsePx(lineHeight) }];
  }),
) as Record<TextPreset, { fontSize: number; lineHeight: number }>;

const fontWeightClassMap: Record<FontWeight, string> = {
  regular: "font-regular",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const themeColorToTailwind: Record<ThemeColorKey, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  white: "text-white",
  black: "text-black",
  error: "text-error",
  success: "text-success",
  warning: "text-warning",
  transparent: "text-transparent",
};

function isThemeColorKey(value: string): value is ThemeColorKey {
  return value in themeColorToTailwind;
}

export function getFontFamily(_fontWeight: FontWeight, theme: ThemeTokens): string {
  return theme.fontFamily.sans
    .map((f) => (f.includes(" ") ? `"${f}"` : f))
    .join(", ");
}

export type TextProps = {
  children?: ReactNode;
  preset?: TextPreset;
  fontWeight?: FontWeight;
  color?: TextColor;
} & Omit<ComponentPropsWithoutRef<"h1">, "color" | "children">;

export function Text({
  preset = "body_14/20",
  fontWeight = "semibold",
  color = "primary",
  className,
  style,
  children,
  ...rest
}: TextProps) {
  const presetClass = `preset-${String(preset)}`;
  const weightClass = fontWeightClassMap[fontWeight];

  const colorClass =
    typeof color === "string" && isThemeColorKey(color)
      ? themeColorToTailwind[color]
      : undefined;

  const arbitraryColor: CSSProperties | undefined =
    typeof color === "string" && !isThemeColorKey(color) ? { color } : undefined;

  const mergedStyle: CSSProperties | undefined =
    arbitraryColor || style ? { ...arbitraryColor, ...style } : undefined;

  return (
    <h1
      className={clsx(presetClass, weightClass, colorClass, className)}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </h1>
  );
}
