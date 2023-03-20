const express = require("express");
const nodemailer = require("nodemailer");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const requireLogin = require('../middleware/protectedRoutes');
const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const JWT_SECRET = "hbcr78u2[m4,XJ;IFRNCAMHjADP_!#$^$*$</>";


// This section will help you get a list of all the records.
recordRoutes.route("/user").get(requireLogin, function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("users")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help to get a single record by username
recordRoutes.route("/user/login/:username/:password").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = {
    username: (req.params.username)
  };
  db_connect
    .collection("users")
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      var token;
      if (result) {
        bcrypt.compare(req.params.password, result.password, function (err, result1) {
          if (result1 !== true) {
            result = false;
            res.json({ result, token });
          }
          else {
            token = jwt.sign({ _id: result._id }, JWT_SECRET);
            res.json({ result, token });
          }
        });
      }
      else {
        res.json({ result, token });
      }
    });
});

recordRoutes.route("/user/:username").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { username: (req.params.username) };
  db_connect
    .collection("users")
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you create a new record.
recordRoutes.route("/user/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { username: (req.body.username) };
  db_connect
    .collection("users")
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      if (!result) {
        let myobj = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          email: req.body.email,
          age: req.body.age,
          contact: req.body.contact,
          password: req.body.password,
          following: req.body.following,
          followers: req.body.followers,
          followingarray: req.body.followingarray,
          followersarray: req.body.followersarray,
        };
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          myobj.password = hash;
          db_connect.collection("users").insertOne(myobj, function (err, res) {
            if (err) throw err;
            var token;
            token = jwt.sign({ _id: res._id }, JWT_SECRET);
            response.json({ res, token });
          });
        });
      }
      else {
        throw ("A user already exists with this username!")
      }
    });
});

// This section will help you update a record by username.
recordRoutes.route("/user/update/:username").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { username: (req.params.username) };
  db_connect
    .collection("users")
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      if (result.username === req.body.username) {
        if (err) throw err;
        var password;
        if (req.body.password !== result.password) {
          bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            password = hash;
            let newvalues = {
              $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                email: req.body.email,
                age: req.body.age,
                contact: req.body.contact,
                password: password,
                following: req.body.following,
                followers: req.body.followers,
                followingarray: req.body.followingarray,
                followersarray: req.body.followersarray,
              },
            };
            db_connect
              .collection("users")
              .updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                response.json(res);
              });
          });
        }
        else {
          let newvalues = {
            $set: {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              username: req.body.username,
              email: req.body.email,
              age: req.body.age,
              contact: req.body.contact,
              password: req.body.password,
              following: req.body.following,
              followers: req.body.followers,
              followingarray: req.body.followingarray,
              followersarray: req.body.followersarray,
            },
          };
          db_connect
            .collection("users")
            .updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
              response.json(res);
            });
        }
      }
      else {
        throw ("A user already exists with this username!")
      }
    });
});

// This section will help you delete a record
recordRoutes.route("/user/delete/:id").delete(requireLogin, (req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("users").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = recordRoutes;


recordRoutes.route("/subgreddiit/add").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags,
    banned: req.body.banned,
    moderator: req.body.moderator,
    followersarray: req.body.followersarray,
    number_of_posts: req.body.number_of_posts,
    creation_date_time: req.body.creation_date_time,
    leaved_users: req.body.leaved_users,
    blocked_users: req.body.blocked_users,
    url: req.body.url
  };
  db_connect.collection("SubGreddiit").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});


recordRoutes.route("/subgreddiit/:moderator").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { moderator: (req.params.moderator) };
  db_connect
    .collection("SubGreddiit")
    .find(myquery).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


