function getLocalAccessToken() {
  var accessToken = window.localStorage.getItem("access_token");
  if (accessToken == undefined) return null;
  return accessToken;
}

function setLocalAccessToken(token) {
  window.localStorage.setItem("access_token", token);
}

function getSavedEmail(email) {
  var savedEmail = window.localStorage.getItem("saved_email");
  if (savedEmail == undefined) return null;
  return savedEmail;
}

function setSavedEmail(email) {
  window.localStorage.setItem("saved_email", email);
}

function setAccessTokenHeader(token) {
  return function(xhr) {
    xhr.setRequestHeader("x-access-token", token);
  }
}

function setBasicAuthHeader(username, password) {
  return function(xhr) {
    // base64 encode credentials
    var credentials = btoa(username + ":" + password);
    xhr.setRequestHeader("Authorization", `Basic ${credentials}`);
  }
}

function checkAccessToken(success, failure) {
  success = success || function() { return; };
  failure = failure || function() { return; };

  var token = getLocalAccessToken();
  if (token === null) return failure("token not found");

  $.ajax({
    method: "GET",
    url: "/api/username",
    beforeSend: setAccessTokenHeader(token)
  })
  .done(function(response) {
    success();
  })
  .fail(function(err) {
    window.localStorage.removeItem("access_token");
    failure(err);
  })
}

function getAccessToken(email, password, success, failure) {
  $.ajax({
    method: "GET",
    url: "/api/token",
    beforeSend: setBasicAuthHeader(email, password)
  })
  .done(function(response) {
    localStorage.setItem("access_token", response.token);
    success();
  })
  .fail(failure);
}

function automaticLogin(loginSuccessURL) {
  checkAccessToken(
    function success() {
      window.location = loginSuccessURL;
    }
  );
}

function automaticTokenCheck() {
  checkAccessToken(
    function success() { return; },
    function failure() {
      window.location = "/";
    }
  );
}

function signOut() {
  window.localStorage.removeItem("access_token");
  window.location = "/";
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function shuffle(arr) {
  // Fisher-Yates (Knuth) Algorithm
  var shuffled = arr.slice(0); // Copy by value
  for (var i = arr.length-1; i > 0; i--) {
      // 1 <= i <= n-1
      var j = Math.floor(Math.random()*(i+1)); // 0 <= j <= i
      // Swap i and j, copying by value
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
  }
  return shuffled;
}
