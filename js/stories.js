"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //If user logged in - show favSymb
  const isSignedIn = Boolean(currentUser);
  //If active section is myStories
  const isMyStories = $('.active').closest('a').attr("id") === "navbar-myStories";
  
  return $(`
      <li id="${story.storyId}">
        </div>  
        ${
          isSignedIn ?
            (isMyStories ? getDeleteHTML(): getfavSymbHTML(story, currentUser)) : ""
        }
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
        </div>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//Add new user-submitted story
async function addNewStory(evt){
  console.debug("addNewStory");
  evt.preventDefault();

  const author = $("#author-name").val();
  const title = $("#title-name").val();
  const url = $("#newPost-url").val();
  const username = currentUser.username;
  const storyData = {author, title, url, username};

  //await response for structured data of story
  const story = await storyList.addStory(currentUser, storyData);
  
  //pre-pend generated story HTML from received data
  $allStoriesList.prepend(  generateStoryMarkup(story)  );
  $newPostForm.trigger("reset");
  
}

$newPostForm.on("submit", addNewStory);

//Delete current user's specific story
async function deleteStory(evt){
  console.debug("deleteStory");
  const storyId = $(evt.target)
      .closest("li")
      .attr("id");

  //Delete story from API
  console.log(storyList)
  await storyList.removeStory(currentUser, storyId);
  console.log(storyList)

  //Reload section to exclude deleted story
  await putMyStoriesOnPage();
}

$myStories.on("click",".fa-trash-can", deleteStory)

//Creates list of only favorites to show on the page
function putFavoritesOnPage(){
  console.debug("putFavoritesOnPage");

  $favStories.empty();

  // loop through all of our stories and generate HTML for them
  if(!currentUser.favorites.length){
    $favStories.append("<h3>You have not favorited any stories yet!</h3>")
  }
  else{
    //Generate HTML for favs
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favStories.append($story);
    }
  }

  $favStories.show();
}

//Creates list of only favorites to show on the page
function putMyStoriesOnPage(){
  console.debug("putMyStoriesOnPage");

  $myStories.empty();

  // loop through all of our stories and generate HTML for them
  if(!currentUser.ownStories.length){
    $myStories.append("<h3>You have not posted any stories yet!</h3>")
  }
  else{
    //Generate HTML for favs
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);
      $myStories.append($story);
    }
  }
  $myStories.show();
}

//Creates HTML for favorite symbol
function getfavSymbHTML(story, user){
  const isFav = user.isFav(story);
  const favSymb = isFav ? "solid" : "regular";
  const rText =
    `<span class="favSymb">
    <i class="fa-${favSymb} fa-star"></i>
  </span>`;
    return rText;
}

//Creates HTML for delete symbol
function getDeleteHTML(){
  const rText = 
    `<span class="delSymb">
    <i class="fa-regular fa-trash-can"></i>
  </span>`;
  return rText;
}


//Toggles favIcon and updates user's favorites in API
async function toggleFav(evt){
  // console.debug('toggleFav');
  
  const $target = $(evt.target);
  const storyId = $target.closest("li").attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);
  
  //Update API
  if($target.hasClass("fa-solid")){
    await currentUser.removeFav(story);
    $target.toggleClass("fa-solid fa-regular")
  }
  else{
    await currentUser.addFav(story);
    $target.toggleClass("fa-solid fa-regular")
  }
}

$allStoriesList.on("click",'.favSymb',toggleFav)
$favStories.on("click",'.favSymb',toggleFav)