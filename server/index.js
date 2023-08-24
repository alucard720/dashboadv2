const express = require("express");
const cors = require("cors");
require("./db/config");
require("dotenv").config();
const User = require("./db/User");
const Product = require("./db/Product");
const Candidatos = require("./db/candidatos");
const jwt = require("jsonwebtoken");
const jwkey = "e-comm";
const app = express();

app.use(express.json());
app.use(cors());

/////

app.get("/", (req, resp) => {
  resp.send("App is Working");
  // You can check backend is working or not by
  // entering http://loacalhost:5000

  // If you see App is working means
  // backend working properly
});

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  jwt.sign({ result }, jwkey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send("somingthin went wrong");
    }
    res.send({ result, auth: token });
  });
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      jwt.sign({ user }, jwkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({ result: "somthing went wrong, please try again" });
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: "user not found" });
    }
  } else {
    res.send({ result: "user not found" });
  }
});

app.post("/add-product", verifyToken, async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.status(200).json(result);
});

app.get("/candidatos", async (req, res) => {
  const candidatos = await Candidatos.find();
  if (candidatos.length > 0) {
    res.send(candidatos);
  } else {
    res.send({ result: "candidatos no encontrados" });
  }
});
app.get("/product-list", async (req, res) => {
  const nombres = await Product.find();
  if (nombres.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "no product found" });
  }
});

app.delete("/product/:id", async (req, res) => {
  let result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
  // const {id} = req.params.id
  // const erase = await Product.deleteOne(id)
});

app.get("/product/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });

  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No record found" });
  }
});

app.put("/product/:id", async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

app.get("/search/:key", verifyToken, async (req, res) => {
  let result = await Product.find({
    $or: [
      {
        name: { $regex: req.params.key },
      },
      {
        price: { $regex: req.params.key },
      },
      {
        category: { $regex: req.params.key },
      },
      {
        company: { $regex: req.params.key },
      },
    ],
  });
  res.send(result);
});

function verifyToken(req, res, next) {
  console.warn(req.headers["authorization"]);
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, jwkey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "Please provide a valid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "Please provide a token" });
  }
}

//server Ports
const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running in ${port}`));
