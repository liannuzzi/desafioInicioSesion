const mongoose= require ('mongoose')

const productoSchema=new mongoose.Schema({
    title:{type:String,required:true},
    price:{type:Number,required:true},
    thumbnail:{type:String,required:true},
},{timestamps:true})


module.exports= mongoose.model('productos',productoSchema)

