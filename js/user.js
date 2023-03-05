"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  try{
    currentUser = await User.signup(username, password, name);

    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
  }
  catch(err){
    if(err.response.status === 409){
      alert("This username has already been taken!");
    }
  }
  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
  hidePageComponents(); //Hide login form after login
  putStoriesOnPage();
  $("#nav-items").show();
  $allStoriesList.show();

  updateNavOnLogin();
}

//Updates displayed Username/Name to display current username/name
function updateProfileHTML(){
  console.debug("updateProfileHTML")
  const $profileUsername = 
    $("<span>").text(`${currentUser.username}`)
      .css("font-weight", "normal");
  
      $('#profile-username').text(`Username: `).append($profileUsername)

  $('#profile-curName').text(`Current name: `)
    .append($("<span>").text(`${currentUser.name}`)
    .css("font-weight", "normal"));
}

//Update Name on profile
async function updateName(){
  console.debug("updateName")
  const newName = $("#new-name").val();
  
  //Update displayed name only after API has been updated
  let nameUpdate = await currentUser.updateUserData("name", newName);
  if(!nameUpdate){
    updateProfileHTML();
    $("#new-name").val("");
  }
}

$body.on("click", '#update-name-btn', updateName)

//Update Password on profile
function updatePassword(){
  console.debug("updatePassword")
  
  const newPass = $("#new-password").val();
  const confirmPass = $("#confirm-password").val();
  
  //One or Both password fields are empty
  if( newPass === '' || confirmPass === ''){
    alert("Please fill out both PASSWORD and CONFIRM fields with a matching password.")
  }
  //Passwords DO match
  else if(newPass === confirmPass){
    if(newPass.length < 4){
      alert("Password must be at least 4 characters long!")
    }
    else{
      currentUser.updateUserData("password", newPass);
      $("#new-password").val("");
      $("#confirm-password").val("");
      alert("Password updated!");
    }
  }
  //Passwords DONT match
  else{
    alert("PASSWORD and CONFIRM must be matching passwords.")
  }
  
}

$body.on("click", '#update-password-btn', updatePassword)