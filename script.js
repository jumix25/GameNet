import {
  createAccount,
  loginAccount,
  logoutAccount,
  listenToAccount,
  createPost,
  listenToPosts
} from "./firebase.js";

const accountEmailInput = document.querySelector("#account-email");
const accountPasswordInput = document.querySelector("#account-password");
const accountStatus = document.querySelector("#account-status");
const registerButton = document.querySelector("#register-button");
const loginButton = document.querySelector("#login-button");
const logoutButton = document.querySelector("#logout-button");

const postForm = document.querySelector("#post-form");
const usernameInput = document.querySelector("#post-username");
const textInput = document.querySelector("#post-text");
const feed = document.querySelector("#posts-feed");
const statusText = document.querySelector("#post-status");

function getAccountFormData() {
  return {
    email: accountEmailInput.value,
    password: accountPasswordInput.value
  };
}

if (registerButton) {
  registerButton.addEventListener("click", async () => {
    try {
      accountStatus.textContent = "Account wird erstellt ...";
      await createAccount(getAccountFormData());
      accountStatus.textContent = "Account wurde erstellt.";
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
      accountStatus.textContent = "Du bist angemeldet.";
    } catch (error) {
      console.error(error);
      accountStatus.textContent = "Anmeldung fehlgeschlagen.";
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      await logoutAccount();
      accountStatus.textContent = "Du bist abgemeldet.";
    } catch (error) {
      console.error(error);
      accountStatus.textContent = "Abmelden fehlgeschlagen.";
    }
  });
}

listenToAccount((user) => {
  if (!accountStatus) return;

  if (user) {
    accountStatus.textContent = `Angemeldet als ${user.email}`;
  } else {
    accountStatus.textContent = "Nicht angemeldet.";
  }
});

function renderPost(post) {
  const username = post.username || "gamenet_user";
  const text = post.text || "";

  return `
    <div class="post">
      <strong>@${escapeHtml(username)}</strong>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

function renderPosts(posts) {
  if (!feed) return;

  if (!posts.length) {
    feed.innerHTML = `
      <div class="post">
        <strong>@gamenet</strong>
        <p>Noch keine Posts. Schreibe den ersten GameNet-Post!</p>
      </div>
    `;
    return;
  }

  feed.innerHTML = posts.map(renderPost).join("");

  document.querySelectorAll(".post").forEach((post, index) => {
    post.style.animationDelay = `${index * 120}ms`;
    post.classList.add("show-post");
  });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

if (postForm) {
  postForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value;
    const text = textInput.value;

    try {
      statusText.textContent = "Post wird gesendet ...";
      await createPost({ username, text });
      textInput.value = "";
      statusText.textContent = "Post wurde veröffentlicht.";
    } catch (error) {
      console.error(error);
      statusText.textContent = "Post konnte nicht gespeichert werden. Prüfe Firebase/Firestore-Regeln.";
    }
  });
}

listenToPosts(renderPosts);

console.log("GameNet Accounts und Posts Beta loaded");
