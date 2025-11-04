package org.example.backend.model;

public enum DishCategory {
    SALAD("Salat", "Салат"),
    SOUP("Suppe", "Суп"),
    APPETIZER("Vorspeise", "Закуска"),
    MAIN_COURSE("Hauptgericht", "Основное блюдо"),
    SIDE_DISH("Beilage", "Гарнир"),
    SAUCE("Soße", "Соус"),
    BAKED_GOODS("Backwaren", "Выпечка"),
    DESSERT("Dessert", "Десерт"),
    DRINK("Getränk", "Напиток"),
    BREAKFAST("Frühstück", "Завтрак"),
    VEGAN("Vegan", "Постное / Веганское"),
    VEGETARIAN("Vegetarisch", "Вегетарианское"),
    KIDS("Kindergericht", "Детское блюдо"),
    PRESERVE("Einmachen", "Заготовка"),
    GRILL("Grillgericht", "Блюдо на гриле"),
    PASTA("Pasta", "Паста / Макароны"),
    OTHER("Andere", "Другое");

    private final String germanName;
    private final String russianName;

    DishCategory(String germanName, String russianName) {
        this.germanName = germanName;
        this.russianName = russianName;
    }

    public String getValue() {
        return germanName;
    }

    public String getInRussian() {
        return russianName;
    }
}

