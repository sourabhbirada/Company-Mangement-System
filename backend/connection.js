const { default: mongoose } = require("mongoose")


const databaseconnection = async (url) => {
    return mongoose.connect(url)
    .then((e)=> console.log("MongoDB Connected"))
}


module.exports = databaseconnection