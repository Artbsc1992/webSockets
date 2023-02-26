const express = require('express');
const handlerbars = require('express-handlebars');
const { Server } = require('socket.io');
const productRouter = require('./routes/products.routes.js');
const path = require('path');
const fs = require('fs/promises');
const ProductManager = require('./class/ProductManager.js');

const viewsRouter = require('./routes/views.routes.js');

const productsPath = path.join(__dirname, './db/products.json');

const productManager = new ProductManager(productsPath);

const PORT = 3000;

const app = express();

// Handlebars config
app.engine('handlebars', handlerbars.engine());
app.set('views', path.join(`${__dirname}/views`));
app.set('view engine', 'handlebars');

app.use (express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', viewsRouter);

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// products routes

const BASE_PRODUCT = "/api/products";
app.use(`${BASE_PRODUCT}`, productRouter)

// websocket products

const io = new Server(server);

io.on('connection', async (socket) => {
  console.log('Cliente conectedo');
  let listOfProducts = await fs.readFile(productsPath, 'utf-8');
  // emit list of products when client connects
  socket.emit('products', JSON.parse(listOfProducts));

  // listen for new product
  socket.on('new-product', async (product) => {
    const newProduct = {
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      thumbnail: product.thumbnail,
      stock: product.stock,
    }
    try {
      const addedProduct = await productManager.addProduct(newProduct);
      return addedProduct;
    } catch (error) {
      return error;
    }

  });



});