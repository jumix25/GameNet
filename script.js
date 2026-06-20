import { createPost, listenToPosts } from "./firebase.js";

const postForm = document.querySelector("#post-form");
const usernameInput = document.querySelector("#post-username");
const textInput = document.querySelector("#post-text");
const feed = document.querySelector("#posts-feed");
const statusText = document.querySelector("#post-status");

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

console.log("GameNet Posts Beta loaded");
