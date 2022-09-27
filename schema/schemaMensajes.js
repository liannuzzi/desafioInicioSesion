const mongoose= require ('mongoose')

const mensajeSchema=new mongoose.Schema({
    author:{type:Object,required:true},
    text:{type:String,required:true}
},{timestamps:true})


module.exports= mongoose.model('mensajes',mensajeSchema)

