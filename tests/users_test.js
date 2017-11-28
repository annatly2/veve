var expect = require("chai").expect;
var should = require("chai").should();

describe("user_utils",function(){
  var uu = require("../api/user_utils");
  var cu = require("../api/crypto_utils");

  describe("create user", function(){
    it("should create a new user and return a promise that is fulfilled", function(){
      var newUser = uu.create("email", "password", "username");
      newUser.should.be.fulfilled;

    })
  })

})