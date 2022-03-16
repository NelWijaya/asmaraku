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
    res.json({
        status: "Hasil API, dapat dicheck pada Postman atau http://localhost:8000/api/covid"
    })
})

// terjadwal terpanggil setiap jam 11:59
cron.schedule('59 11 * * *', function() {
    const id = '6231855867c58d847396e2cc'
    let today = new Date()
    request({
            url: "https://data.covid19.go.id/public/api/update.json",
            json: true
        }, (error, response, body) => {
            if (error) {
                console.log(error)
            } else {
                //Id ini sebagai data utama untuk ditampilkan
                const id = '6231855867c58d847396e2cc'
                var data = (body)
                post = new Post({
                    jumlah_positif: data.update.penambahan.jumlah_positif,
                    jumlah_meninggal: data.update.penambahan.jumlah_meninggal,
                    jumlah_sembuh: data.update.penambahan.jumlah_sembuh,
                    jumlah_dirawat: data.update.penambahan.jumlah_dirawat,
                })

                Post.findById(id)
                    .then((result) => {
                        var temp = [result.jumlah_positif, result.jumlah_meninggal, result.jumlah_sembuh, result.jumlah_dirawat];
                        
                        // Panggil data API utama
                        console.log(result)

                        // Jika data terdapat perubahan
                        if(temp[0] != post.jumlah_positif || temp[1] != post.jumlah_meninggal || temp[2] != post.jumlah_sembuh || temp[3] != post.jumlah_dirawat){
                            // console.log(result)

                            //Simpan data point ke mongoDB
                            post.save(post)
                            .then((result) => {
                                console.log("Data point baru berhasil diinsert " + today)
                                // console.log(result)
                            }).catch((err) => {
                                console.log("Some error while create post.")
                            })
                            
                            //Updated data utama
                            post = {
                                jumlah_positif: data.update.penambahan.jumlah_positif,
                                jumlah_meninggal: data.update.penambahan.jumlah_meninggal,
                                jumlah_sembuh: data.update.penambahan.jumlah_sembuh,
                                jumlah_dirawat: data.update.penambahan.jumlah_dirawat,
                            }
                            
                            Post.findByIdAndUpdate(id, post)
                                .then((result) => {
                                    if (!result) {
                                        console.log("Post not found")
                                    }else{
                                        console.log("Data berubah, diupdated")
                                    }

                                    
                                }).catch((err) => {
                                    console.log("Some error while update post.")
                                })
                        }
                        
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
});


require('./app/routes/post.routes')(app)

const PORT = 8000
app.listen(PORT, () => {
    console.log(`Server berjalan dalam http://localhost:${PORT}`)
})