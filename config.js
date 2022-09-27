const dotenv = require("dotenv");
dotenv.config({
  path: ".env"
});

const dbType = process.env.DB_TYPE
const uriString = process.env.MONGO_URI_STRING

module.exports = {
  dbType,
  uriString
}