const express = require("express");
const fs = require("fs");
const app = express();
const URL_STATS = "./server/log/stats.json";

const calculate = (cart) => {
  cart.countGoods = cart.contents.length;
  cart.amount = 0;
  cart.contents.forEach((element) => {
    cart.amount += element.price * element.quantity;
  });
};

const addStatisticsToLog = (message, action, product) => {
  let now = new Date();
  fs.readFile(URL_STATS, "utf-8", (err, data) => {
    if (err) console.log("Error:", err);
    else {
      if (data) {
        let log = JSON.parse(data);
        log.push({
          date: now,
          action: action,
          product: product,
          log: message,
        });
        fs.writeFile(URL_STATS, JSON.stringify(log, null, 2), (err) => {
          if (err) console.log("Error:", err);
          else return;
        });
      }
    }
  });
};

app.use(express.json());
app.use("/", express.static("./public"));

app.get("/api/products", (req, res) => {
  fs.readFile("./server/db/products.json", "utf-8", (err, data) => {
    if (err) res.send(JSON.stringify({ result: 0, err }));
    else res.send(data);
  });
  addStatisticsToLog(
    "GET request was made to /api/products",
    "received",
    "products list"
  );
});

app.get("/api/cart", (req, res) => {
  fs.readFile("./server/db/userCart.json", "utf-8", (err, data) => {
    if (err) res.send(JSON.stringify({ result: 0, err }));
    else res.send(data);
  });
  addStatisticsToLog(
    "GET request was made to /api/cart",
    "received",
    "cart list"
  );
});

app.post("/api/cart", (req, res) => {
  fs.readFile("./server/db/userCart.json", "utf-8", (err, data) => {
    if (err) res.send(JSON.stringify({ result: 0, err }));
    else {
      const cart = JSON.parse(data);
      cart.contents.push(req.body);

      calculate(cart);

      fs.writeFile(
        "./server/db/userCart.json",
        JSON.stringify(cart, null, 2),
        (err) => {
          if (err) res.end(JSON.stringify({ result: 0, err }));
          else res.end(JSON.stringify({ result: 1 }));
        }
      );
    }
  });
  addStatisticsToLog(
    "POST request was made to /api/cart",
    "added",
    req.body.product_name
  );
});

app.put("/api/cart/:id", (req, res) => {
  fs.readFile("./server/db/userCart.json", "utf-8", (err, data) => {
    if (err) res.send(JSON.stringify({ result: 0, err }));
    else {
      const cart = JSON.parse(data);
      const find = cart.contents.find(
        (good) => good.id_product === Number(req.params.id)
      );
      find.quantity += req.body.quantity;

      calculate(cart);

      fs.writeFile(
        "./server/db/userCart.json",
        JSON.stringify(cart, null, 2),
        (err) => {
          if (err) res.end(JSON.stringify({ result: 0, err }));
          else res.end(JSON.stringify({ result: 1 }));
        }
      );
      addStatisticsToLog(
        `PUT request was made to /api/cart/${req.params.id}`,
        "added",
        find.product_name
      );
    }
  });
});

app.delete("/api/cart/delete/:id", (req, res) => {
  res.end(JSON.stringify({ result: 1 }));
  fs.readFile("./server/db/userCart.json", "utf-8", (err, data) => {
    if (err) res.send(JSON.stringify({ result: 0, err }));
    else {
      const cart = JSON.parse(data);
      const find = cart.contents.find(
        (good) => good.id_product === Number(req.params.id)
      );

      if (find.quantity > 1) find.quantity--;
      else cart.contents.splice(cart.contents.indexOf(find), 1);

      calculate(cart);

      fs.writeFile(
        "./server/db/userCart.json",
        JSON.stringify(cart, null, 2),
        (err) => {
          if (err) res.end(JSON.stringify({ result: 0, err }));
          else res.end(JSON.stringify({ result: 1 }));
        }
      );
      addStatisticsToLog(
        `DELETE request was made to /api/cart/delete/${req.params.id}`,
        "deleted",
        find.product_name
      );
    }
  });
});

app.listen(5555, () => {
  console.log("Server started!");
});
