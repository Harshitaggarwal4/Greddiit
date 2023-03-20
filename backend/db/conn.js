const { MongoClient } = require("mongodb");
const Db = "mongodb+srv://harshitaggarwal4:Ganesha%4038@greddiitdatabase.4owcpe1.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("greddiit");
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};