let postBody = document.querySelector("#post-body");
let image = document.querySelector("#image");
let btnAdd = document.querySelector('#btn-add');
let postsList = document.querySelector('#posts-list');

let currentPage = 1;
let searchVal = '';

const API_Posts = 'http://localhost:8000/posts';

btnAdd.addEventListener('click', async () => {
  let post = {
    postBody: postBody.value,
    image: image.value,
    user: 1, // current user id
    likes: 0,
    views: 0,
  }

  if (!post.postBody.trim()) {
    alert("Post text is required");
    return;
  }

  await fetch(API_Posts, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(post)
  })

  postBody.value = '';
  image.value = '';

  render();
})

async function render() {
  let posts = await fetch(
    `${API_Posts}?q=${searchVal}&_page=${currentPage}&_limit=5`
  ).then((res) => res.json());

  //   console.log(posts);

  // drawPageButtons();
  postsList.innerHTML = "";

  posts.forEach((post) => {
    // console.log(post);
    let newPost = document.createElement("div");
    newPost.innerHTML = `<div class="card m-2" style="width: 50vw;">
    <img src=${post.image} class="card-img-top" alt="">
    <div class="card-body">
      <p class="card-text">${post.postBody}</p>
      <a href="#" class="btn btn-primary btn-delete" id=${post.id}>DELETE</a>
      <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" id=${post.id} class="btn btn-primary btn-edit">EDIT</a>
    </div>
  </div>`;
  postsList.append(newPost);
  });
}

render()