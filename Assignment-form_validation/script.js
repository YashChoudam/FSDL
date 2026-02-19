const form = document.getElementById("studentForm");

const nameInput = document.getElementById("name");
const prnInput = document.getElementById("prn");
const emailInput = document.getElementById("email");

const nameError = document.getElementById("nameError");
const prnError = document.getElementById("prnError");
const emailError = document.getElementById("emailError");
const successMsg = document.getElementById("successMsg");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  nameError.textContent = "";
  prnError.textContent = "";
  emailError.textContent = "";
  successMsg.textContent = "";

  const nameValue = nameInput.value.trim();
  const prnValue = prnInput.value.trim();
  const emailValue = emailInput.value.trim();

  let isValid = true;

  // Name: only letters and spaces
  if (!/^[A-Za-z ]+$/.test(nameValue)) {
    nameError.textContent = "Name should contain only letters.";
    isValid = false;
  }

  // PRN: only numbers
  if (!/^\d+$/.test(prnValue)) {
    prnError.textContent = "PRN should contain only numbers.";
    isValid = false;
  }

  // Email: basic valid email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    emailError.textContent = "Please enter a valid email.";
    isValid = false;
  }

  if (isValid) {
    successMsg.textContent = "Form submitted successfully.";
    form.reset();
  }
});
