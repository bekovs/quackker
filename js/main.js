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
const API_Users = "http://localhost:8000/users";
const API_CurrentUser = "http://localhost:8000/currentUser";

// document.addEventListener("load", async () => {
//   let currentUser = await fetch(API_CurrentUser)
//     .then((data) => data.json())
//     .then((res) => {
//       res.id;
//     });
//   console.log(currentUser);
// });
// console.log(currentUser);

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
          e.currentUser = usernameSingIn.value;
          remFirst.remove();
          remSecond.remove();
          LogIn.setAttribute(`data-bs-dismiss`, `modal`);
          profile.style.display = `block`;
          profile.innerHTML = e.username;
        } else {
          return;
        }
      });
    });
});
