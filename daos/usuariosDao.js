const Contenedor = require("../contenedor");
const Usuario = require("../schema/schemaUsuarios");

class UsuarioDao extends Contenedor {
  constructor(Model) {
    super(Model);
    this.connect().catch(err => {
      throw new Error(`ERROR INICIALIZACION DAO ${err}`)
    });
  }
}

const usuarioDAO = new UsuarioDao(Usuario);

module.exports = usuarioDAO;