const RecipeApp = (() => {
  console.log("RecipeApp initializing...");

  const recipes = [
    {
      id: 1,
      title: "Pasta",
      difficulty: "easy",
      time: 20,
      ingredients: ["Pasta", "Salt", "Olive Oil"],
      steps: [
        "Boil water",
        {
          text: "Cook pasta",
          substeps: ["Add pasta", "Stir occasionally", "Drain water"]
        },
        "Serve hot"
      ]
    },
    {
      id: 2,
      title: "Fried Rice",
      difficulty: "medium",
      time: 25,
      ingredients: ["Rice", "Oil", "Vegetables", "Soy Sauce"],
      steps: [
        "Heat pan",
        {
          text: "Cook vegetables",
          substeps: ["Add oil", "Add veggies", "Stir fry"]
        },
        "Add rice and sauce"
      ]
    },
    {
      id: 3,
      title: "Salad",
      difficulty: "easy",
      time: 10,
      ingredients: ["Lettuce", "Tomato", "Cucumber"],
      steps: ["Chop vegetables", "Mix everything", "Serve"]
    },
    {
      id: 4,
      title: "Pizza",
      difficulty: "hard",
      time: 45,
      ingredients: ["Dough", "Cheese", "Sauce"],
      steps: [
        "Prepare dough",
        {
          text: "Add toppings",
          substeps: [
            "Spread sauce",
            "Add cheese",
            {
              text: "Final touches",
              substeps: ["Add herbs", "Drizzle oil"]
            }
          ]
        },
        "Bake pizza"
      ]
    }
  ];

  let currentFilter = "all";
  let currentSort = "";

  const container = document.getElementById("recipe-container");
  const sortSelect = document.getElementById("sortSelect");

  const renderSteps = (steps, level = 0) => {
    return `
      <ul>
        ${steps.map(step => {
          if (typeof step === "string") {
            return `<li class="step-level-${level}">${step}</li>`;
          }
          return `
            <li class="step-level-${level}">
              ${step.text}
              ${renderSteps(step.substeps, level + 1)}
            </li>
          `;
        }).join("")}
      </ul>
    `;
  };

  const createRecipeCard = (recipe) => `
    <div class="recipe-card" data-id="${recipe.id}">
      <h3>${recipe.title}</h3>
      <p>Difficulty: ${recipe.difficulty}</p>
      <p>Time: ${recipe.time} mins</p>

      <button class="toggle-btn" data-toggle="steps">Show Steps</button>
      <button class="toggle-btn" data-toggle="ingredients">Show Ingredients</button>

      <div class="steps-container">
        ${renderSteps(recipe.steps)}
      </div>

      <div class="ingredients-container">
        <ul>
          ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;

  const getFilteredRecipes = () => {
    let result = [...recipes];

    if (currentFilter === "quick") {
      result = result.filter(r => r.time < 30);
    } else if (currentFilter !== "all") {
      result = result.filter(r => r.difficulty === currentFilter);
    }

    if (currentSort === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (currentSort === "time") {
      result.sort((a, b) => a.time - b.time);
    }

    return result;
  };

  const updateDisplay = () => {
    container.innerHTML = getFilteredRecipes()
      .map(createRecipeCard)
      .join("");
  };

  const handleToggleClick = (e) => {
    if (!e.target.classList.contains("toggle-btn")) return;

    const card = e.target.closest(".recipe-card");
    const type = e.target.dataset.toggle;
    const box = card.querySelector(`.${type}-container`);

    box.classList.toggle("visible");
    e.target.textContent = box.classList.contains("visible")
      ? `Hide ${type}`
      : `Show ${type}`;
  };

  const setupEvents = () => {
    document.querySelector(".controls").addEventListener("click", e => {
      if (e.target.dataset.filter) {
        currentFilter = e.target.dataset.filter;
        updateDisplay();
      }
    });

    sortSelect.addEventListener("change", e => {
      currentSort = e.target.value;
      updateDisplay();
    });

    container.addEventListener("click", handleToggleClick);
    console.log("Event listeners attached!");
  };

  const init = () => {
    updateDisplay();
    setupEvents();
    console.log("RecipeApp ready!");
  };

  return { init };
})();

RecipeApp.init();
