const socket = io();

socket.emit("message", "Hello from the client");

const log = document.getElementById("log");

socket.on("products", (data) => {
  let list = data.map((product) => {
    return `<li>${product.title}</li>`;
  });
  log.innerHTML = list.join("");
});

// Obtener info del formulario
const form = document.querySelector("#add-item-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const product = {
    title: e.target.title.value,
    description: e.target.description.value,
    code: e.target.code.value,
    price: e.target.price.value,
    stock: e.target.stock.value,
    thumbnail: e.target.thumbnail.value,
  }
  socket.emit("new-product", product);
  e.target.reset();
});
