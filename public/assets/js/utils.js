function getLocalAccessToken() {
  var accessToken = window.localStorage.getItem("access_token");
  if (accessToken == undefined) return null;
  return accessToken;
}

function setLocalAccessToken(token) {
  window.localStorage.setItem("access_token", token);
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

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function signOut() {
  window.localStorage.removeItem("access_token");
  window.location = "/";
}
