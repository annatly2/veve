$(document).ready(function() {
  var loginSuccessURL = "/closets";

  var form = $("#loginForm");
  var emailField = $("input[name=email]");
  var passwordField = $("input[name=password]");
  var loginBtn = $("#loginButton");
  var signUpBtn = $("#signUpButton");

  checkAccessToken(
    function success() {
      // automatic login if token already exists
      window.location = loginSuccessURL
    }
  );

  signUpBtn.click(function(e) {
    e.preventDefault();
    window.location = "/signup/";
  });

  loginBtn.click(function(e) {
    e.preventDefault();
    var email = emailField.val().trim();
    var password = passwordField.val().trim();

    if (email.length > 0 && password.length > 0) {
      getAccessToken(email, password,
        function success() {
          window.location = loginSuccessURL;
        },
        function failure(err) {
          if (err.status === 403) {
            emailField.addClass("is-invalid");
            passwordField.addClass("is-invalid");
          }
        }
      );
    }
  });
});
