"use strict";

// Data
const account1 = {
  owner: "Trang Nguyen",
  movements: [400, 250, -100, 2000, -450, -530, 700, 3000],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2021-07-18T21:31:17.178Z",
    "2021-07-23T07:42:02.383Z",
    "2021-07-28T09:15:04.904Z",
    "2021-07-01T10:17:24.185Z",
    "2021-07-08T14:11:59.604Z",
    "2021-08-04T17:01:17.194Z",
    "2021-08-05T23:36:17.929Z",
    "2021-08-06T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "de-DE",
};

const account2 = {
  owner: "Harry Potter",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2021-07-18T21:31:17.178Z",
    "2021-07-23T07:42:02.383Z",
    "2021-07-28T09:15:04.904Z",
    "2021-07-01T10:17:24.185Z",
    "2021-07-08T14:11:59.604Z",
    "2021-08-04T17:01:17.194Z",
    "2021-08-05T23:36:17.929Z",
    "2021-08-06T10:51:36.790Z",
  ],
  currency: "GBP",
  locale: "en-GB",
};

const account3 = {
  owner: "Hermione Granger",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2021-07-18T21:31:17.178Z",
    "2021-07-23T07:42:02.383Z",
    "2021-07-28T09:15:04.904Z",
    "2021-07-01T10:17:24.185Z",
    "2021-07-08T14:11:59.604Z",
    "2021-08-04T17:01:17.194Z",
    "2021-08-05T23:36:17.929Z",
    "2021-08-06T10:51:36.790Z",
  ],
  currency: "GBP",
  locale: "en-GB",
};

const account4 = {
  owner: "Gerry Costello",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2021-07-01T10:17:24.185Z",
    "2021-07-08T14:11:59.604Z",
    "2021-08-04T17:01:17.194Z",
    "2021-08-05T23:36:17.929Z",
    "2021-08-06T10:51:36.790Z",
  ],
  currency: "GBP",
  locale: "en-GB",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//! Functions
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// Computing usernames for each account owner. I want to make the short input od the username is just the first letter of the name. This function is not return anything because I want to create the side effects that to add the username to the account object using the name of the owner

const createUserNames = (accs) => {
  accs.forEach((acc) => {
    return (acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((str) => str[0])
      .join(""));
  });
};

createUserNames(accounts);

// Displaying the deposit and withdrawal

const displayMovements = function (acc, sort = false) {
  // .textContent = 0
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}"> ${
      i + 1
    } ${type}</div>

          <div class="movements__date">${displayDate}</div>

          <div class="movements__value">${formattedMov}</div>
        </div>
      
      `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Display  account balance

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

// Display summary amount of deposit and withdrawal

const calDisplaySummary = (acc) => {
  // income
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  //outcome
  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  //interest

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

// Update UI

const updateUI = (acc) => {
  // Display movements

  displayMovements(acc);

  // Display balance

  calcDisplayBalance(acc);

  //Display summary

  calDisplaySummary(acc);
};

const startLogOutTimer = () => {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI

    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log into get started";
      containerApp.style.opacity = 0;
    }

    // Decreasing 1 second

    time--;
  };
  // Set time to 1 minutes

  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
//! Implementing the Login feature
///////////////////////////////////////////////////////
// Add Event handler
let currentAccount;
let timer;

// Fake login

// currentAccount = account4;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experiment API

btnLogin.addEventListener("click", function (e) {
  // prevent form from submitting
  e.preventDefault();

  // check username

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // check pin

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;

    // Creating current date and time

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}/, ${hour}:${min}`;

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input field

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

// Implement operation

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // clear input

  inputTransferAmount.value = inputTransferTo.value = "";

  // check

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Adding transfer day

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset the timer

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Loan

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some((mov) => mov >= mov * 0.1)) {
    setTimeout(function () {
      // add movement

      currentAccount.movements.push(amount);

      // Adding loan day

      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI

      updateUI(currentAccount);
    }, 2500);
  }

  // Reset the timer

  clearInterval(timer);
  timer = startLogOutTimer();

  // clear input field

  inputLoanAmount.value = "";
});

// Close account

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  // check if the username and the pin are correct

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // find Index
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // remove account
    accounts.splice(index, 1);

    // hide UI

    containerApp.style.opacity = 0;
    inputTransferAmount.value = inputTransferTo.value = "";
  }
});

// sort

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;
const movementsUSD = movements.map((mov) => mov * eurToUsd);
console.log(movements);
console.log(movementsUSD);
const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? "deposited" : "withdrawal"} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescriptions);

// get the maximum value with reduce

const max = movements.reduce((acc, cur) => {
  if (acc > cur) return acc;
  else return cur;
}, movements[0]);
console.log(max);

// find()

const firstWithdrawal = (movements) => {
  console.log(movements.find((mov) => mov < 0));
};
firstWithdrawal(movements);

const findAccount = accounts.find((acc) => acc.owner === "Trang Nguyen");
console.log(findAccount);

// date

// const now = new Date();
// console.log(now);
// console.log(new Date(account1.movementsDates[0]));

// setInterval

// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000);
