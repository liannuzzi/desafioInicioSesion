const Contenedor = require("../contenedor");
const Product = require("../schema/schemaProductos");

class ProductDAO extends Contenedor {
  constructor(Model) {
    super(Model);
    this.connect().catch(err => {
      throw new Error(`ERROR INICIALIZACION DAO ${err}`)
    });
  }
}

const productDAO = new ProductDAO(Product);

module.exports = productDAO;
