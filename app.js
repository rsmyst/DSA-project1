const express = require("express");
const app = express();
const bodyParser = require("body-parser");

let orders = [];
let preparedQueue = [];
let nextOrderId = 1;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { orders: orders, preparedQueue: preparedQueue });
});

app.post("/order", (req, res) => {
  const newOrder = {
    id: nextOrderId++,
    customerName: req.body.customerName,
    menuItem: req.body.menuItem,
    status: "Preparing",
  };
  orders.push(newOrder);
  res.redirect("/");
});

app.post("/prepare/:id", (req, res) => {
  const orderId = parseInt(req.params.id);
  const orderIndex = orders.findIndex((order) => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = "Prepared";
    preparedQueue.push(orders[orderIndex]);
  }
  res.redirect("/");
});

app.post("/serve", (req, res) => {
  if (preparedQueue.length > 0) {
    const servedOrder = preparedQueue.shift();
    orders = orders.filter((order) => order.id !== servedOrder.id);
  }
  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  const orderId = parseInt(req.params.id);
  orders = orders.filter((order) => order.id !== orderId);
  res.redirect("/");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
