const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// To store orders
let orders = [];
let preparedQueue = [];
let nextOrderId = 1;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Route to display the orders page
app.get('/', (req, res) => {
  res.render('index', { orders: orders, preparedQueue: preparedQueue });
});

// Route to create a new order
app.post('/order', (req, res) => {
  const newOrder = {
    id: nextOrderId++,
    customerName: req.body.customerName,
    menuItem: req.body.menuItem,
    status: 'Preparing'
  };
  orders.push(newOrder);
  res.redirect('/');
});

// Route to mark an order as prepared
app.post('/prepare/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = 'Prepared';
    preparedQueue.push(orders[orderIndex]);
  }
  res.redirect('/');
});

// Route to serve the first prepared order (FIFO)
app.post('/serve', (req, res) => {
  if (preparedQueue.length > 0) {
    const servedOrder = preparedQueue.shift();
    orders = orders.filter(order => order.id !== servedOrder.id);
  }
  res.redirect('/');
});

// Route to delete an order after serving
app.post('/delete/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  orders = orders.filter(order => order.id !== orderId);
  res.redirect('/');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
