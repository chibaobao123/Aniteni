// server.js

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 4000;
const cors = require("cors");
const mongoose = require("mongoose");
const { db } = require("./db");

//controller
const UserController = require("./controllers/user");
const ProductsController = require("./controllers/product");
const WarehouseController = require("./controllers/warehouse");
const ExportGoodsController = require("./controllers/exportGoods");

//middleware
const UserMiddleware = require("./middleware/authenticate_user");

const dbConnect = async function connect() {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database is connected");
  } catch (err) {
    console.log("Can not connect to the database " + err);
  }
};

dbConnect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/uploads", express.static("./uploads"));

app.listen(PORT, function () {
  console.log("Server is running on Port:", PORT);
});

app.use(express.json());

//users
app.post("/userLogin", UserController.signIn);

app.get("/getUsers", UserController.getUsers);

app.post(
  "/checkJWT",
  UserMiddleware.authenticate_user,
  UserController.checkJWT
);

app.post("/userRegistration", UserController.userRegistration);

app.get(
  "/getUserOwner",
  UserMiddleware.authenticate_user,
  UserController.getUserOwner
);

app.get("/getSearchUsers/:search", UserController.getSearchUsers);

app.post(
  "/userLogOut",
  UserMiddleware.authenticate_user,
  UserController.userLogOut
);

app.post(
  "/createBills",
  UserMiddleware.authenticate_user,
  UserController.createbill
);

app.post("/createNewCustomer", UserController.createNewCustomer);

//products
app.get("/searchProduct/:search", ProductsController.getSearchProduct);

app.get("/getProducts", ProductsController.getProducts);

app.get("/getUnits", ProductsController.getUnits);

app.get("/getCategory", ProductsController.getCategory);

app.post(
  "/add1Product",
  UserMiddleware.authenticate_user,
  ProductsController.uploadImageProduct,
  ProductsController.add1Product
);

// app.post('/updateProductWithImg', UserMiddleware.authenticate_user, ProductsController.uploadImageProduct, ProductsController.add1Product)
app.put(
  "/updateProduct",
  UserMiddleware.authenticate_user,
  ProductsController.updateProduct
);

//WAREHOUSE
app.get(
  "/warehouseUpdate/:page&:limit",
  UserMiddleware.authenticate_user,
  WarehouseController.warehouseupdate
);

app.get(
  "/warehouseUpdateDetail",
  UserMiddleware.authenticate_user,
  WarehouseController.warehouseupdateDetail
);

app.post(
  "/updateWarehouse",
  UserMiddleware.authenticate_user,
  WarehouseController.updateWarehouse
);

app.post(
  "/searchWarehouseUpdate",
  UserMiddleware.authenticate_user,
  WarehouseController.searchWarehouseUpdate
);

// EXPORTGOODS
app.post(
  "/exportGoods",
  UserMiddleware.authenticate_user,
  ExportGoodsController.exportGoods
);

app.post(
  "/searchExportGoods",
  UserMiddleware.authenticate_user,
  ExportGoodsController.searchExportGoods
);
