export const DishCategory = {
    SALAD: "Salat",
    SOUP: "Suppe",
    APPETIZER: "Vorspeise",
    MAIN_COURSE: "Hauptgericht",
    BAKED_GOODS: "Backwaren",
    DESSERT: "Dessert",
    SIDE_DISH: "Beilage",
    SAUCE: "Soße",
    DRINK: "Getränk",
    BREAKFAST: "Frühstück",
    VEGAN: "Vegan",
    VEGETARIAN: "Vegetarisch",
    KIDS: "Kindergericht",
    PRESERVE: "Einmachen",
    GRILL: "Grillgericht",
    PASTA: "Pasta",
    OTHER: "Sonstiges",
} as const;

export type DishCategory = typeof DishCategory[keyof typeof DishCategory];

