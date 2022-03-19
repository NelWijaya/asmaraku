const express = require('express')
const cors = require('cors')
const request = require('request')
var cron = require('node-cron')



const app = express()


app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

const db = require("./app/models/")
const Post = db.posts
const { update } = require('./app/controllers/post.controller')
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log(`Database connected!`)

    }).catch((err) => {
        console.log(`Cannot connect to the database!`, err)
        process.exit()
    });


app.get('/', (req, res) => {
    res.redirect('/api/covid');
})




require('./app/routes/post.routes')(app)

const PORT = 8000
app.listen(PORT, () => {
    console.log(`Server berjalan dalam http://localhost:${PORT}`)
})