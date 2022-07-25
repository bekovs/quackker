let username = document.querySelector("#username");
let password = document.querySelector("#password");
let submit = document.querySelector("#submit");
let usernameSingIn = document.querySelector("#usernameSignIn");
let passwordSignIn = document.querySelector("#passwordSignIn");
let remFirst = document.querySelector(".remFirst");
let remSecond = document.querySelector(".remSecond");
let LogIn = document.querySelector("#LogIn");
let profile = document.querySelector(".profile");
let loginNav = document.querySelector(".login");

let postBody = document.querySelector("#post-body");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");
let postsList = document.querySelector("#posts-list");

let editPost = document.querySelector("#edit-post-body");
let editImage = document.querySelector("#edit-image");
let btnSaveEdit = document.querySelector("#btn-save-edit");

let currentPage = 1;
let searchVal = "";

const API_Posts = "http://localhost:8000/posts";
const API_Users = "http://localhost:8000/users";
const API_CurrentUser = "http://localhost:8000/currentUser";

submit.addEventListener("click", async () => {
  let obj = {
    username: username.value,
    password: password.value,
  };
  if (!obj.username.trim() || !obj.password.trim()) {
    alert("fill the form full");
    return;
  }
  await fetch(API_Users, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-type": "application/json; charset = utf-8",
    },
  });
});

LogIn.addEventListener("click", () => {
  fetch(API_Users)
    .then((data) => data.json())
    .then((res) => {
      //   console.log(res);
      res.forEach((e) => {
        if (
          usernameSingIn.value == e.username &&
          passwordSignIn.value == e.password
        ) {
          let user = {
            id: e.id,
            name: e.username,
          };
          localStorage.setItem("currentUser", JSON.stringify(user));
          LogIn.setAttribute(`data-bs-dismiss`, `modal`);
          LogIn.addEventListener("click", () => {
            window.location.reload();
          });
        } else {
          return;
        }
      });
    });
});

let currentUser = JSON.parse(localStorage.getItem("currentUser"));
console.log(currentUser);

if (currentUser) {
  remFirst.remove();
  remSecond.remove();
  profile.style.display = `block`;
  profile.innerHTML = currentUser.name;
}

btnAdd.addEventListener("click", async () => {
  let post = {
    postBody: postBody.value,
    image: image.value,
    user: 1, // current user id
    likes: 0,
    views: 0,
  };

  if (!post.postBody.trim()) {
    alert("Post text is required");
    return;
  }

  await fetch(API_Posts, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(post),
  });

  postBody.value = "";
  image.value = "";

  render();
});

async function render() {
  let posts = await fetch(
    `${API_Posts}?q=${searchVal}&_page=${currentPage}&_limit=5`
  ).then((res) => res.json());

  //   console.log(posts);

  // drawPageButtons();
  postsList.innerHTML = "";

  posts.forEach((post) => {
    let newPost = document.createElement("div");
    newPost.innerHTML = `<div class="card m-2" style="width: 50vw;">
    <img src=${post.image} class="card-img-top" alt="">
    <div class="card-body">
      <p class="card-text">${post.postBody}</p>
      <a href="#" class="btn btn-primary btn-delete" id=${post.id}>DELETE</a>
      <a href="#" data-bs-toggle="modal" data-bs-target="#editModal" id=${post.id} class="btn btn-primary btn-edit">EDIT</a>
    </div>
  </div>`;
    postsList.append(newPost);
  });
}
// delete
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let answer = confirm("Are you sure?");

    if (answer) {
      let id = e.target.id;
      await fetch(`${API_Posts}/${id}`, {
        method: "DELETE",
      });
      render();
    }
  }
});

// edit
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API_Posts}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editPost.value = data.postBody;
        editImage.value = data.image;
        btnSaveEdit.setAttribute("id", data.id);
      });
  }
});

btnSaveEdit.addEventListener("click", (e) => {
  let id = e.target.id;
  let edittedPost = {
    postBody: editPost.value,
    image: editImage.value,
  };
  saveEdit(edittedPost, id);
});

function saveEdit(edittedPost, id) {
  fetch(`${API_Posts}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(edittedPost),
  }).then(() => {
    render();
  });
}

render()
