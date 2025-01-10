// Search Functionality and Fetching Data
async function fetchMeals(query) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();
    return data.meals || [];  // In case no meals are found
}

// Display Meals in the DOM
function displayMeals(meals) {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";  // Clear previous results

    if (meals.length === 0) {
        resultsContainer.innerHTML = "<p class='no-results'>No meals found!</p>";
        return;
    }

    meals.slice(0, 5).forEach(meal => {
        const mealCard = document.createElement("div");
        mealCard.classList.add("meal-item");
        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h3>${meal.strMeal}</h3>
            <p>${meal.strCategory}</p>
        `;

        // Add click event listener to show modal
        mealCard.addEventListener("click", () => showModal(meal));
        resultsContainer.appendChild(mealCard);
    });

    if (meals.length > 5) {
        const showAllBtn = document.createElement("button");
        showAllBtn.id = "showAllBtn";
        showAllBtn.textContent = "SHOW ALL";
        showAllBtn.addEventListener("click", () => displayMeals(meals));
        resultsContainer.appendChild(showAllBtn);
    }
}

// Show Modal with Meal Details
function showModal(meal) {
    const modal = document.getElementById("mealModal");
    const overlay = document.getElementById("overlay");

    // Populate Modal with meal information
    modal.querySelector(".modal-content h2").textContent = meal.strMeal;
    modal.querySelector(".modal-content ul").innerHTML = `
        <li><strong>Meal ID:</strong> ${meal.idMeal}</li>
        <li><strong>Category:</strong> ${meal.strCategory}</li>
        <li><strong>Area:</strong> ${meal.strArea}</li>
        <li><strong>Instructions:</strong> ${meal.strInstructions}</li>
    `;
    modal.querySelector("img").src = meal.strMealThumb;

    // Show the modal and overlay
    modal.classList.add("show");
    overlay.style.display = "block";
}

// Close Modal
function closeModal() {
    const modal = document.getElementById("mealModal");
    const overlay = document.getElementById("overlay");

    // Hide the modal and overlay
    modal.classList.remove("show");
    overlay.style.display = "none";
}

// Event listeners
document.getElementById("searchButton").addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value.trim();
    if (query) {
        const meals = await fetchMeals(query);
        displayMeals(meals);
    }
});

// Close modal when clicking on overlay or close button
document.getElementById("overlay").addEventListener("click", closeModal);
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
