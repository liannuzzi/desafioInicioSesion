const Contenedor = require("../contenedor");
const Message = require("../schema/schemaMensajes");

class MessageDao extends Contenedor {
  constructor(Model) {
    super(Model);
    this.connect().catch(err => {
      throw new Error(`ERROR INICIALIZACION DAO ${err}`)
    });
  }
}

const messageDao = new MessageDao(Message);

module.exports = messageDao;
