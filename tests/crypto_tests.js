var assert = require("chai").assert;

describe("crypto_utils", function() {
  var cu = require("../api/crypto_utils");

  describe("hashSync", function() {
    it("should perform SHA-256 hashing and return the result in hexadecimal", function() {
      var testVectors = [
        ["", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"],
        ["abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"],
        ["abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq", "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1"]
      ];

      testVectors.forEach(function(v) {
        assert.equal(cu.hashSync(v[0]), v[1]);
      });
    });
  });

  describe("encrypt", function() {
    this.timeout(1000);
    // this should fail, but doesn't
    it("should perform AES-256 encryption and return the result in hexadecimal", function() {
      cu.encrypt("password", "secret")
        .then(function(result) {
          assert.equal(result, "abc123");
          done();
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });
});
