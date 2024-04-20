// Function to display meals on the homepage
const searchMeals = function displayMeals() {
	// Fetch meals data from the API
	fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=p`)
		.then((res) => res.json())
		.then((data) => {
			// Display meals dynamically on the webpage
			document.getElementById("displayMeals").innerHTML = data.meals
				.map(
					(meal) => `
					    <div class="col">
					      <div class="card">
						<img src="${meal.strMealThumb}" class="card-img-top" alt="meals">
						<div class="card-body">
						  <h3 class="card-title">${meal.strMeal}</h3>
						  <button 
						    type="button" 
						    class="btn my-btn"
						    data-bs-toggle="modal"
						    data-bs-target="#detailModal" 
						    onclick="showMealDetails(${meal.idMeal})">
						      More Details
						    </button>
						  <button 
						    id="main${meal.idMeal}" 
						    class="btn my-btn" 
						    onclick="addRemoveToFavList(${meal.idMeal})">
						      <i class="fa-solid fa-heart"></i>
						  </button>
						</div>
					      </div>
					    </div>
          				`
				)
				.join("");
		});
};

// Call the searchMeals function to display meals on page load
searchMeals();

// Check if the favorites list exists in the local storage, if not, create an empty list
if (localStorage.getItem("favouritesList") == null) {
	localStorage.setItem("favouritesList", JSON.stringify([]));
}

// Function to fetch meals from the API
async function fetchMealsFromApi(url, value) {
	const response = await fetch(`${url + value}`);
	const meals = await response.json();
	return meals;
}

// Function to display search results based on user input
function showMeals() {
	let inputValue = document.getElementById("mySearch").value;
	let arr = JSON.parse(localStorage.getItem("favouritesList"));
	let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
	let html = "";
	let meals = fetchMealsFromApi(url, inputValue);
	meals.then((data) => {
		if (data.meals) {
			data.meals.forEach((element) => {
				document.getElementById("searchResult").innerHTML = "Your Meals...";
				let isFav = false;
				for (let index = 0; index < arr.length; index++) {
					if (arr[index] == element.idMeal) {
						isFav = true;
					}
				}
				if (isFav) {
					// Display the meal as a favorite
					html += `
					    <div class="col">
					      <div class="card">
						<img src="${element.strMealThumb}" class="card-img-top" alt="meals">
						<div class="card-body">
						  <h3 class="card-title">${element.strMeal}</h3>
						  <button 
						    type="button" 
						    class="btn my-btn"
						    data-bs-toggle="modal"
										  data-bs-target="#detailModal"
						    onclick="showMealDetails(${element.idMeal})">
						      More Details
						    </button>
						  <button 
						    id="main${element.idMeal}" 
						    class="btn my-btn" 
						    onclick="addRemoveToFavList(${element.idMeal})">
						      <i class="fa-solid fa-heart"></i>
						  </button>
						</div>
					      </div>
					    </div>
					  `;
				} else {
					// Display the meal as a non-favorite
					html += `
					    <div class="col">
					      <div class="card">
						<img src="${element.strMealThumb}" class="card-img-top" alt="meals">
						<div class="card-body">
						  <h3 class="card-title">${element.strMeal}</h3>
						  <button 
						    type="button" 
						    class="btn my-btn"
						    data-bs-toggle="modal"
										  data-bs-target="#detailModal"
						    onclick="showMealDetails(${element.idMeal})">
						      More Details
						  </button>
						  <button 
						    id="main${element.idMeal}" 
						    class="btn my-btn" 
						    onclick="addRemoveToFavList(${element.idMeal})">
						      <i class="fa-solid fa-heart"></i>
						  </button>
						</div>
					      </div>
					    </div>
					  `;
				}
			});
		} else {
			// Display a message when the searched meal is not found
			html += `
				<div class="mb-4 lead">
				    The meal you are looking for is not found.
				</div>
			      `;
		}
		document.getElementById("displayMeals").innerHTML = html;
	});
}

// Function to show detailed information about a meal
async function showMealDetails(id) {
	let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
	let html = "";
	await fetchMealsFromApi(url, id).then((data) => {
		html += `
		      <div class="modal-header">
			<h1 class="modal-title fs-5" id="modalLabel">
			  ${data.meals[0].strMeal}
			</h1>
			<button
			  type="button"
			  class="btn-close"
			  data-bs-dismiss="modal"
			  aria-label="Close"
			></button>
		      </div>
		      <div class="modal-body">
			<div class="row">
			  <div class="col-sm-5 mb-3 mb-sm-0">
			    <div class="card">
			      <img
				src="${data.meals[0].strMealThumb}"
				class="card-img-top"
				alt="meal"
			      />
			    </div>
			  </div>
			  <div class="col-sm-7">
			    <div class="card">
			      <div class="card-body">
				<h5 class="card-title">Instructions</h5>
				<p class="card-text">
				  ${data.meals[0].strInstructions}
				</p>
				<a href="${data.meals[0].strYoutube}" class="btn my-btn"
				  >Watch Video</a
				>
			      </div>
			    </div>
			  </div>
			</div>
		      </div>
		    `;
	});
	document.getElementById("mealDetailedModal").innerHTML = html;
}

// Function to show the list of favorite meals
async function showFavMealList() {
	let arr = JSON.parse(localStorage.getItem("favouritesList"));
	let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
	let html = "";
	if (arr.length == 0) {
		// Display a message when the favorites list is empty
		html += `
      <div>
        No meal added in your favourites list.
      </div>
    `;
	} else {
		for (let index = 0; index < arr.length; index++) {
			await fetchMealsFromApi(url, arr[index]).then((data) => {
				html += ` 
				  <div class="card mb-2" style="width: 18rem">
				    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="meal" />
				    <div class="card-body">
				      <h5 class="card-title">${data.meals[0].strMeal}</h5>
				      <button 
					type="button" 
					class="btn my-btn"
					data-bs-toggle="modal"
					data-bs-target="#detailModal"
					onclick="showMealDetails(${data.meals[0].idMeal})">
					  More Details
				      </button>
				      <button 
					id="main${data.meals[0].idMeal}" 
					class="btn my-btn" 
					onclick="addRemoveToFavList(${data.meals[0].idMeal})">
					  <i class="fa-solid fa-heart"></i>
				      </button>
				    </div>
				  </div>
				`;
			});
		}
	}
	document.getElementById("favouritesBody").innerHTML = html;
}

// Function to add or remove a meal from the favorites list
function addRemoveToFavList(id) {
	let arr = JSON.parse(localStorage.getItem("favouritesList"));
	let contain = false;
	for (let index = 0; index < arr.length; index++) {
		if (id == arr[index]) {
			contain = true;
		}
	}
	if (contain) {
		// Remove the meal from favorites list
		let number = arr.indexOf(id);
		arr.splice(number, 1);
		alert("Meal is removed from your favourites list");
	} else {
		// Add the meal to favorites list
		arr.push(id);
		alert("Meal added to your favourites list");
	}
	localStorage.setItem("favouritesList", JSON.stringify(arr));
	showMeals();
	showFavMealList();
}
