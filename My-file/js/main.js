// Select elements for mortgage inputs and containers
let amount = document.querySelector(".mortgage-amount input");
let amountContainer = document.querySelector(".mortgage-amount");

let year = document.querySelector(".mortgage-info .term input");
let yearContainer = document.querySelector(".mortgage-info .term");

let rate = document.querySelector(".mortgage-info .rate input");
let rateContainer = document.querySelector(".mortgage-info .rate");

let types = document.querySelectorAll(".mortgage-type input");
let typesContainer = document.querySelector(".mortgage-type");
let typeValue;

// Add click event listener to each mortgage type radio button
types.forEach((type) => {
  type.onclick = function () {
    // Remove 'clicked' class from all radio buttons
    types.forEach((t) => t.parentElement.classList.remove("clicked"));

    // Add 'clicked' class to the selected radio button
    this.parentElement.classList.add("clicked");
    typeValue = this.id;
  };
});

// Clear all inputs when the "Clear All" button is clicked
let clearAllButton = document.querySelector(".clear");

clearAllButton.onclick = function () {
  let allInputText = document.querySelectorAll("input[type='text']");
  let allInputRadio = document.querySelectorAll("input[type='radio']");

  typeValue = "";

  // Clear all text inputs
  allInputText.forEach((input) => {
    input.value = "";
  });

  // Uncheck all radio buttons and remove 'clicked' class
  allInputRadio.forEach((input) => {
    input.checked = false;
    input.parentElement.classList.remove("clicked");
  });

  clearErrors();
};

// Calculate mortgage when the "Calculate" button is clicked
let calculateButton = document.querySelector(".calc");
calculateButton.onclick = function () {
  // Reset errors before validation
  clearErrors();

  // Validate amount input
  let amountValue = amount.value;
  let amountValid = isValidNumber(amountValue);
  if (!amountValid) {
    displayError(amountContainer, "This field is required");
  }

  // Validate rate input
  let rateValue = rate.value;
  let rateValid = isValidNumber(rateValue);
  if (!rateValid) {
    displayError(rateContainer, "This field is required");
  }

  // Validate year input
  let yearValue = year.value;
  let yearValid = isValidNumber(yearValue);
  if (!yearValid) {
    displayError(yearContainer, "This field is required");
  }

  // Validate type input
  if (!typeValue) {
    displayError(typesContainer, "This field is required");
  }

  // Calculate and display results based on the selected mortgage type
  if (typeValue == "repayment" && amountValid && yearValid && rateValid) {
    let result = calculateRepaymentMortgage(amountValue, rateValue, yearValue);
    showResults(result, (result * year.value * 12).toFixed(2));
  } else if (typeValue == "interest" && amountValid && yearValid && rateValid) {
    let result = calculateInterestOnlyMortgage(amountValue, rateValue);
    showResults(result, (result * yearValue * 12).toFixed(2));
  }
};

// Function to clear all previous error messages
function clearErrors() {
  let errorMessages = document.querySelectorAll("p.error");
  errorMessages.forEach((error) => error.remove());

  let errorContainers = document.querySelectorAll(".error");
  errorContainers.forEach((container) => container.classList.remove("error"));
}

// Function to display error messages
function displayError(container, message) {
  let errorP = document.createElement("p");
  errorP.classList.add("error");
  errorP.innerHTML = message;
  container.appendChild(errorP);
  container.classList.add("error");
}

// Function to show results of the mortgage calculation
function showResults(monthlyAmount, totalAmount) {
  let resultContainer = document.querySelector(".result");
  resultContainer.innerHTML = "";
  resultContainer.classList.add("show");

  let h2Result = document.createElement("h2");
  h2Result.classList.add("title");
  h2Result.innerHTML = "Your Result";

  let pResult = document.createElement("p");
  pResult.innerHTML =
    "Your results are shown below based on the information you provided. To adjust the results, edit the form and click calculate repayments again.";

  let divInfo = document.createElement("div");
  divInfo.classList.add("info");

  let monthlyInfo = document.createElement("div");
  monthlyInfo.classList.add("monthly");
  let monthlyTitle = document.createElement("h4");
  monthlyTitle.classList.add("title");
  monthlyTitle.innerHTML = "Your monthly repayments";
  let monthlyAmountDiv = document.createElement("p");
  monthlyAmountDiv.innerHTML = `$${monthlyAmount}`;
  monthlyInfo.appendChild(monthlyTitle);
  monthlyInfo.appendChild(monthlyAmountDiv);

  let hr = document.createElement("hr");

  let totalInfo = document.createElement("div");
  totalInfo.classList.add("total");
  let totalTitle = document.createElement("h4");
  totalTitle.classList.add("title");
  totalTitle.innerHTML = "Total you'll repay over the term";
  let totalAmountDiv = document.createElement("p");
  totalAmountDiv.innerHTML = `$${totalAmount}`;
  totalInfo.appendChild(totalTitle);
  totalInfo.appendChild(totalAmountDiv);

  divInfo.appendChild(monthlyInfo);
  divInfo.appendChild(hr);
  divInfo.appendChild(totalInfo);

  resultContainer.appendChild(h2Result);
  resultContainer.appendChild(pResult);
  resultContainer.appendChild(divInfo);
}

// Function to validate if the input is a valid number
function isValidNumber(input) {
  // Regular expression to match a valid number, allowing optional sign and decimal points
  const numberRegex = /^-?\d+(\.\d+)?$/;

  // Test the input string against the regular expression
  return numberRegex.test(input);
}

// Function to calculate monthly repayment for a repayment mortgage
function calculateRepaymentMortgage(amount, rate, termYears) {
  // Convert the annual interest rate to a monthly rate
  let monthlyInterestRate = rate / 100 / 12;

  // Calculate the total number of payments (in months)
  let numberOfPayments = termYears * 12;

  // Calculate the monthly repayment using the amortization formula
  let monthlyRepayment =
    (amount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return monthlyRepayment.toFixed(2); // Returns the result rounded to 2 decimal places
}

// Function to calculate monthly payment for an interest-only mortgage
function calculateInterestOnlyMortgage(amount, rate) {
  // Convert the annual interest rate to a monthly rate
  let monthlyInterestRate = rate / 100 / 12;

  // Calculate the monthly interest-only payment
  let monthlyInterestPayment = amount * monthlyInterestRate;

  return monthlyInterestPayment.toFixed(2); // Returns the result rounded to 2 decimal places
}
