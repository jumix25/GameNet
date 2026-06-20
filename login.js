import {
  createAccount,
  loginAccount,
  listenToAccount
} from "./firebase.js";

const accountEmailInput = document.querySelector("#account-email");
const accountPasswordInput = document.querySelector("#account-password");
const accountStatus = document.querySelector("#account-status");
const registerButton = document.querySelector("#register-button");
const loginButton = document.querySelector("#login-button");

function getAccountFormData() {
  return {
    email: accountEmailInput.value,
    password: accountPasswordInput.value
  };
}

function goToApp() {
  window.location.href = "app.html";
}

if (registerButton) {
  registerButton.addEventListener("click", async () => {
    try {
      accountStatus.textContent = "Account wird erstellt ...";
      await createAccount(getAccountFormData());
      accountStatus.textContent = "Account wurde erstellt. Du wirst weitergeleitet ...";
      goToApp();
    } catch (error) {
      console.error(error);
      accountStatus.textContent = "Account konnte nicht erstellt werden. Prüfe E-Mail, Passwort und Firebase Auth.";
    }
  });
}

if (loginButton) {
  loginButton.addEventListener("click", async () => {
    try {
      accountStatus.textContent = "Anmeldung läuft ...";
      await loginAccount(getAccountFormData());
      accountStatus.textContent = "Du bist angemeldet. Du wirst weitergeleitet ...";
      goToApp();
    } catch (error) {
      console.error(error);
      accountStatus.textContent = "Anmeldung fehlgeschlagen.";
    }
  });
}

listenToAccount((user) => {
  if (user) {
    goToApp();
  }
});
