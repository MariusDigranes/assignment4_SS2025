/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealCategoryToCocktailIngredient = {
  Beef: "whiskey",
  Chicken: "gin",
  Dessert: "amaretto",
  Lamb: "vodka",
  Miscellaneous: "vodka",
  Pasta: "tequila",
  Pork: "tequila",
  Seafood: "rum",
  Side: "brandy",
  Starter: "rum",
  Vegetarian: "gin",
  Breakfast: "vodka",
  Goat: "whiskey",
  Vegan: "rum",
  // Add more if needed; otherwise default to something like 'cola'
};

/*
    2) Main Initialization Function
       Called on page load to start all the requests:
       - Fetch random meal
       - Display meal
       - Map meal category to spirit
       - Fetch matching (or random) cocktail
       - Display cocktail
*/
function init() {
  fetchRandomMeal()
    .then((meal) => {
      displayMealData(meal);
      const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
      return fetchCocktailByDrinkIngredient(spirit);
    })
    .then((cocktail) => {
      displayCocktailData(cocktail);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */
function fetchRandomMeal() {
  return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
  .then((response) => response.json())  // Parse JSON
  .then((data) => data.meals[0]);  // Return the first meal
}

/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/
function displayMealData(meal) {
  const mealContainer = document.getElementById("meal-container");
  const mealIngredients = [];

  // Looper gjennom ingredienser og legger dem til en liste
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`] && meal[`strMeasure${i}`]) {
      mealIngredients.push(
        `<li>${meal[`strIngredient${i}`]}: ${meal[`strMeasure${i}`]}</li>`
      );
    }
}

 // Vist måltidsinformasjon
 mealContainer.innerHTML = `
 <h2>${meal.strMeal}</h2>
 <p><strong>Category:</strong> ${meal.strCategory}</p>
 <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
 <h3>Ingredients</h3>
 <ul>${mealIngredients.join("")}</ul>
 <p><strong>Instructions:</strong><br>${meal.strInstructions}</p>
`;
}
/*
Convert MealDB Category to a TheCocktailDB Spirit
Looks up category in our map, or defaults to 'cola'
*/
function mapMealCategoryToDrinkIngredient(category) {
  if (!category) return "cola";
  return mealCategoryToCocktailIngredient[category] || "cola";
}

/*
Fetch a Cocktail Using a Spirit from TheCocktailDB
Returns Promise that resolves to cocktail object
We call https://www.thecocktaildb.com/api/json/v1/1/search.php?s=DRINK_INGREDIENT to get a list of cocktails
Don't forget encodeURIComponent()
If no cocktails found, fetch random
*/
function fetchCocktailByDrinkIngredient(drinkIngredient) {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
    drinkIngredient
  )}`;
  return fetch(url)
    .then((response) => response.json())  // Hent data fra CocktailDB API
    .then((data) => {
      if (data.drinks) {
        return data.drinks[0];  // Returner første treff
      } else {
        return fetchRandomCocktail();  // Fallback til tilfeldig cocktail
      }
    });
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
function fetchRandomCocktail() {
  return fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
  .then((response) => response.json())
  .then((data) => data.drinks[0]);
}

/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
  const cocktailContainer = document.getElementById("cocktail-container");
  const cocktailIngredients = [];

  // Looper gjennom ingredienser og legger dem til en liste
  for (let i = 1; i <= 15; i++) {
    if (cocktail[`strIngredient${i}`]) {
      cocktailIngredients.push(
        `<li>${cocktail[`strIngredient${i}`]}: ${cocktail[`strMeasure${i}`]}</li>`
      );
    }
}

cocktailContainer.innerHTML = `
<h2>${cocktail.strDrink}</h2>
<img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
<h3>Ingredients</h3>
<ul>${cocktailIngredients.join("")}</ul>
<p><strong>Instructions:</strong><br>${cocktail.strInstructions}</p>
`;
}

/*
Call init() when the page loads
*/
window.onload = init;
