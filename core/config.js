require("dotenv").config();
module.exports = {
    port: process.env.PORT,
    jwtSecret: process.env.jwtSecret,
    jwtExpire: "15m",
    domain: process.env.domain,
    project_id: process.env.project_id,
    instance_name: process.env.instance_name,
    instance_ip: process.env.instance_ip,
    instance_zone: process.env.instance_zone,
    devMode: process.env.devMode,
    NODE_ENV: process.env.isProduction ? true : false,
    sendGrid_API: process.env.sendGrid_API
}