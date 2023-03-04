"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */


// Navbar's "submit" option
// Opens form to submit a new post
function navSubmitClick(evt){
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $newPostForm.show();
  $allStoriesList.show();
}

$body.on("click", "#navbar-submit", navSubmitClick)

// Navbar's "favorite" option
// Loads user's favorited stories
function navFavClick(evt){
  // console.debug("navFavClick", evt);
  hidePageComponents();
  putFavoritesOnPage();
  $favStories.show();
}

$body.on("click", "#navbar-favorites", navFavClick)

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
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
