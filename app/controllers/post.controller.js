const db = require('../models')
const Post = db.posts
const request = require('request')
var cron = require('node-cron')



// Untuk Get data
exports.findAll = (req, res) => {

    const id = '6231855867c58d847396e2cc'

    Post.findById(id)
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.status(409).send({
                message: err.message || "Some error while show post."
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

                        // Panggil data pada API utama
                        // console.log(result)

                        // Jika data terdapat perubahan
                        if (temp[0] != post.jumlah_positif || temp[1] != post.jumlah_meninggal || temp[2] != post.jumlah_sembuh || temp[3] != post.jumlah_dirawat) {
                            // console.log(result)

                            //Simpan data point ke mongoDB
                            post.save(post)
                                .then((result) => {
                                    console.log("Data point baru berhasil diinsert")
                                        // console.log(result)
                                }).catch((err) => {
                                    // console.log("Some error while create post.")
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
                                    } else {
                                        console.log("Data berubah, diupdated pada: " + today)
                                    }


                                }).catch((err) => {
                                    // console.log("Some error while update post.")
                                })
                        }

                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
    });

    // Post.find()
    //     .then((result) => {
    //         res.send(result)
    //     }).catch((err) => {
    //         res.status(500).send({
    //             message: err.message || "Some error while retreieving posts."
    //         })
    //     });

}


// Dibawah untuk latihan

// Membuat (Simpan) data covid dalam MongoDB
exports.create = (req, res) => {

    request({
        url: "https://data.covid19.go.id/public/api/update.json",
        json: true
    }, (error, response, body) => {
        if (error) {
            console.log(error)
        } else {
            var data = (body)
            post = new Post({
                jumlah_positif: data.update.penambahan.jumlah_positif,
                jumlah_meninggal: data.update.penambahan.jumlah_meninggal,
                jumlah_sembuh: data.update.penambahan.jumlah_sembuh,
                jumlah_dirawat: data.update.penambahan.jumlah_dirawat,
            })

            post.save(post)
                .then((result) => {
                    res.send(result)
                }).catch((err) => {
                    res.status(409).send({
                        message: err.message || "Some error while create post."
                    })
                })
        }
    })


}

// Membaca 1 data
exports.findOne = (req, res) => {
    const id = req.params.id

    Post.findById(id)
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.status(409).send({
                message: err.message || "Some error while show post."
            })
        })
}

// Update data
exports.update = (req, res) => {
    const id = '6231855867c58d847396e2cc';

    post = {
        jumlah_positif: 6,
        jumlah_meninggal: 5,
        jumlah_sembuh: 5,
        jumlah_dirawat: 5,
    }

    Post.findByIdAndUpdate(id, post)
        .then((result) => {
            if (!result) {
                res.status(404).send({
                    message: "Post not found"
                })
            }

            res.send({
                message: "Post was updated"
            })

            console.log("Post data updated");
        }).catch((err) => {
            res.status(409).send({
                message: err.message || "Some error while update post."
            })
        })

    // request({
    //     url: "https://data.covid19.go.id/public/api/update.json",
    //     json: true
    // }, (error, response, body) => {
    //     if (error) {
    //         console.log(error)
    //     } else {
    //         const id = req.params.id;
    //         var data = (body)
    //         post = new Post({
    //             jumlah_positif: data.update.penambahan.jumlah_positif,
    //             jumlah_meninggal: data.update.penambahan.jumlah_meninggal,
    //             jumlah_sembuh: data.update.penambahan.jumlah_sembuh,
    //             jumlah_dirawat: data.update.penambahan.jumlah_dirawat,
    //         })

    //         Post.findByIdAndUpdate(id, post)
    //             .then((result) => {
    //                 if (!result) {
    //                     res.status(404).send({
    //                         message: "Post not found"
    //                     })
    //                 }

    //                 res.send({
    //                     message: "Post was updated"
    //                 })

    //                 console.log("berhasil");
    //             }).catch((err) => {
    //                 res.status(409).send({
    //                     message: err.message || "Some error while update post."
    //                 })
    //             })
    //     }
    // })
}

//Hapus data
exports.delete = (req, res) => {
    const id = req.params.id

    Post.findByIdAndRemove(id)
        .then((result) => {
            if (!result) {
                res.status(404).send({
                    message: "Post not found"
                })
            }

            res.send({
                message: "Post was deleted"
            })
        }).catch((err) => {
            res.status(409).send({
                message: err.message || "Some error while delete post."
            })
        })
}
