var express = require("express");
var auth = require("basic-auth");
var moment = require("moment");

var uu = require("./user_utils");
var cu = require("./crypto_utils");
var models = require("../models");
var User = models.User;
var Garment = models.Garment;
var Outfit = models.Outfit;

module.exports = function(app) {
  var tu = require("./token_utils")(app);
  var jwtauth = tu.middleware;

  var router = express.Router();

  function accessDenied(req, res) {
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", 'Basic realm="veve"');
    res.end("Access denied");
  }

  function forbidden(req, res) {
    res.statusCode = 403;
    res.end("Forbidden");
  }

  function forbiddenIfNoUser(req, res, next) {
    if (req.user == undefined) {
      return forbidden(req, res);
    } else {
      next();
    }
  }

  router.post("/signup", function(req, res) {
    var values = req.body || req.params;
    uu.get(values.email)
      .then(function(user) {
        if (user !== null) {
          throw new Error("email already registered")
        }
        return uu.create(values.email, values.password, values.username);
      })
      .then(function(newUser) {
        var token = tu.create(values.email);
        res.json({
          error: false,
          session: token
        })
      })
      .catch(function(err) {
        return res.json({
          error: true,
          errorMsg: err.message
        });
      })
  });

  router.get("/token", function(req, res) {
    var header = auth(req);
    uu.verify(header.name, header.pass)
      .then(function(user) {
        if (user === null) {
          return forbidden(req, res);
        } else {
          var token = tu.create(header.name);
          res.json(token);
        }
      })
      .catch(function(err) {
        forbidden(req, res);
      })
  });

  router.get("/username",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      cu.decrypt(req.user.username, req.user.salt)
        .then(function(decryptedUsername) {
          res.json({
            error: false,
            username: decryptedUsername
          });
        })
    }
  );

  router.put("/account",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      var header = auth(req);
      if (header == undefined) {
        return forbidden(req, res);
      }

      if (req.body == undefined) {
        return res.json({
          error: true,
          errorMsg: "must provide updated values"
        })
      }

      if (req.body.email == undefined || req.body.password == undefined || req.body.username == undefined) {
        return res.json({
          error: true,
          errorMsg: "must provide all updated values"
        })
      }

      return uu.update(header.name, req.body)
        .then(function(result) {
          res.json({
            error: false
          })
        })
        .catch(function(err) {
          res.json({
            error: true,
            errorMsg: err.message
          })
        })
    }
  );

  router.delete("/account",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      var header = auth(req);
      if (header === undefined) {
        return forbidden(req, res);
      }

      if (req.body.username == undefined) {
        return forbidden(req,res);
      }

      uu.delete(header.name, header.pass, req.body.username)
        .then(function(result) {
          res.json({
            error: false
          });
        })
        .catch(function(err) {
          return forbidden(req, res);
        })
    }
  );

  /* Clothes */

  router.get("/clothes/:closet",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      var query = {where: {UserId: req.user.dataValues.id}};
      if (req.params.closet !== "all") {
        query.where.closet = req.params.closet;
      }

      Garment.findAll(query)
        .then(function(garments) {
          garments = garments.map(function(g) {
            return {
              id: g.id,
              name: g.name,
              description: g.description,
              category: g.category,
              closet: g.closet
            }
          })
          res.json({
            error: false,
            garments: garments
          });
        })
        .catch(function(err) {
          res.json({
            error: true,
            errorMsg: err.message
          });
        })
    }
  );

  router.get("/clothes/img/:id",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      var query = {
        where: {
          UserId: req.user.dataValues.id,
          id: req.params.id
        }
      };
      
      Garment.findAll(query)
        .then(function(garments) {
          if (garments.length !== 1) {
            res.json({
              error: true,
              errorMsg: `item with id ${req.params.id} not found`
            })
          } else {
            cu.decrypt(garments[0].dataValues.image, req.user.dataValues.salt)
              .then(function(plaintext) {
                res.json({
                  error: false,
                  image: plaintext
                })
              })
              .catch(function(err) {
                throw err
              })
          }
        })
        .catch(function(err) {
          res.json({
            error: true,
            errorMsg: err.message
          });
        })
    }
  );

  router.post("/clothes",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      var garment = req.body;
      garment.UserId = req.user.id;
      cu.encrypt(garment.image, req.user.salt)
        .then(function(ciphertext) {
          garment.image = ciphertext;

          Garment.create(garment)
            .then(function(dbGarment){
              res.json({
                error: false,
                garment: dbGarment
              });
            })
            .catch(function(err) {
              res.json({
                error: true,
                errorMsg: err.message
              });
            });
        })
    }
  );

  router.put("/clothes",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      var garment = req.body;

      Garment.update(garment, {
          where: {
            UserId: req.user.id,
            id: garment.id
          }
        })
        .then(function(updateCount) {
          updateCount = updateCount[0];
          if (updateCount === 1) {
            res.json({
              error: false
            });
          } else {
            res.json({
              error: true,
              errorMsg: `expected to update 1 row, updated ${updateCount}`
            });
          }
        })
        .catch(function(err) {
          res.json({
            error: true,
            errorMsg: err.message
          });
        })
    }
  );

  router.delete("/clothes",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      var garment = req.body;

      Garment.destroy({
        where: {
          UserId: req.user.id,
          id: garment.id
        }
      })
      .then(function(deleteCount) {
        if (deleteCount === 1) {
          res.json({
            error: false
          })
        } else {
          res.json({
            error: true,
            errorMsg: `expected to delete 1 row, deleted ${deleteCount}`
          });
        }
      })
      .catch(function(err) {
        res.json({
          error: true,
          errorMsg: err.message
        });
      })
    }
  );

  router.get("/outfit/:id",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      var userId = req.user.id;
      var outfitId = req.params.id;

      Outfit.findAll({
        where: {
          UserId: userId,
          id: outfitId
        },
        include: [Garment]
      })
      .then(function(outfits) {
        if (outfits.length !== 1) {
          res.json({
            error: true,
            errorMsg: `expected 1 outfit, found ${outfits.length}`
          });
        } else {
          res.json({
            error: false,
            outfit: outfits[0]
          });
        }
      })
      .catch(function(err) {
        res.json({
          error: true,
          errorMsg: err.message
        });
      })
    }
  );

  router.post("/outfit",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      var outfit = req.body;
      outfit.UserId = req.user.id;

      Outfit.create(outfit)
      .then(function(dbOutfit) {
        res.json({
          error: false,
          outfit: dbOutfit
        });
      })
      .catch(function(err) {
        res.json({
          error: true,
          errorMsg: err.message
        });
      })
    }
  );

  router.put("/outfit",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      var outfit = req.body;

      Outfit.update(outfit, {
        where: {
          UserId: req.user.id,
          id: outfit.id
        }
      })
      .then(function(updateCount) {
        updateCount = updateCount[0];
        if (updateCount === 1) {
          res.json({
            error: false
          });
        } else {
          res.json({
            error: true,
            errorMsg: `expected to update 1 row, updated ${updateCount}`
          });
        }
      })
      .catch(function(err) {
        res.json({
          error: true,
          errorMsg: err.message
        });
      })
    }
  );

  router.delete("/outfit",
    jwtauth,
    forbiddenIfNoUser,
    function(req, res) {
      var outfit = req.body;

      Outfit.destroy({
        where: {
          UserId: req.user.id,
          id: garment.id
        }
      })
      .then(function(deleteCount) {
        if (deleteCount === 1) {
          res.json({
            error: false
          })
        } else {
          res.json({
            error: true,
            errorMsg: `expected to delete 1 row, deleted ${deleteCount}`
          });
        }
      })
      .catch(function(err) {
        res.json({
          error: true,
          errorMsg: err.message
        });
      })
    }
  );

  return router;
}
