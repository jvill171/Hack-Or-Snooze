"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

//Toggle active class for CSS to update 
//on Submit, Favorites, and My Stories
function toggleActiveNav(target){
  console.debug("toggleActiveNav");
  $("#nav-items a").removeClass("active");
  target.classList.toggle("active")
}

// Navbar's "submit" option
// Opens form to submit a new post
function navSubmitClick(evt){
  console.debug("navSubmitClick", evt);
  toggleActiveNav(evt.target);
  hidePageComponents();
  $newPostForm.show();
  $allStoriesList.show();
}

$body.on("click", "#navbar-submit", navSubmitClick)

// Navbar's "favorite" option
// Loads user's favorited stories
function navFavClick(evt){
  // console.debug("navFavClick", evt);
  toggleActiveNav(evt.target);
  hidePageComponents();
  putFavoritesOnPage();
  $favStories.show();
}

$body.on("click", "#navbar-favorites", navFavClick)

// Navbar's "My Stories" option
// Loads user's created stories
function navMyStoriesClick(evt){
  // console.debug("navMyStoriesClick", evt);
  toggleActiveNav(evt.target);
  hidePageComponents();
  putMyStoriesOnPage();
  $myStories.show();
}

$body.on("click", "#navbar-myStories", navMyStoriesClick)

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  $("#nav-items a").removeClass("active");
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
