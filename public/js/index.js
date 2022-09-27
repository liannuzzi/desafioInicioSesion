// Client web socket
const date = Date.now();
const today = new Date(date);
const socket = io();


socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("INIT", (msg, allMessages) => {
  document.getElementById("posts").innerHTML = " ";
  for (let msg of allMessages) {
    appendMessage(msg);
  }
});

socket.on("NEW_MESSAGE", (msg) => {
  appendMessage(msg);
});

socket.on("NEW_PRODUCT", (product) => {
  agregarProductoGrilla(product);
});

function enviarMensaje() {
  const email = document.getElementById("email").value;
  const nombre = document.getElementById("nombre").value
  const apellido = document.getElementById("apellido").value
  const edad = document.getElementById("edad").value
  const alias = document.getElementById("alias").value
  const avatar = document.getElementById("avatar").value
  const mensaje = document.getElementById("mensaje").value;

  socket.emit("POST_MESSAGE", {author:{email,nombre,apellido,edad,alias,avatar},text:mensaje, date:today.toLocaleString()});
}

function appendMessage(msg) {
  document.getElementById("posts").innerHTML += `
    <div class='post ui card'>
        <div class='div ui container'>
        ${msg.author.email} [${msg.createdAt}]: ${msg.text} <img
        style="width: 40px ;"
        src="${msg.thumbnail}"
        alt=""
        srcset=""
      />
        </div>
    </div>
    `
}

function guardarProducto() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;

  socket.emit("POST_PRODUCT", { title, price, thumbnail });
}

function agregarProductoGrilla(product) {
  const tableExists = document.getElementById("tabla");
  console.log(tableExists);
  if (tableExists) {
    document.getElementById("tablebody").innerHTML += `
        <tr>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td><img
                style="width: 40px ;"
                src="${product.thumbnail}"
                alt=""
                srcset=""
              /></td>
          </tr>`;
  }
}
function logout(){
  const logoutBtn=document.getElementById("logout");
  document.getElementById("page").innerHTML='Hasta luego!'
  setTimeout(function(){
    location.href='/logout';
}, 2000);

  
}