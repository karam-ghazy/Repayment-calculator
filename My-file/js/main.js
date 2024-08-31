let amount = document.querySelector(".mortgage-amount input");
let amountContainer = document.querySelector(".mortgage-amount");

let year = document.querySelector(".mortgage-info .term input");
let yearContainer = document.querySelector(".mortgage-info .term ");

let rate = document.querySelector(".mortgage-info .rate input");
let rateContainer = document.querySelector(".mortgage-info .rate");

let types = document.querySelectorAll(".mortgage-type input");
let typesContainer = document.querySelector(".mortgage-type ");
let typeValue;

types.forEach((type) => {
  type.onclick = function () {
    for (let i = 0; i < types.length; i++)
      types[i].parentElement.classList.remove("clicked");
    this.parentElement.classList.add("clicked");
    typeValue = this.id;
  };
});

let calculateButton = document.querySelector(".calc");
calculateButton.onclick = function () {
  //reset to default before check
  clearErrors();

  let amountValue = amount.value;
  let amountValid = isValidNumber(amountValue);
  if (!amountValid) {
    let amountP = document.createElement("p");
    amountP.classList.add("error");
    amountP.innerHTML = "This field is required";
    amountContainer.appendChild(amountP);
    amountContainer.classList.add("error");
  }

  let rateValue = rate.value;
  let rateValid = isValidNumber(rateValue);
  if (!rateValid) {
    let rateP = document.createElement("p");
    rateP.classList.add("error");
    rateP.innerHTML = "This field is required";
    rateContainer.appendChild(rateP);
    rateContainer.classList.add("error");
  }

  let yearValue = year.value;
  let yearValid = isValidNumber(yearValue);

  if (!typeValue) {
    let typeP = document.createElement("p");
    typeP.classList.add("error");
    typeP.innerHTML = "This field is required";
    typesContainer.appendChild(typeP);
    typesContainer.classList.add("error");
  }

  if (typeValue == "repayment") {
    if (!yearValid) {
      let yearP = document.createElement("p");
      yearP.classList.add("error");
      yearP.innerHTML = "This field is required";
      yearContainer.appendChild(yearP);
      yearContainer.classList.add("error");
    } else {
      let result = calculateRepaymentMortgage(
        amountValue,
        rateValue,
        yearValue
      );
      showResults(result, result * year.value * 12);
    }
  } else if (typeValue == "interest") {
    let result = calculateInterestOnlyMortgage(amountValue, rateValue);
    showResults(result, result * yearValue * 12);
  }
};

//////////////////

// Function to clear all previous error messages
function clearErrors() {
  let errorMessages = document.querySelectorAll("p.error");
  errorMessages.forEach((error) => error.remove());

  let errorContainers = document.querySelectorAll(".error");
  errorContainers.forEach((container) => container.classList.remove("error"));
}

function showResults(monthlyAmount, totalAmount) {
  let resultContainer = document.querySelector(".result");
  resultContainer.innerHTML = "";
  resultContainer.classList.add("show");

  let h2Result = document.createElement("h2");
  h2Result.classList.add("title");
  h2Result.innerHTML = "Your Result";

  let pResult = document.createElement("p");
  pResult.innerHTML =
    "Your results are shown below based on the information you provided. To adjust the results, editthe form and click calculate repayments again.";

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

function isValidNumber(input) {
  // Regular expression to match a valid number, allowing optional sign and decimal points
  const numberRegex = /^-?\d+(\.\d+)?$/;

  // Test the input string against the regular expression
  return numberRegex.test(input);
}

function calculateRepaymentMortgage(amount, rate, termYears) {
  // Convert the annual interest rate to a monthly rate
  let monthlyInterestRate = rate / 100 / 12;

  // Calculate the total number of payments (in months)
  let numberOfPayments = termYears * 12;

  // Calculate the monthly repayment using the formula
  let monthlyRepayment =
    (amount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return monthlyRepayment.toFixed(2); // Returns the result rounded to 2 decimal places
}

function calculateInterestOnlyMortgage(amount, rate) {
  // Convert the annual interest rate to a monthly rate
  let monthlyInterestRate = rate / 100 / 12;

  // Calculate the monthly interest-only payment
  let monthlyInterestPayment = amount * monthlyInterestRate;

  return monthlyInterestPayment.toFixed(2); // Returns the result rounded to 2 decimal places
}
