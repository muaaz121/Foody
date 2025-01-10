// Search Functionality and Fetching Data
async function fetchMeals(query) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();
    return data.meals || [];  // In case no meals are found
}

// Display Meals in the DOM
function displayMeals(meals, startIndex = 0) {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";  // Clear previous results

    if (meals.length === 0) {
        resultsContainer.innerHTML = "<p class='no-results text-center'>No meals found!</p>";
        return;
    }

    // Slice meals based on startIndex for pagination
    meals.slice(startIndex, startIndex + 5).forEach(meal => {
        const mealCard = document.createElement("div");
        mealCard.classList.add("col");
        mealCard.classList.add("meal-item");
        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid">
            <h3>${meal.strMeal}</h3>
            <p>${meal.strCategory}</p>
        `;

        // Add click event listener to show modal
        mealCard.addEventListener("click", () => showModal(meal));
        resultsContainer.appendChild(mealCard);
    });

    // Handle showing the "Show All" button and linking it to the next set of meals
    const showAllBtn = document.getElementById("showAllBtn");
    if (meals.length > startIndex + 5) {
        showAllBtn.classList.remove("d-none");
        showAllBtn.addEventListener("click", () => {
            showAllBtn.classList.add("d-none"); // Hide the "Show All" button after click
            displayMeals(meals, startIndex + 5); // Display the next set of meals
        });
    } else {
        showAllBtn.classList.add("d-none");
    }
}

// Show Modal with Meal Details
function showModal(meal) {
    const modal = document.getElementById("mealModal");
    const overlay = document.getElementById("overlay");

    // Populate Modal with meal information
    modal.querySelector("h2").textContent = meal.strMeal;
    modal.querySelector("img").src = meal.strMealThumb;
    modal.querySelector("#mealId").textContent = meal.idMeal;
    modal.querySelector("#mealCategory").textContent = meal.strCategory;
    modal.querySelector("#mealArea").textContent = meal.strArea;
    modal.querySelector("#mealInstructions").textContent = meal.strInstructions;

    // Show the modal and overlay
    modal.classList.add("show");
    overlay.classList.add("show");
}

// Close Modal
function closeModal() {
    const modal = document.getElementById("mealModal");
    const overlay = document.getElementById("overlay");

    // Hide the modal and overlay
    modal.classList.remove("show");
    overlay.classList.remove("show");
}

// Event listeners
document.getElementById("searchButton").addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value.trim();
    if (query) {
        const meals = await fetchMeals(query);
        displayMeals(meals); // Display the first 5 meals
    }
});

// Close modal when clicking on overlay or close button
document.getElementById("overlay").addEventListener("click", closeModal);
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
