export const DishCategory = {
    SALAD: "Salat",
    SOUP: "Suppe",
    APPETIZER: "Vorspeise",
    MAIN_COURSE: "Hauptgericht",
    SIDE_DISH: "Beilage",
    SAUCE: "Soße",
    BAKED_GOODS: "Backwaren",
    DESSERT: "Dessert",
    CAKE: "Torte",
    DRINK: "Getränk",
    BREAKFAST: "Frühstück",
    VEGAN: "Vegan",
    VEGETARIAN: "Vegetarisch",
    KIDS: "Kindergericht",
    DIET: "Diät",
    FAST_FOOD: "Fast Food",
    PRESERVE: "Einmachen",
    GRILL: "Grillgericht",
    PASTA: "Pasta",
    NO_BAKE: "Ohne Backen",
} as const;

export type DishCategory = typeof DishCategory[keyof typeof DishCategory];

// export type DishCategory:
//     "Salat" |
//     "Suppe" |
//     "Vorspeise" |
//     "Hauptgericht" |
//     "Beilage" |
//     "Soße" |
//     "Backwaren" |
//     "Dessert" |
//     "Torte" |
//     "Getränk" |
//     "Frühstück" |
//     "Vegan" |
//     "Vegetarisch" |
//     "Kindergericht" |
//     "Diät" |
//     "Fast Food" |
//     "Einmachen" |
//     "Grillgericht" |
//     "Pasta" |
//     "Ohne Backen"