recordRoutes.route("/subgreddiit/delete/:id").delete(requireLogin, (req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let deletee = { subgreddiit_id: req.params.id }
  db_connect.collection("SubGreddiit").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
  db_connect.collection("posts").deleteMany(deletee, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  db_connect.collection("reports").deleteMany(deletee, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  db_connect.collection("requests").deleteMany(deletee, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  db_connect.collection("comments").deleteMany(deletee, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  db_connect.collection("saves").deleteMany(deletee, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
});

recordRoutes.route("/subgreddiit/open/:id").get(requireLogin, function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect
    .collection("SubGreddiit")
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


recordRoutes.route("/requests/:id").get(requireLogin, function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { subgreddiit_id: (req.params.id) };
  db_connect
    .collection("requests")
    .find(myquery).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

recordRoutes.route("/subgreddiit/update/:id").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      name: req.body.name,
      description: req.body.description,
      tags: req.body.tags,
      banned: req.body.banned,
      moderator: req.body.moderator,
      followersarray: req.body.followersarray,
      number_of_posts: req.body.number_of_posts,
      creation_date_time: req.body.creation_date_time,
      leaved_users: req.body.leaved_users,
      blocked_users: req.body.blocked_users,
      url: req.body.url
    },
  };
  db_connect
    .collection("SubGreddiit")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});


recordRoutes.route("/requests/delete/:id").delete(requireLogin, (req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("requests").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});


recordRoutes.route("/reports/:id").get(requireLogin, function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { subgreddiit_id: (req.params.id) };
  db_connect
    .collection("reports")
    .find(myquery).toArray(function (err, result) {
      if (err) throw err;
      var index = 0;
      for (let file of result) {
        let object = file;
        let objectDate = new Date(object.creation_time);
        let tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        if (objectDate < tenDaysAgo) {
          db_connect.collection("reposts").deleteOne({ _id: ObjectId(object._id) }, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
          });
          result.splice(index, 1);
        }
        index = index + 1;
      }
      res.json(result);
    });
});


recordRoutes.route("/reports/update/:id").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      subgreddiit_id: req.body.subgreddiit_id,
      reported_by: req.body.reported_by,
      who_reported: req.body.who_reported,
      concern: req.body.concern,
      post_text: req.body.post_text,
      creation_time: req.body.creation_time,
      is_ignored: req.body.is_ignored,
      is_blocked: req.body.is_blocked,
      post_id: req.body.post_id
    },
  };
  db_connect
    .collection("reports")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});


recordRoutes.route("/posts/delete/:id/:subgreddiit_id").delete(requireLogin, (req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let myqueryy = { post_id: req.params.id };
  let myqueryyy = { _id: ObjectId(req.params.subgreddiit_id) };
  db_connect.collection("SubGreddiit").findOne(myqueryyy, function (err, result) {
    if (err) throw err;
    let newvalues = {
      $set: {
        name: result.name,
        description: result.description,
        tags: result.tags,
        banned: result.banned,
        moderator: result.moderator,
        followersarray: result.followersarray,
        number_of_posts: result.number_of_posts - 1,
        creation_date_time: result.creation_date_time,
        leaved_users: result.leaved_users,
        blocked_users: result.blocked_users,
        url: result.url
      },
    };
    db_connect
      .collection("SubGreddiit")
      .updateOne(myqueryyy, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
  });
  db_connect.collection("posts").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
  db_connect.collection("reports").deleteMany(myqueryy, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  db_connect.collection("comments").deleteMany(myqueryy, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  db_connect.collection("saves").deleteMany(myqueryy, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
});


recordRoutes.route("/subgreddiit").get(requireLogin, function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("SubGreddiit")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


recordRoutes.route("/requests/:id/:username").get(requireLogin, function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = {
    subgreddiit_id: (req.params.id),
    username: (req.params.username)
  };
  db_connect
    .collection("requests")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


recordRoutes.route("/requests/add").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    subgreddiit_id: req.body.subgreddiit_id,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  };
  db_connect.collection("requests").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});


recordRoutes.route("/posts/add").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    subgreddiit_id: req.body.subgreddiit_id,
    content: req.body.content,
    posted_by: req.body.posted_by,
    upvotes: req.body.upvotes,
    downvotes: req.body.downvotes
  };
  db_connect.collection("posts").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});


recordRoutes.route("/comments/:id").get(requireLogin, function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { post_id: (req.params.id) };
  db_connect
    .collection("comments")
    .find(myquery).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


recordRoutes.route("/posts/update/:id").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      subgreddiit_id: req.body.subgreddiit_id,
      content: req.body.content,
      posted_by: req.body.posted_by,
      upvotes: req.body.upvotes,
      downvotes: req.body.downvotes
    },
  };
  db_connect
    .collection("posts")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});


