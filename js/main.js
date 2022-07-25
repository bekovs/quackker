let username = document.querySelector("#username");
let password = document.querySelector("#password");
let submit = document.querySelector("#submit");
let usernameSingIn = document.querySelector("#usernameSignIn");
let passwordSignIn = document.querySelector("#passwordSignIn");
let remFirst = document.querySelector(".remFirst");
let remSecond = document.querySelector(".remSecond");
let LogIn = document.querySelector("#LogIn");
let logout = document.querySelector("#logout-submit");
console.log(logout);
let profile = document.querySelector(".profile");
let profileBtn = document.querySelector(".profile-btn");
let loginNav = document.querySelector(".login");
let helloHead = document.querySelector(".hello");

let postBody = document.querySelector("#post-body");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");
let postsList = document.querySelector("#posts-list");

let editPost = document.querySelector("#edit-post-body");
let editImage = document.querySelector("#edit-image");
let btnSaveEdit = document.querySelector("#btn-save-edit");
let searchInp = document.querySelector("#searchInp");
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

// helloHead.innerText += " " + currentUser.name

if (currentUser) {
  remFirst.remove();
  remSecond.remove();
  profile.style.display = `block`;
  profileBtn.style.display = `block`;
  profile.innerHTML = currentUser.name;
}

btnAdd.addEventListener("click", async () => {
  let post = {
    postBody: postBody.value,
    image: image.value,
    user: currentUser.id, // current user id
    likes: [],
    views: 0,
    date: new Date(),
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
  drawPageButtons();
  //   console.log(posts);

  // drawPageButtons();
  postsList.innerHTML = "";

  posts.forEach(async (post) => {
    let newPost = document.createElement("div");
    let heart = "heart.svg";
    if (currentUser && post.likes) {
      post.likes.forEach((user) => {
        if (user.id == currentUser.id) {
          heart = "heart-fill.svg";
        }
      });
    }
    newPost.innerHTML = `<div class="card m-2" style="width: 50vw;">
      <img src=${post.image} class="card-img-top" alt="">
      <div class="card-body">
        <p class="card-text">${post.postBody}</p>
        <br>
        <p class="card-text postedby">post by ${await getUserName(
          post.user
        )}</p>
        <div class="d-flex justify-content-between">
          <div class="likes-and-views">
            <a href="#" class="like-heart" id="${
              post.id
            }"><img class="like-heart" id="${
      post.id
    }" src="./assets/icons/${heart}"></a>
            <a href="#" class="likes" id="${post.id}">${post.likes.length}</a>
            <span class="views" id="${post.id}">views</span>
            <span class="views-count" id="${post.id}">1</span>
          </div>
        <p class="card-text postedby">post by ${await getUserName(
          post.user
        )}</p>
        <div class="d-flex justify-content-end">
          <div>
            <a href="#" class="btn btn-primary btn-delete" id=${
              post.id
            }>DELETE</a>
            <a href="#" data-bs-toggle="modal" data-bs-target="#editModal" id=${
              post.id
            } class="btn btn-primary btn-edit">EDIT</a>
          </div>
        </div>
      </div>
    </div>
  `;
    postsList.append(newPost);
  });
}
searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  currentPage = 1;
  render();
});
// ?pagination
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let paginationList = document.querySelector(".pagination-list");

let pageTotalCount = 1;
function drawPageButtons() {
  fetch(`${API_Posts}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.length);
      pageTotalCount = Math.ceil(data.length / 4);
      paginationList.innerHTML = ``;
      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page = document.createElement("li");
          paginationList.append(page);
          page.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
        } else {
          let page = document.createElement("li");
          paginationList.append(page);
          page.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
        }
      }
      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }
      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

prev.addEventListener("click", (e) => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

next.addEventListener("click", (e) => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.innerText;
    render();
  }
});
render();
function getUserName(id) {
  let res = fetch(`${API_Users}/${id}`)
    .then((data) => data.json())
    .then((result) => {
      return result.username;
    });
  return res;
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

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("like-heart")) {
    e.target.src = "./assets/icons/heart-fill.svg";
    let post = await fetch(`${API_Posts}/${e.target.id}`).then((data) =>
      data.json()
    );
    likesArr = [];
    post.likes.forEach((user) => {
      likesArr.push(user);
    });
    console.log(likesArr);
    let checkForLiked = false;
    likesArr.forEach((user) => {
      if (user.id == currentUser.id) {
        checkForLiked = true;
      }
    });

    if (!checkForLiked) {
      likesArr.push(currentUser);
    }

    let likes = {
      likes: likesArr,
    };

    fetch(`${API_Posts}/${e.target.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(likes),
    });
  }
});

logout.addEventListener("click", () => {
  localStorage.clear();
  window.location.reload();
});

render();
