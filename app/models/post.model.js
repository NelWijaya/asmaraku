module.exports = (mongoose) => {
    const schema = mongoose.Schema({
        jumlah_positif: Number,
        jumlah_meninggal: Number,
        jumlah_sembuh: Number,
        jumlah_dirawat: Number,
    }, {
        timestamps: true
    })

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const Post = mongoose.model("posts", schema)
    return Post
}