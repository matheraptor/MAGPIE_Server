require("dotenv").config();
module.exports = {
    port: process.env.PORT,
    jwtSecret: process.env.jwtSecret,
    domain: process.env.domain,
    project_id: process.env.project_id,
    instance_name: process.env.instance_name,
    instance_ip: process.env.instance_ip,
    instance_zone: process.env.instance_zone,
    devMode: process.env.devMode
}