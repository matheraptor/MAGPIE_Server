require("dotenv").config();
module.exports = {
    port: process.env.PORT,
    jwtSecret: process.env.jwtSecret,
    domain: process.env.domain
}