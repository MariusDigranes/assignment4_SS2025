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


function searchCocktail() {
  const drinkIngredient = document.getElementById("drink-search").value.trim(); // Get the value and remove extra spaces
  
  // Check if the input field is empty
  if (!drinkIngredient) {
    alert("Please enter a drink ingredient!");
    return; // Stop the function if the input is empty
  }

  fetchCocktailByDrinkIngredient(drinkIngredient)
    .then(cocktail => {
      displayCocktailData(cocktail);
    })
    .catch(error => {
      console.error("Error while searching for cocktail:", error);
    });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */
function fetchRandomMeal() {
  return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(response => response.json())
    .then(data => {
      if (data.meals && data.meals.length > 0) {
        return data.meals[0]; // Returner første måltid
      }
    })
    .catch(error => {
      console.error("Feil ved henting av tilfeldig måltid:", error);
    });
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

  let youtubeEmbed = '';
  if (meal.strYoutube) {
    youtubeEmbed = `
      <h3>Recipe Video</h3>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/${meal.strYoutube.split('=')[1]}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
  }

  mealContainer.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h3>Ingredients</h3>
    <ul>${mealIngredients.join("")}</ul>
    <p><strong>Instructions:</strong><br>${meal.strInstructions}</p>
    ${youtubeEmbed}
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
We call https://www.thecocktaildb.com/api/json/v1/1/search.php?i=DRINK_INGREDIENT to get a list of cocktails
*/
function fetchCocktailByDrinkIngredient(drinkIngredient) {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${encodeURIComponent(drinkIngredient)}`;
  
  return fetch(url)
      .then(response => response.json())
      .then(data => {
          if (data.drinks && data.drinks.length > 0) {
              return data.drinks[0]; // Return first cocktail
          } else {
              alert("No drinks found, fetching random cocktail!");
              return fetchRandomCocktail(); // Fetch random cocktail if none found
          }
      })
      .catch(error => {
          console.error("Error fetching cocktail:", error);
      });
}


/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
function fetchRandomCocktail() {
  return fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then(response => response.json())
      .then(data => data.drinks[0])
      .catch(error => {
          console.error("Feil ved henting av tilfeldig cocktail:", error);
      });
}

/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
  const cocktailContainer = document.getElementById("cocktail-container");
  const cocktailIngredients = [];

  for (let i = 1; i <= 15; i++) {
    if (cocktail[`strIngredient${i}`] && cocktail[`strMeasure${i}`]) {
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
