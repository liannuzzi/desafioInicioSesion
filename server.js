const express = require("express");
const { Server: HTTPServer, Server } = require("http");
const { Server: SocketServer } = require("socket.io");
const events = require("./socket_events");
const messageDAO = require("./daos/messagesDao")
const productDAO = require("./daos/productsDao")
const usuarioDAO = require("./daos/usuariosDao")
const {checkPassword, hashPassword}= require('./utils/utils')
const {Types}=require('mongoose')
const app = express();
const passport= require('passport')
const LocalStrategy=require('passport-local').Strategy
const httpServer = new HTTPServer(app);
const socketServer = new SocketServer(httpServer);
const handlebars = require("express-handlebars");
const { Router } = express;
const routerProducto = Router();


app.use("/", routerProducto);
routerProducto.use(express.static("public"));
routerProducto.use(express.json())
routerProducto.use(express.urlencoded({ extended: true }));
const hbs = handlebars.create({
  extname: ".hbs",
  defaultLayout: "index.hbs",
  layoutsDir: __dirname + "/public/views/layout",
  partialsDir: __dirname + "/public/views/partials/",
});
app.engine("hbs", hbs.engine);

app.set("views", "./public/views/partials");
app.set("view engine", "hbs");

passport.serializeUser((user,done)=>{
  console.log(user)
  done(null, user._id)
})

passport.deserializeUser(async(id,done)=>{
  idUser=Types.ObjectId(id)
  const user=await usuarioDAO.findUserById(idUser)
  console.log(user)
  done(null,user)

})

passport.use("login", new LocalStrategy(async (username,password,done)=>{
    const usuario= await usuarioDAO.findUser(username)
    const passHash=usuario.password
    if(!usuario || !checkPassword(password,passHash) ){
      console.log(`Usuario y/o contraseña invalidos`)
      return done(null,false)
    }else{
      return done(null,usuario)
    }
}))

passport.use('signup', new LocalStrategy({
  passReqToCallback:true
}, async (req,username,password,done)=>{
  const usuario= await usuarioDAO.findUser(username)
  if (usuario){
    return done(null,false,{message:'El usuario ya existe'})
  }
  const address=req.body.address
  const hashedPassword=hashPassword(password)
  const newUser= {
    username:username,
    password:hashedPassword,
    address:address
  }
  const generateUser= await usuarioDAO.saveUser(newUser)
  return done(null,generateUser)
}))


const session=require('express-session')
const MongoStore=require('connect-mongo');
const advancedOptions={useNewUrlParser:true, useUnifiedTopology:true}

routerProducto.use(session({

store:MongoStore.create({
  mongoUrl:'mongodb+srv://lucasiannu:wxRk2hMHkRguBXdU@cluster0.l96bh3b.mongodb.net/?retryWrites=true&w=majority',
  ttl:60,
  mongoOptions:advancedOptions
}),


  secret:'secret_String',
  resave:false,
  saveUninitialized:true
}))
routerProducto.use(passport.initialize());
routerProducto.use(passport.session());


routerProducto.get('/login',(req,res)=>{
  res.render('logIn.hbs')
})

routerProducto.post('/login',passport.authenticate('login',{
  failureRedirect:'/login'
}),(req,res)=>{
    req.session.user=req.user
    res.redirect('/')
})

routerProducto.get('/signup',(req,res)=>{
  res.render('signUp.hbs')
})

routerProducto.post('/signup',passport.authenticate('signup',{
  failureRedirect:'/signup'
}),(req,res)=>{
  req.session.user=req.user
    res.redirect('/login')
})

let messages = "";

routerProducto.get("/", async (req, res) => {
  try {
    const usuario=req.session.user
    const userExists=usuario?true:false
    const allProducts = await productDAO.getAll();
    if (allProducts.length > 0) {
      res.render("main.hbs", { allProducts: allProducts, arrayExists: true, userExists:userExists,usuario:usuario });
    } else {
      res.render("main.hbs", { allProducts: allProducts, arrayExists: false,userExists:userExists,usuario:usuario });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

routerProducto.get('/api/productos-test', async (req,res)=>{
  try{
    const result = await productDAO.generateProducts(5)
    res.json(result)
  }catch(err){
    res.status(400).json({ error: err.message })
  }

})

routerProducto.get('/logout', (req,res)=>{
  req.session.destroy(err=>{
    if(err){
      res.send('Error al cerrar sesion')
    }else{
      res.redirect('/login')
    }
  })
})

async function getMsg(){
  try {
    messages= await messageDAO.getAllMsg()
  } catch (error) {
    
  }
}

getMsg()

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");
  socketServer.emit("INIT", "Bienvenido al WebSocket", messages);


  socket.on(events.POST_MESSAGE, (msg) => {
    messageDAO.saveMsg(msg);
    socketServer.sockets.emit(events.NEW_MESSAGE, msg);
  });

  socket.on(events.POST_PRODUCT, (product) => {
    productDAO.saveProduct(product).then((response) => {
      socketServer.sockets.emit(events.NEW_PRODUCT, product);
    });
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando el puerto ${PORT}`);
});


