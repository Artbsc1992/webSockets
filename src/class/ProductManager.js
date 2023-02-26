const fs = require('fs/promises')

class ProductManager {
  static id = 1;
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    try {
    const { title, description, code, price, thumbnail, stock  } = product;
    const chekedProduct = await this.#checkparams({ title, description, code, price, thumbnail, stock  });
    const listOfProducts = await this.getProducts();
    if (chekedProduct) {
      const lastId = listOfProducts[listOfProducts.length - 1].id;
      const newProduct = { id: lastId + 1, ...product };
      listOfProducts.push(newProduct);
      fs.writeFile(this.path, JSON.stringify(listOfProducts), 'utf-8');
      return true;
    }
    } catch (error) {
      console.log(error);
      return false;
    }

  }

  async getProducts() {
    try {
      const existFile = await this.#checkDB();
      if(existFile){
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
      } else {
        console.log('Writing file...')
        await fs.writeFile(this.path, JSON.stringify([]), 'utf-8');
      }
      console.log('Reading file...')
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find(product => product.id === parseInt(id));
      return product;
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter(product => product.id !== parseInt(id));
      fs.writeFile(this.path, JSON.stringify(filteredProducts), 'utf-8');
      console.log('Product deleted');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // async updateProduct(id, product) {
  //   try {
  //     const products = await this.getProducts();
  //     const productIndex = products.findIndex(product => product.id === id);
  //     products[productIndex] = { id, ...product };
  //     fs.writeFile(this.path, JSON.stringify(products), 'utf-8');
  //     console.log('Product updated');
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // async deleteProduct(id) {
  //   try{
  //     if(!id){
  //       throw new Error('Missing id')
  //     }
  //     const products = await this.getProducts(); 
  //     const filteredProducts = products.filter(product => product.id !== id);
  //     fs.writeFile(this.path, JSON.stringify(filteredProducts), 'utf-8');
  //     console.log('Product deleted');
  //   } catch(error){
  //     console.log(error);
  //     return error;
  //   }
  // }


  async #checkDB() {
    try {
      await fs.access(this.path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async #checkparams({ title, description, code, price, thumbnail, stock }) {
    const err = new Error("Product already exists")
    const errorLocal = new Error("Invalid data");
    const productList = await this.getProducts();
    if (!title || !description || !code || !price || !stock) {
      console.log(errorLocal);
      return false;
    } else if (productList.find(product => product.code === code)) {
      console.log(err);
      return false;
    }
    return true;
  }
}

module.exports = ProductManager;