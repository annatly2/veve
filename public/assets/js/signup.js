$(document).ready(function() {
  // var emailRegex = /./i;
  var form = $("#signupForm");
  var emailField = $("#emailField");
  var passwordField = $("#passwordField");
  var usernameField = $("#usernameField");
  var createAccountBtn = $("#createAccountBtn");

  function resetFields() {
    emailField.removeClass("is-invalid");
    passwordField.removeClass("is-invalid");
    usernameField.removeClass("is-invalid");
  }

  createAccountBtn.click(function(e) {
    e.preventDefault();
    resetFields();

    var username = usernameField.val().trim();
    var email = emailField.val().trim();
    var password = passwordField.val().trim();
    var invalidFlag = false;

    if (username.length < 1) {
      usernameField.addClass("is-invalid");
      invalidFlag = true;
    }

    // would be better to use regex if we could actually send emails.
    // for now, ignore the fact that there isn't a perfect email regex.
    // if (!email.match(emailRegex)) {
    if (email.length < 1) {
      emailField.addClass("is-invalid");
      invalidFlag = true;
    }

    if (password.length < 8) {
      passwordField.addClass("is-invalid");
      invalidFlag = true;
    }

    if (invalidFlag) {
      return;
    }

    var data = {
      email: email,
      password: password,
      username: username
    };

    $.ajax({
      method: "POST",
      url: "/api/signup",
      data: data
    })
    .done(function(response) {
      if (response.error) {
        console.log(response.errorMsg);
      } else {
        setLocalAccessToken(response.session.token);
        window.location = "/closets";
      }
    })
    .fail(function(err) {
      console.log(err);
    })
  });
});
