const { Router } = require("express");
const ProductManager = require("../class/ProductManager.js");
const path = require("path");

const router = Router();
const pathDB = path.join(__dirname, "../db/products.json");

const productManager = new ProductManager(pathDB);

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

router.get('/home', async (req, res) => {
    const products = await productManager.getProducts();
    const limit = req.query.limit;
    const data = limit ? { products: products.slice(0, limit) } : { products };
    res.render('home', data);

  });




module.exports = router;