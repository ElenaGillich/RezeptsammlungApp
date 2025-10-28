export const PreparationSpeed = {
    FAST: "Schnell",
    MEDIUM: "Mittel",
    LONG: "Lange"
} as const;

export type PreparationSpeed = typeof PreparationSpeed[keyof typeof PreparationSpeed];