
export function generateRecipeSteps(ingredients) {
  // Define some common cooking verbs based on ingredient types
  let name =  ["vegetable","meat","grain","dairy","liquid","fruit","legume" , "nut_seed" , "herb_spice" , "fat_oil" , "sweetener" , "starche" , "egg" ]
  const verbs = {
    vegetable: [
      "chop", "slice", "dice", "mince", "julienne", "shred", "grate",
      "steam", "roast", "saute", "stir-fry", "braise", "blanch", "pickle",
      "mash", "puree", "stuff"
    ],
    meat: [
      "marinate", "season", "saute", "grill", "bake", "fry", "braise",
      "sear", "poach", "stew", "shred", "grind", "mince", "stuff"
    ],
    grain: [
      "cook", "rinse", "boil", "simmer", "steam", "pressure cook", "toast"
    ],
    dairy: [
      "grate", "shred", "melt", "soften", "whip", "fold", "ricotta",
      "curdle" // be cautious suggesting curdling as it requires specific techniques
    ],
    liquid: [
      "add", "pour", "mix", "stir in", "reduce", "simmer", "broil" // broil can also refer to a cooking method
    ],
    fruit: [
      "wash", "slice", "dice", "chop", "pit", "peel", "puree", "saute",
      "macerate", "juice", "grate", "zest"
    ],
    legume: [
      "rinse", "soak", "boil", "simmer", "puree", "mash", "sprout"
    ],
    nut_seed: [
      "toast", "chop", "grind", "slice", "butter" // butter refers to using nut butter
    ],
    herb_spice: [
      "add", "chop", "mince", "crush", "sprinkle", "infuse"
    ],
    fat_oil: [
      "heat", "melt", "saute", "sear", "drizzle", "brush"
    ],
    sweetener: [
      "add", "mix in", "dissolve", "fold in"
    ],
    starch: [
      "mix", "whisk", "knead", "roll out"
    ],
    egg: [
      "whisk", "beat", "separate", "poach", "scramble", "fry", "hard-boil", "soft-boil"
    ],
    // Add more categories and verbs as needed
  };
  

  const steps = [];

  // Loop through ingredients and suggest basic steps
  for (const ingredient of ingredients) {
    const type = getIngredientType(ingredient);  // Replace this with logic to categorize ingredients
    if (type) {
      if(name.includes(type)){
        // console.log(verbs[type])
        steps.push(`${verbs[type][Math.floor(Math.random() * verbs[type].length)]} the ${ingredient}`);
      }

      
    } else {
      steps.push(`Add the ${ingredient}`);
    }
  }

  // Add a final step mentioning combining ingredients
  steps.push("Combine all ingredients as desired.");

  return steps;
}

// Placeholder function to categorize ingredients (replace with your logic)
function getIngredientType(ingredient) {
  const veggies= ["carrot", "onion", "potato", "pepper", "broccoli", "celery", "mushroom", "tomato", "spinach", "cauliflower", "corn", "cucumber", "eggplant", "garlic", "green beans", "zucchini"]
  const meats= ["chicken", "beef", "fish", "pork", "shrimp", "sausage", "ground beef", "lamb", "turkey"]
  const grains= ["rice", "pasta", "bread", "quinoa", "couscous", "oats", "barley"]
  const dairy= ["cheese", "milk", "yogurt", "butter", "sour cream", "cream cheese"]
  const liquids= ["water", "broth", "oil", "vinegar", "soy sauce", "lemon juice", "wine"]
  
  const fruits= ["apple", "banana", "orange", "strawberry", "blueberry", "mango", "grapefruit", "pineapple", "melon", "kiwi", "pear", "cherry"]
  const legumes= ["beans", "lentils", "chickpeas", "peas"]
  const nut_seed= ["almonds", "cashews", "peanuts", "walnuts", "flaxseed", "chia seeds", "pumpkin seeds"]
  const herbs_spices= ["basil", "oregano", "thyme", "parsley", "cumin", "paprika", "chili powder", "cinnamon", "ginger", "garlic powder", "onion powder", "cayenne pepper", "black pepper", "salt"]
  const fats_oils= ["olive oil", "vegetable oil", "butter", "coconut oil", "avocado oil"]
  const sweeteners= ["sugar", "honey", "maple syrup", "brown sugar", "agave nectar"]
  const starches= ["flour", "cornstarch", "arrowroot powder", "tapioca starch"]
  const eggs= ["eggs"]


  if (veggies.includes(ingredient.toLowerCase())) return "vegetable";
  if (meats.includes(ingredient.toLowerCase())) return "meat";
  if (grains.includes(ingredient.toLowerCase())) return "grain";
  if (dairy.includes(ingredient.toLowerCase())) return "dairy";
  if (liquids.includes(ingredient.toLowerCase())) return "liquid";
  if (fruits.includes(ingredient.toLowerCase())) return "fruit";
  if (legumes.includes(ingredient.toLowerCase())) return  "legume";
  if (nut_seed.includes(ingredient.toLowerCase())) return "nut_seed";
  if (herbs_spices.includes(ingredient.toLowerCase())) return "herb_spice";
  if (fats_oils.includes(ingredient.toLowerCase())) return "fat_oil";
  if (sweeteners.includes(ingredient.toLowerCase())) return "sweetener";
  if (starches.includes(ingredient.toLowerCase())) return "starch";
  if (eggs.includes(ingredient.toLowerCase())) return "egg";
  return null;
}




//   // Example usage
//   const myIngredients = ["chicken", "rice", "broccoli", "carrot", "soy sauce"];
//   const recipeSteps = generateRecipeSteps(myIngredients);

//   console.log("Recipe Steps:");
//   for (const step of recipeSteps) {
//     console.log(step);
//   }
