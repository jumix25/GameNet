const posts = document.querySelectorAll('.post');

posts.forEach((post, index) => {
  post.style.animationDelay = `${index * 120}ms`;
  post.classList.add('show-post');
});

console.log('GameNet Beta loaded');
