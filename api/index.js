var express = require("express");

var router = express.Router();

router.post("/signup", function(req, res) {
  /*  TODO:
      Deal with session tokens
  */
  getUser(req.body.email)
    .then(function(user) {
      if (user !== null) {
        throw new Error("email already registered")
      }
      return createUser(req.body.email, req.body.password, req.body.username);
    })
    .then(function(newUser) {
      res.json({
        error: false,
        session: "TODO"
      })
    })
    .catch(function(err) {
      return res.json({
        error: true,
        errorMsg: err
      })
    })
});

router.post("/login", function(req, res) {
  /*  TODO:
      Deal with session tokens
  */
  verifyUser(req.body.email, req.body.password)
    .then(function(verified) {
      if (verified) {
        res.json({
          error: false,
          session: "TODO"
        })
      } else {
        res.json({
          error: true,
          errorMsg: "password not correct"
        })
      }
    })
    .catch(function(err) {
      return res.json({
        error: true,
        errorMsg: err
      })
    })
});

router.get("/clothes", function(req,res){
  var query = {};
  if(req.query.email){
    query.Email = req.query.email;
  }
  models.Garment.findAll({
    where: query,
    include: [models.User]
  }).then(function(dbGarment){
    res.json(dbGarment);
  });
});

router.post("/clothes", function(req,res){
  models.Garment.create(req.body).then(function(dbGarment){
    res.json(dbGarment);
  });
});

router.put("/clothes", function(req,res){
  models.Garment.update(
    req.body,
    {
      where: {
        name: req.body.name
      }
    }).then(function(dbGarment){
      res.json(dbGarment);
    });
});

module.exports = router;

// Crypto

var crypto = require("crypto");

function hash(name) {
  return crypto.createHash("sha256").update(name).digest("hex");
}

function newSalt(name) {
  var time = new Date().getTime();
  var data = name + time.toString();
  return hash(data);
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 50000, 256, "sha512").toString("hex");
}

function encrypt(plaintext, key) {
  return new Promise(function(resolve, reject) {
    let cipher = crypto.createCipher("aes256", key);
    let encrypted = "";

    cipher.on("readable", function() {
      let data = cipher.read();
      if (data) encrypted += data.toString("hex");
    });

    cipher.on("end", function() {
      resolve(encrypted);
    });

    cipher.write(plaintext);
    cipher.end();
  });
}

function decrypt(ciphertext, key) {
  return new Promise(function(resolve, reject) {
    let decipher = crypto.createDecifer("aes256", key);
    let decrypted = "";

    decipher.on("readable", function() {
      let data = decipher.read();
      if (data) decrypted += data.toString("utf8");
    });

    decipher.on("end", function() {
      resolve(decrypted);
    });

    decipher.write(ciphertext, "hex");
    decipher.end();
  });
}

// Models

var models = require("../models");
var User = models.User;
var Garment = models.Garment;


function createUser(email, password, username) {
  var emailHash = hash(email);
  var salt = newSalt(email);
  var saltedPassword = hashPassword(password, salt);
}

function getUser(email) {
  var emailHash = hash(email);
  return User.findOne({
    where: {
      email: emailHash
    }
  })
  .then(function(results) {
    if (results.length < 1) {
      return null;
    }
    return results[0];
  })
}

function verifyUser(email, password) {
  return getUser(email)
  .then(function(user) {
    if (user === null) {
      throw new Error("email not registered");
    }
    var toCheck = hashPassword(password, user.salt);
    return toCheck === user.password;
  })
}
