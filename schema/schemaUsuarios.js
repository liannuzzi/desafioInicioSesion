const mongoose= require ('mongoose')

const usuarioSchema=new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    address:{type:String, required:true}
},{timestamps:true})


module.exports= mongoose.model('usuarios',usuarioSchema)
