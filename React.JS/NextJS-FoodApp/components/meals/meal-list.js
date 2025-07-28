// filepath: c:\Users\vinay\OneDrive\Desktop\foodies-project\components\meals\meal-list.js
'use client';

import { useState } from "react";
import MealItem from "./meal-item";
import { deleteMeal } from "@/lib/meals";
import classes from "./meal-list.module.css";

export default function MealList({ initialMeals }) {
  const [meals, setMeals] = useState(initialMeals);

  const handleDelete = async (slug) => {
    await deleteMeal(slug);
    setMeals((prevMeals) => prevMeals.filter((meal) => meal.slug !== slug));
  };

  return (
    <div className={classes.mealList}>
      {meals.map((meal) => (
        <MealItem key={meal.slug} meal={meal} onDelete={handleDelete} />
      ))}
    </div>
  );
}