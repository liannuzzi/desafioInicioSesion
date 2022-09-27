const {faker} = require('@faker-js/faker'); 
const mongoose = require('mongoose');
const config = require("./config");
const uriString = config.uriString;



class Contenedor {
  constructor(model) {
    this.uriString = uriString;
    this.Model = model;
    if (this.Model) {
      this.collection = this.Model.modelName;
    }
  }

  async connect() {
    try {
      return await mongoose.connect(this.uriString);
    } catch (err) {
      throw new Error(`ERROR DE CONEXION + ${err}`);
    }
  }

  async getAll() {
    try {
      const result = await this.Model.find();
      return result;
    } catch (err) {
      throw new Error(`ERROR AL BUSCAR DATOS: ${err}`);
    }
  }

  async saveProduct(object) {
    try {
      const document = new this.Model(object);
      const result = await document.save();
      return result;
    } catch (err) {
      throw new Error(`ERROR AL GUARDAR: ${err}`);
    }
  }

  async getAllMsg() {
    try {
      const result = await this.Model.find();
      return result;
    } catch {
      (error) => {
        console.log("No se puede leer la base de datos", error);
      };
    }
  }

  async saveMsg(object) {
    try {
      const document = new this.Model(object);
      const result = await document.save();
      return result;
    } catch (err) {
      throw new Error(`ERROR AL GUARDAR: ${err}`);
    }
  }

  async generateProducts(n){
    try{
      const products=[]
      for(let i=0;i<n;i++){
        const _products={
          title:faker.vehicle.vehicle(),
          price:faker.finance.amount(1,1000,2),
          thumbnail:faker.image.transport()
        }
        products.push(_products)
      }
      return products
      
    }catch{
      (error) => {
        console.log("No se puede leer la base de datos", error);
      };
    }
  }

  async findUser(user){
    try {
      const result = await this.Model.findOne({username:user});
      return result
    } catch (error) {
      console.log("No se puede leer la base de datos", error);
    }
  }

  async findUserById(id){
    try {
      const result = await this.Model.findOne({_id:id});
      return result
    } catch (error) {
      console.log("No se puede leer la base de datos", error);
    }
  }

  async saveUser(newUser) {
    try {
      const document = new this.Model(newUser);
      const result = await document.save();
      return result;
    } catch (err) {
      throw new Error(`ERROR AL GUARDAR: ${err}`);
    }
  }


}

module.exports = Contenedor;
