const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const func = require('../globalfunctions')
const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  console.log("signing up...");
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              userLevel: req.body.userLevel,
              userName: req.body.userName,
              lastLoginDate: Date.now,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  user: result
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  const startTime = process.hrtime()
  User.find({
      email: req.params.email
    })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return func.resStatusErrorProcess(req, res, "Email tidak terdaftar !", req.params, 401);
        // return res.status(401).json({
        //   message: "Auth failed"
        // });
      }
      bcrypt.compare(req.params.password, user[0].password, (err, result) => {
        if (err) {
          return func.resStatusErrorProcess(req, res, "Password salah !", req.params, 401);
          // return res.status(401).json({
          //   message: "Auth failed"
          // });
        }
        if (result) {
          const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY, {
              expiresIn: "240h"
            }
          );
          return func.resStatusOkGet(req, res, {
            _id: user[0]._id,
            email: user[0].email,
            userLevel: user[0].userLevel,
            mottoStatus: user[0].mottoStatus,
            userName: user[0].userName,
            token: token

          }, );

        
        } else {
          return func.resStatusErrorProcess(req,res,"Kombinasi Email/Password tidak terdaftar", req.params.email,401);
          // res.status(401).json({
          //   message: "Auth failed"
          // });
        }

      
      });
    })
    .catch(err => {
      console.log(err);
      return func.resStatusErrorServer(req,res,err)
      // console.log(err);
      // res.status(500).json({
      //   error: err
      // });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({
      _id: req.params.userId
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.update_fotoprofil = (req, res, next) => {
  // console.log("anggota_update_foto API: BODY/HEADERS/PARAMS")
  // console.log(req)
  // console.log(req.headers)
  // console.log(req.body)
  // console.log(req.file)
  const id = req.body._id
  // const updateOps = {
  //   'nama_depan': req.body.nama_depan,
  //   'tgl_lahir': req.body.tgl_lahir,
  //   'alamat': req.body.alamat,
  //   'foto': req.file.path
  // }
  User.findById(id)
    .select("_id fotoProfil email password")
    .exec()
    .then(userLama => {
      // console.log("anggota from database : ", anggota)
      if (userLama) {
        const oldfoto = userLama.fotoProfil
        userLama.fotoProfil = req.file.path
        console.log(req.file.path)
        userLama.save() // will return updatedUser if success

          .then((updatedUser) => {
            res.status(200).json({
              message: 'OK',
              updatedUser,
              request: {
                type: "PATCH",

              }
            })
            return oldfoto
          })
          .then(oldfoto => {
            console.log(oldfoto)
            var globfunc = require('../globalfunctions.js')
            var imgfiledeleted = globfunc.deleteFile(oldfoto)
            console.log('File Deleted :' + imgfiledeleted)
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({
              error: err
            })
            return
          })
        //anggota.foto = req.file.path


      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID"
        })
        return
      }
    })

    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
      return
    })
}