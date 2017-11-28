var chai = require("chai");
chai.use(require("chai-as-promised"));

var assert = chai.assert;
var expect = chai.expect;

// Unreliable. Try going through the API server.

// describe("user_utils",function(){
//   var uu = require("../api/user_utils");
//   var cu = require("../api/crypto_utils");
//
//   var db = require("../models");
//   function resetDB() {
//     return db.sequelize.sync({force: true})
//   }
//   function resetDBwithDefaultUser() {
//     return resetDB().then(function() {
//       return uu.create("email", "password", "username");
//     })
//   }
//
//   describe("create", function() {
//     it("should create a new user", function() {
//       var newUser = resetDBwithDefaultUser().then(function(u) {
//         var user = u.dataValues;
//         expect(user).to.have.property("email");
//         expect(user).to.have.property("salt");
//         expect(user).to.have.property("password");
//         expect(user).to.have.property("username");
//       });
//       expect(newUser).to.eventually.be.fulfilled;
//     });
//   });
//
//   describe("verify", function() {
//     it("should verify correct credentials", function() {
//       var verifiedUser = resetDBwithDefaultUser()
//         .then(function() {
//           return uu.verify("email", "password")
//         })
//         .catch(function(err) {
//           console.log(err);
//         });
//       return Promise.all([
//         expect(verifiedUser).to.eventually.be.fulfilled,
//         expect(verifiedUser).to.eventually.not.equal(null)
//       ]);
//     });
//
//     it("should not verify an email that has not been registered", function() {
//       var notRegistered = resetDB()
//         .then(function() {
//           return uu.verify("email", "password")
//         });
//       expect(notRegistered).to.eventually.be.rejectedWith(new Error("email not registered"));
//     });
//
//     it("should not verify incorrect credentials", function() {
//       var unverifiedUser = resetDBwithDefaultUser()
//         .then(function() {
//           return uu.verify("email", "abcd1234")
//         });
//       return Promise.all([
//         expect(unverifiedUser).to.eventually.be.fulfilled,
//         expect(unverifiedUser).to.eventually.equal(null)
//       ]);
//     })
//   });
//
// });
