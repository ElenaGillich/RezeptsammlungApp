import type { SyntheticEvent } from "react";

export const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.onerror = null; // предотвращаем бесконечный цикл
    target.src = "/noRecipeImage.png";
    target.width = 220;
    target.height = 180;
};
