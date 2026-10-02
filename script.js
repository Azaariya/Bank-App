let users = JSON.parse(localStorage.getItem("users")) || [];

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let transactions = currentUser ? currentUser.transactions : [];
const usernameElement = document.getElementById("username");
const accountElement = document.getElementById("account-number");
const depositInput = document.getElementById("deposit-input")
const balanceElement = document.getElementById("balance");
balanceElement.innerHTML = currentUser ? `$${currentUser.balance}` : "$0";
const withdrawInput = document.getElementById("withdraw-input")


function deposit() {
  if (!currentUser) {
    alert("Please login first");
    return;
  }
  const amount = Number(depositInput.value)
  if (amount > 0) {
    currentUser.balance += amount;
    balanceElement.innerHTML = `$${currentUser.balance}`;
    depositInput.value = "";
    addTransaction(`Deposit: +$${amount}`, amount);
    saveData();
  } else {
    alert('Enter a valid amount.')
  }

}
function withdraw() {
  if (!currentUser) {
    alert("Please login first");
    return;
  }
  const amount = Number(withdrawInput.value)

  if (amount > 0 && amount <= currentUser.balance) {
    currentUser.balance -= amount;
    balanceElement.innerHTML = `$${currentUser.balance}`;
    withdrawInput.value = "";
    addTransaction(`withdraw: -$${amount}`, amount);
    saveData();
  } else {
    alert("Invalid amount or insufficient balance.");
  }

}
document.getElementById("withdraw-btn").onclick = withdraw;

function addTransaction(text, amount) {
  const transactionList = document.getElementById("transaction-list");
  const transaction = document.createElement("div")
  transaction.classList.add("transaction");
  const timeStatus = document.createElement("p")
  timeStatus.classList.add("time");

  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const formattedMinute = minute.toString().padStart(2, "0");

  let period;

  if (hour >= 12) {
    period = "PM";
  } else {
    period = "AM";
  }

  let displayHour = hour % 12;

  if (displayHour === 0) {
    displayHour = 12;
  }
  const time = displayHour + ":" + formattedMinute + " " + period;
  transaction.innerText = text;
  timeStatus.innerText = time;
  transaction.appendChild(timeStatus)
  transactionList.appendChild(transaction);
  currentUser.transactions.push({
    type: text,
    amount: amount,
    time: time

  })
  saveData();
}
function saveData() {

  localStorage.setItem(
    "currentUser",
    JSON.stringify(currentUser)
  );


  let index = users.findIndex(function (user) {
    return user.username === currentUser.username;
  });


  if (index !== -1) {
    users[index] = currentUser;
  }


  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );

}
function loadTransactions() {
  const transactionList = document.getElementById("transaction-list");
  transactionList.innerHTML = "";
  for (let i = 0; i < transactions.length; i++) {
    const transaction = document.createElement("div")
    transaction.classList.add("transaction");
    const timeStatus = document.createElement("p")
    timeStatus.classList.add("time");

    transaction.innerText = transactions[i].type;
    timeStatus.innerText = transactions[i].time;

    transaction.appendChild(timeStatus);
    transactionList.appendChild(transaction);
  }
}
loadTransactions();
document.getElementById("clear-history").onclick = function () {

  if (!currentUser) {
    alert("Please login first");
    return;
  }

  currentUser.transactions = [];

  transactions = [];

  loadTransactions();

  saveData();
}
// function createAccount() {
//   const name = prompt("Enter your name:")
//   if (name !== null && name.trim() !== "") {
//     user.username = name;
//     user.accountNumber = "ST" + Math.floor(Math.random() * 1000000);
//     saveData();

//     usernameElement.innerText = user.username;
//     accountElement.innerText = user.accountNumber;
//   }
// }
function createAccount() {

  const username =
    document.getElementById("new-username").value;

  const password =
    document.getElementById("new-password").value;
  let exists = users.find(function (user) {
    return user.username === username;
  });

  if (exists) {
    alert("Username already exists.");
    return;
  }

  if (username === "" || password === "") {

    alert("Fill all fields.");

    return;

  }

  let newUser = {

    username: username,
    password: password,
    accountNumber: "ST" + Math.floor(Math.random() * 1000000),
    balance: 0,
    transactions: []

  };

  users.push(newUser);

  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );

  alert("Account created successfully!");
  document.getElementById("new-username").value = "";
  document.getElementById("new-password").value = "";

  showLogin();

}
function login() {

  const username =
    document.getElementById("login-username").value;

  const password =
    document.getElementById("login-password").value;


  let foundUser = users.find(function (user) {

    return user.username === username &&
      user.password === password;

  });


  if (foundUser) {

    currentUser = foundUser;


    localStorage.setItem(
      "currentUser",
      JSON.stringify(currentUser)
    );


    alert("Login successful");
    document.getElementById("login-page").style.display = "none";

    document.getElementById("bank-app").style.display = "block";
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";

    usernameElement.innerText = currentUser.username;
    accountElement.innerText = currentUser.accountNumber;
    balanceElement.innerHTML = `$${currentUser.balance}`;
    transactions = currentUser.transactions;
    loadTransactions();
  } else {

    alert("Wrong username or password");

  }

}
function logout() {

  currentUser = null;
  transactions = [];
  localStorage.removeItem("currentUser");


  usernameElement.innerText = "";
  accountElement.innerText = "";
  balanceElement.innerHTML = "$0";
  document.getElementById("transaction-list").innerHTML = "";
  document.getElementById("bank-app").style.display = "none";

  document.getElementById("login-page").style.display = "block";

  alert("Logged out");

}
if (currentUser) {

  usernameElement.innerText = currentUser.username;

  accountElement.innerText = currentUser.accountNumber;

  balanceElement.innerHTML = `$${currentUser.balance}`;

  transactions = currentUser.transactions;

  loadTransactions();

  document.getElementById("login-page").style.display = "none";

  document.getElementById("bank-app").style.display = "block";

}
function showCreateAccount() {

  document.getElementById("login-page").style.display = "none";

  document.getElementById("create-page").style.display = "block";

}

function showLogin() {

  document.getElementById("create-page").style.display = "none";

  document.getElementById("login-page").style.display = "block";

}
// function checkLogin() {

//   if (!currentUser) {
//     document.querySelector(".actions").style.display = "none";
//   } else {
//     document.querySelector(".actions").style.display = "flex";
//   }

// }
// checkLogin();