recordRoutes.route("/comments/add").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    post_id: req.body.post_id,
    subgreddiit_id: req.body.subgreddiit_id,
    content: req.body.content,
    comment_by: req.body.comment_by
  };
  db_connect.collection("comments").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});


recordRoutes.route("/posts/:id").get(requireLogin, function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { subgreddiit_id: (req.params.id) };
  db_connect
    .collection("posts")
    .find(myquery).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


recordRoutes.route("/reports/add").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    subgreddiit_id: req.body.subgreddiit_id,
    post_id: req.body.post_id,
    reported_by: req.body.reported_by,
    who_reported: req.body.who_reported,
    concern: req.body.concern,
    post_text: req.body.post_text,
    creation_time: req.body.creation_time,
    is_ignored: req.body.is_ignored,
    is_blocked: req.body.is_blocked
  };
  db_connect.collection("reports").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});


recordRoutes.route("/saves/:username/:id").get(requireLogin, function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = {
    username: (req.params.username),
    post_id: (req.params.id)
  };
  db_connect
    .collection("saves")
    .find(myquery).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


recordRoutes.route("/saves/add").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    subgreddiit_id: req.body.subgreddiit_id,
    post_id: req.body.post_id,
    username: req.body.username
  };
  db_connect.collection("saves").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});


recordRoutes.route("/saves/delete/:id/:username").delete(requireLogin, (req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { post_id: (req.params.id), username: req.params.username };
  db_connect.collection("saves").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});


recordRoutes.route("/saves/:username").get(requireLogin, function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = {
    username: (req.params.username)
  };
  db_connect
    .collection("saves")
    .find(myquery).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});



recordRoutes.route("/posts/find/:id").get(requireLogin, function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect
    .collection("posts")
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

recordRoutes.route("/reports/ignore/update/:id").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      subgreddiit_id: req.body.subgreddiit_id,
      reported_by: req.body.reported_by,
      who_reported: req.body.who_reported,
      concern: req.body.concern,
      post_text: req.body.post_text,
      creation_time: req.body.creation_time,
      is_ignored: req.body.is_ignored,
      is_blocked: req.body.is_blocked,
      post_id: req.body.post_id
    },
  };
  db_connect
    .collection("reports")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });

  let myqueryy = { username: req.body.reported_by };
  db_connect
    .collection("users")
    .findOne(myqueryy, function (err, result) {
      if (err) throw err;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: 'harshitaggarwal382627@gmail.com',
          pass: 'gtbzufgfxexsjujk'
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      transporter.sendMail({
        from: '"👻" <harshitaggarwal382627@gmail.com>',
        to: result.email,
        subject: "Regarding the report",
        text: "The report has been successfully ignored xD.",
        html: "",
      }, (err, info) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log(info);
        }
      });
    });
});

recordRoutes.route("/reports/block/update/:id").post(requireLogin, function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      subgreddiit_id: req.body.subgreddiit_id,
      reported_by: req.body.reported_by,
      who_reported: req.body.who_reported,
      concern: req.body.concern,
      post_text: req.body.post_text,
      creation_time: req.body.creation_time,
      is_ignored: req.body.is_ignored,
      is_blocked: req.body.is_blocked,
      post_id: req.body.post_id
    },
  };
  db_connect
    .collection("reports")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });

  let myqueryy = { username: req.body.reported_by };
  db_connect
    .collection("users")
    .findOne(myqueryy, function (err, result) {
      if (err) throw err;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: 'harshitaggarwal382627@gmail.com',
          pass: 'gtbzufgfxexsjujk'
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      transporter.sendMail({
        from: '"👻" <harshitaggarwal382627@gmail.com>',
        to: result.email,
        subject: "Regarding the report",
        text: "The reported person has been successfully blocked.",
        html: "",
      }, (err, info) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log(info);
        }
      });
    });

  let m = { username: req.body.who_reported };
  db_connect
    .collection("users")
    .findOne(m, function (err, result) {
      if (err) throw err;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: 'harshitaggarwal382627@gmail.com',
          pass: 'gtbzufgfxexsjujk'
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      transporter.sendMail({
        from: '"👻" <harshitaggarwal382627@gmail.com>',
        to: result.email,
        subject: "Regarding the report",
        text: "You have been successfully blocked.",
        html: "",
      }, (err, info) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log(info);
        }
      });
    });
});


