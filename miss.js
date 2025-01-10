let allMeals = [];
let displayedMeals = 5;

async function searchMeal() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsDiv = document.getElementById('results');
    const showAllBtn = document.getElementById('showAllBtn');
    resultsDiv.innerHTML = '';
    showAllBtn.style.display = 'none';

    if (!query) {
        alert('Please enter a meal name to search.');
        return;
    }

    resultsDiv.innerHTML = 'Loading...';

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
        const data = await response.json();

        allMeals = data.meals || [];
        displayedMeals = 5;

        if (allMeals.length === 0) {
            resultsDiv.innerHTML = 'No results found.';
            return;
        }

        showResults();

        if (allMeals.length > 5) {
            showAllBtn.style.display = 'block';
        }
    } catch (error) {
        resultsDiv.innerHTML = 'An error occurred while fetching data.';
        console.error(error);
    }
}

function showResults() {
    const resultsDiv = document.getElementById('results');
    const mealsToShow = allMeals.slice(0, displayedMeals);

    mealsToShow.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal-item';
        mealDiv.onclick = () => showMealDetails(meal);
        mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p><strong>Meal ID:</strong> ${meal.idMeal}</p>
            <p><strong>Instructions:</strong> ${meal.strInstructions.slice(0, 100)}...</p>
        `;
        resultsDiv.appendChild(mealDiv);
    });
}

function showAllMeals() {
    displayedMeals = allMeals.length;
    showResults();
    document.getElementById('showAllBtn').style.display = 'none';
}

function showMealDetails(meal) {
    document.getElementById('mealTitle').textContent = meal.strMeal;
    document.getElementById('mealImage').src = meal.strMealThumb;
    document.getElementById('mealCategory').textContent = meal.strCategory || 'N/A';
    document.getElementById('mealArea').textContent = meal.strArea || 'N/A';
    document.getElementById('mealInstructions').textContent = meal.strInstructions;

    const ingredientsList = document.getElementById('mealIngredients');
    ingredientsList.innerHTML = '';

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            const li = document.createElement('li');
            li.textContent = `${measure || ''} ${ingredient}`;
            ingredientsList.appendChild(li);
        }
    }

    document.getElementById('overlay').style.display = 'block';
    document.getElementById('mealModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('mealModal').style.display = 'none';
}
