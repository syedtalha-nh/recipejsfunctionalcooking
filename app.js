const RecipeApp = (() => {
  console.log("RecipeApp initializing...");

  const recipes = [
    {
      id: 1,
      title: "Pasta",
      difficulty: "easy",
      time: 20,
      ingredients: ["pasta", "salt", "oil"],
      steps: [
        "Boil water",
        { text: "Cook pasta", substeps: ["Add pasta", "Stir", "Drain"] },
        "Serve"
      ]
    },
    {
      id: 2,
      title: "Fried Rice",
      difficulty: "medium",
      time: 25,
      ingredients: ["rice", "oil", "vegetables"],
      steps: ["Heat pan", "Add vegetables", "Add rice"]
    },
    {
      id: 3,
      title: "Salad",
      difficulty: "easy",
      time: 10,
      ingredients: ["lettuce", "tomato", "cucumber"],
      steps: ["Chop", "Mix", "Serve"]
    },
    {
      id: 4,
      title: "Pizza",
      difficulty: "hard",
      time: 45,
      ingredients: ["dough", "cheese", "sauce"],
      steps: [
        "Prepare dough",
        {
          text: "Add toppings",
          substeps: ["Add sauce", "Add cheese"]
        },
        "Bake"
      ]
    }
  ];

  let currentFilter = "all";
  let currentSort = "";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];

  const container = document.getElementById("recipe-container");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const counter = document.getElementById("recipeCounter");

  let debounceTimer;

  const renderSteps = (steps, level = 0) => `
    <ul>
      ${steps.map(step =>
        typeof step === "string"
          ? `<li class="step-level-${level}">${step}</li>`
          : `<li class="step-level-${level}">
              ${step.text}
              ${renderSteps(step.substeps, level + 1)}
            </li>`
      ).join("")}
    </ul>
  `;

  const createRecipeCard = (r) => `
    <div class="recipe-card">
      <span class="favorite-btn ${favorites.includes(r.id) ? "active" : ""}"
            data-id="${r.id}">❤️</span>

      <h3>${r.title}</h3>
      <p>${r.difficulty} • ${r.time} mins</p>

      <button class="toggle-btn" data-toggle="steps">Show Steps</button>
      <button class="toggle-btn" data-toggle="ingredients">Show Ingredients</button>

      <div class="steps-container">${renderSteps(r.steps)}</div>
      <div class="ingredients-container">
        <ul>${r.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
      </div>
    </div>
  `;

  const applySearch = (list) =>
    list.filter(r =>
      r.title.toLowerCase().includes(searchQuery) ||
      r.ingredients.some(i => i.includes(searchQuery))
    );

  const applyFilter = (list) => {
    if (currentFilter === "favorites") {
      return list.filter(r => favorites.includes(r.id));
    }
    if (currentFilter === "quick") {
      return list.filter(r => r.time < 30);
    }
    if (currentFilter !== "all") {
      return list.filter(r => r.difficulty === currentFilter);
    }
    return list;
  };

  const applySort = (list) => {
    if (currentSort === "name") return [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (currentSort === "time") return [...list].sort((a, b) => a.time - b.time);
    return list;
  };

  const updateCounter = (shown) => {
    counter.textContent = `Showing ${shown} of ${recipes.length} recipes`;
  };

  const updateDisplay = () => {
    let result = applySearch(recipes);
    result = applyFilter(result);
    result = applySort(result);

    updateCounter(result.length);
    container.innerHTML = result.map(createRecipeCard).join("");
  };

  const toggleFavorite = (id) => {
    favorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];

    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
    updateDisplay();
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

    searchInput.addEventListener("input", e => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value.toLowerCase().trim();
        updateDisplay();
      }, 300);
    });

    container.addEventListener("click", e => {
      if (e.target.classList.contains("favorite-btn")) {
        toggleFavorite(Number(e.target.dataset.id));
      }

      if (e.target.classList.contains("toggle-btn")) {
        const card = e.target.closest(".recipe-card");
        const type = e.target.dataset.toggle;
        const box = card.querySelector(`.${type}-container`);
        box.classList.toggle("visible");
        e.target.textContent = box.classList.contains("visible")
          ? `Hide ${type}`
          : `Show ${type}`;
      }
    });

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
