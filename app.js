import {
  logoutAccount,
  listenToAccount,
  createPost,
  listenToPosts
} from "./firebase.js";

const currentUser = document.querySelector("#current-user");
const logoutButton = document.querySelector("#logout-button");
const postForm = document.querySelector("#post-form");
const usernameInput = document.querySelector("#post-username");
const textInput = document.querySelector("#post-text");
const feed = document.querySelector("#posts-feed");
const statusText = document.querySelector("#post-status");

let activeUserEmail = null;

listenToAccount((user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  activeUserEmail = user.email;
  const username = user.email.split("@")[0];
  currentUser.textContent = username;
  usernameInput.value = username;
});

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    await logoutAccount();
    window.location.href = "login.html";
  });
}

function renderMessage(post) {
  const username = post.username || "gamenet_user";
  const text = post.text || "";

  return `
    <article class="message-card">
      <div class="avatar tiny">${escapeHtml(username.slice(0, 2).toUpperCase())}</div>
      <div>
        <strong>@${escapeHtml(username)}</strong>
        <p>${escapeHtml(text)}</p>
      </div>
    </article>
  `;
}

function renderPosts(posts) {
  if (!feed) return;

  if (!posts.length) {
    feed.innerHTML = `
      <article class="message-card">
        <div class="avatar tiny">GN</div>
        <div>
          <strong>@gamenet</strong>
          <p>Noch keine Posts. Schreibe die erste Nachricht in GameNet.</p>
        </div>
      </article>
    `;
    return;
  }

  feed.innerHTML = posts.map(renderMessage).join("");
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

    try {
      statusText.textContent = "Nachricht wird gesendet ...";
      await createPost({
        username: usernameInput.value || activeUserEmail || "gamenet_user",
        text: textInput.value
      });
      textInput.value = "";
      statusText.textContent = "Gesendet.";
    } catch (error) {
      console.error(error);
      statusText.textContent = "Nachricht konnte nicht gespeichert werden.";
    }
  });
}

listenToPosts(renderPosts);
