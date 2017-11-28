var chai = require("chai");
chai.use(require("chai-as-promised"));

var assert = chai.assert;
var expect = chai.expect;

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

  describe("hashPassword", function() {
    it("should obfuscate a password using pbkdf2", function() {
      var password = "password";
      var salt = cu.newSaltSync("useremail");
      var hashedPassword = cu.hashPassword(password, salt);

      return expect(hashedPassword).to.eventually.not.equal(password);
    });

    it("should match the correct password", function() {
      var password = "password";
      var salt = "3a76f6abbfd347b26e2c0876863bca31ab2288831cb16c43db95339c32916307";
      var hashedPassword = cu.hashPassword(password, salt);
      var expected = "38a60fabc65b03164f21e0dc56bc01c85af4e8671e22c157cf668455c22c053e7c3aa1d600920f084cc359871f74765cfd65d61cc965a6af3064098f4908775b0685a2b0425be784c7264e4fb33e0bd528aee873b5eb120be06695c4a19a3647f4ec22b8e6220e8c1d1f88f1c46a1b044bfa62b615eae3a398bbda5b57d75bd0cc85624358ab21c3697056c0b130c232e25e84e9f6327bcf46de6e7b6df2b102dbb37b8038b9fbb62a4a800f4ac6fbf9a7364ea41707748c984c4d4e3da63bde2e5cc906f601cfe85765098cdc4ad495b49771c8f042ac238840607c361d4f8ccf9cf8e8994d6f3442d0315a2029812d7ba67cbd358b19fb78c9a43d110496af";

      return expect(hashedPassword).to.eventually.equal(expected);
    });

    it("should not match the incorrect password", function() {
      var password = "abc123";
      var salt = "3a76f6abbfd347b26e2c0876863bca31ab2288831cb16c43db95339c32916307";
      var hashedPassword = cu.hashPassword(password, salt);
      var expected = "38a60fabc65b03164f21e0dc56bc01c85af4e8671e22c157cf668455c22c053e7c3aa1d600920f084cc359871f74765cfd65d61cc965a6af3064098f4908775b0685a2b0425be784c7264e4fb33e0bd528aee873b5eb120be06695c4a19a3647f4ec22b8e6220e8c1d1f88f1c46a1b044bfa62b615eae3a398bbda5b57d75bd0cc85624358ab21c3697056c0b130c232e25e84e9f6327bcf46de6e7b6df2b102dbb37b8038b9fbb62a4a800f4ac6fbf9a7364ea41707748c984c4d4e3da63bde2e5cc906f601cfe85765098cdc4ad495b49771c8f042ac238840607c361d4f8ccf9cf8e8994d6f3442d0315a2029812d7ba67cbd358b19fb78c9a43d110496af";

      return expect(hashedPassword).to.eventually.not.equal(expected);
    });
  });

  describe("encrypt", function() {
    it("should obfuscate data using AES-256", function() {
      var payload = "my secret data";
      var secret  = "secret";
      var encrypted = cu.encrypt(payload, secret);

      return expect(encrypted).to.eventually.not.equal(payload);
    });
  });

  describe("encrypt and decrypt", function() {
    it("should perform AES-256 encryption and decryption yielding the original data", function() {
      var payload = "this should be secret";
      var secret  = "secret";

      var encrypted = cu.encrypt(payload, secret);
      var decrypted = encrypted.then(function(ciphertext) {
        return cu.decrypt(ciphertext, secret);
      });

      return expect(decrypted).to.eventually.equal(payload);
    });
  });

});
