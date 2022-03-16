const dbConfig = require('../../config/db.config')
const mongoose = require('mongoose')
const { url } = require('../../config/db.config')

mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose
db.url = dbConfig.url
db.posts = require('./post.model')(mongoose)

module.exports = db