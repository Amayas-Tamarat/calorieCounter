const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

function cleanInputString(str) {
    return str.replace(/[+-\s]/g, '');
}

function isInvalidInput(str) {
    return str.match(/\d+e\d+/i);
}

function addEntry(e) {
    const category = e.target.getAttribute("data-category");
    const targetInputContainer = document.querySelector(`#${category} .input-container`);
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    const HTMLString = `
  <label for="${category}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${category}-${entryNumber}-name" placeholder="Name" />
  <label for="${category}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${category}-${entryNumber}-calories"
    placeholder="Calories"
    class="calorie-input"
  />`;
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);

    // Attach live update for new input
    targetInputContainer.querySelectorAll('.calorie-input').forEach(input => {
        input.addEventListener('input', calculateCalories);
    });
}

function calculateCalories(e) {
    if (e) e.preventDefault();
    isError = false;

    const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
    const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
    const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
    const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
    const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");

    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

    if (isError) {
        return;
    }

    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

    output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

    output.classList.remove('hide');
}

function getCaloriesFromInputs(list) {
    let calories = 0;
    for (const item of list) {
        const currVal = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(currVal);

        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        calories += Number(currVal) || 0;
    }
    return calories;
}

function clearForm() {
    document.querySelectorAll('.input-container').forEach(container => container.innerHTML = '');
    budgetNumberInput.value = '';
    output.innerText = '';
    output.classList.add('hide');
}

// Attach event listeners for each "Add Entry" button
document.querySelectorAll(".add-entry").forEach(button => {
    button.addEventListener("click", addEntry);
});

calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
budgetNumberInput.addEventListener("input", calculateCalories);
document.querySelectorAll('.calorie-input').forEach(input => input.addEventListener('input', calculateCalories));
