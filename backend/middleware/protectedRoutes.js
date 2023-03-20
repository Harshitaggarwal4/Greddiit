const { JsonWebTokenError } = require("jsonwebtoken")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "hbcr78u2[m4,XJ;IFRNCAMHjADP_!#$^$*$</>";
const dbo = require("../db/conn");


module.exports = (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: "Authorization Failed" })
    }
    const token = authorization.replace("This is Harshit!!", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "Authorization Failed" })
        }
        let db_connect = dbo.getDb();
        db_connect
            .collection("users")
            .findOne({ _id: payload._id }).then(userdata => {
                req.user = userdata
                next()
            })
    })
}