export interface Recipie {
    id: number;  
    name: string;
    image: string;
    rating: number;
    userId: number;
    cuisine: string;
    difficulty: string;
    servings: number;
    reviewCount: number;
    tags: Array<string>;
    cookTimeMinutes: number;
    prepTimeMinutes: number;
    mealType: Array<string>;
    caloriesPerServing: number;
    ingredients: Array<string>;
    instructions: Array<string>;
}