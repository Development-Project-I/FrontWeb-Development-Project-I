import plugin from "tailwindcss/plugin.js";

export const textPresetStyles = {
  "display_40/48": { fontSize: "40px", lineHeight: "48px" },
  "headline_32/40": { fontSize: "32px", lineHeight: "40px" },
  "headline_24/32": { fontSize: "24px", lineHeight: "32px" },
  "headline_20/25": { fontSize: "20px", lineHeight: "25px" },
  "headline_18/24": { fontSize: "18px", lineHeight: "24px" },
  "body_28/32": { fontSize: "28px", lineHeight: "32px" },
  "body_16/24": { fontSize: "16px", lineHeight: "24px" },
  "body_16/21": { fontSize: "16px", lineHeight: "21px" },
  "body_16/20": { fontSize: "16px", lineHeight: "20px" },
  "body_14/16": { fontSize: "14px", lineHeight: "16px" },
  "body_14/20": { fontSize: "14px", lineHeight: "20px" },
  "body_14/19": { fontSize: "14px", lineHeight: "19px" },
  "body_14/24": { fontSize: "14px", lineHeight: "24px" },
  "body_12/16": { fontSize: "12px", lineHeight: "16px" },
  "body_12/14": { fontSize: "12px", lineHeight: "14px" },
  "body_10/16": { fontSize: "10px", lineHeight: "16px" },
  "button_16/24": { fontSize: "16px", lineHeight: "24px" },
  "button_14/24": { fontSize: "14px", lineHeight: "24px" },
  "button_12/12": { fontSize: "12px", lineHeight: "12px" },
  "tag_12/16": { fontSize: "12px", lineHeight: "16px" },
};


function asFontFamilyStack(value) {
  if (Array.isArray(value)) {
    return value.map((f) => (String(f).includes(" ") ? `"${f}"` : f)).join(", ");
  }
  return value ?? "sans-serif";
}

export default plugin(({ addUtilities, e, theme }) => {
  const sans = asFontFamilyStack(theme("fontFamily.sans"));
  const presetUtils = {};
  for (const key of Object.keys(textPresetStyles)) {
    const className = `preset-${key}`;
    presetUtils[`.${e(className)}`] = {
      ...textPresetStyles[key],
      fontFamily: sans,
    };
  }

  addUtilities({
    ...presetUtils,
    ".font-regular": {
      fontFamily: sans,
      fontWeight: "400",
    },
    ".font-medium": {
      fontFamily: sans,
      fontWeight: "500",
    },
    ".font-semibold": {
      fontFamily: sans,
      fontWeight: "600",
    },
    ".font-bold": {
      fontFamily: sans,
      fontWeight: "700",
    },
  });
});