recordRoutes.route("/posts/delete/delete/:id/:subgreddiit_id/:report_id").delete(requireLogin, (req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let myqueryy = { post_id: req.params.id };
  let myqueryyy = { _id: ObjectId(req.params.subgreddiit_id) };
  db_connect.collection("SubGreddiit").findOne(myqueryyy, function (err, result) {
    if (err) throw err;
    let newvalues = {
      $set: {
        name: result.name,
        description: result.description,
        tags: result.tags,
        banned: result.banned,
        moderator: result.moderator,
        followersarray: result.followersarray,
        number_of_posts: result.number_of_posts - 1,
        creation_date_time: result.creation_date_time,
        leaved_users: result.leaved_users,
        blocked_users: result.blocked_users,
        url: result.url
      },
    };
    db_connect
      .collection("SubGreddiit")
      .updateOne(myqueryyy, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
  });
  let myqu = { _id: ObjectId(req.params.report_id) };
  db_connect
    .collection("reports")
    .findOne(myqu, function (err, r) {
      let myque = { username: r.reported_by };
      db_connect
        .collection("users")
        .findOne(myque, function (err, result) {
          if (err) throw err;
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: false,
            auth: {
              user: 'harshitaggarwal382627@gmail.com',
              pass: 'gtbzufgfxexsjujk'
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          transporter.sendMail({
            from: '"👻" <harshitaggarwal382627@gmail.com>',
            to: result.email,
            subject: "Regarding the report",
            text: "The post has been successfully deleted.",
            html: "",
          }, (err, info) => {
            if (err) {
              console.log(err);
            }
            else {
              console.log(info);
            }
          });
        });

      let m = { username: r.who_reported };
      db_connect
        .collection("users")
        .findOne(m, function (err, result) {
          if (err) throw err;
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: false,
            auth: {
              user: 'harshitaggarwal382627@gmail.com',
              pass: 'gtbzufgfxexsjujk'
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          transporter.sendMail({
            from: '"👻" <harshitaggarwal382627@gmail.com>',
            to: result.email,
            subject: "Regarding the report",
            text: "The post has been successfully deleted.",
            html: "",
          }, (err, info) => {
            if (err) {
              console.log(err);
            }
            else {
              console.log(info);
            }
          });
        });
    });
  db_connect.collection("posts").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
  db_connect.collection("reports").deleteMany(myqueryy, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  db_connect.collection("comments").deleteMany(myqueryy, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  db_connect.collection("saves").deleteMany(myqueryy, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
});


// recordRoutes.get('/chat', requireLogin, (req, res) => {
//   User.aggregate([
//     { $match: { _id: req.user._id } },
//     { $lookup: { from: 'UserInfo', localField: 'following', foreignField: '_id', as: 'followingUsers' } },
//     { $unwind: '$followingUsers' },
//     { $lookup: { from: 'UserInfo', localField: 'followingUsers.following', foreignField: '_id', as: 'followingOfFollowingUsers' } },
//     { $unwind: '$followingOfFollowingUsers' },
//     { $match: { 'followingOfFollowingUsers._id': req.user._id } },
//     { $lookup: { from: 'UserInfo', localField: '_id', foreignField: '_id', as: 'userInfo' } },
//     { $unwind: '$userInfo' },
//     { $project: { _id: '$followingUsers._id', fname: '$followingUsers.fname', lname: '$followingUsers.lname' } }
//   ], (err, result) => {
//     if (err) {
//       console.log('Error:', err);
//       res.status(500).send('Error retrieving chat users');
//     } else if (result.length === 0) {
//       console.log('No matching user found.');
//       res.status(404).send('No matching users found');
//     } else {
//       // console.log('Matching users:', result);
//       res.json({ result });
//     }
//   });
// });