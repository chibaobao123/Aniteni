const _ = require("lodash");
require("dotenv").config();

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const moment = require("moment-timezone");
const dateVietNam = moment.tz(Date.now(), "Asia/Ho_Chi_Minh").format();

const updateWarehouse = require("../models/updateWarehouse");
const updateWarehouseDetail = require("../models/updateWarehouseDetail");
const Products = require("../models/productsSchema");
const UpdateWarehouse = require("../models/updateWarehouse");

module.exports.warehouseupdate = async (req, res) => {
  try {
    const { page, limit } = req.params;
    // console.log(page, limit);
    const UpdateWarehouse = await updateWarehouse.find().populate("user");

    let indexOfLastItem = page * limit;
    let indexOfFirstItem = indexOfLastItem - limit;

    let newUpdateWarehouse = [...UpdateWarehouse];
    newUpdateWarehouse = await newUpdateWarehouse.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    return res.status(200).json({
      data: newUpdateWarehouse,
      length: UpdateWarehouse.length,
      currentPage: page,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports.warehouseupdateDetail = async (req, res) => {
  try {
    let id = req.query.id;

    let warehouse_update_detail = await updateWarehouseDetail
      .find({
        update_warehouse: id,
      })
      .populate("product");

    if (_.isNil(warehouse_update_detail)) {
      return res.status(200).json({
        message: false,
      });
    }
    return res.status(200).json({
      message: true,
      data: warehouse_update_detail,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports.updateWarehouse = async (req, res) => {
  try {
    let decodedToken = res.locals.currentUser;
    let arrProducts = req.body;
    // console.log(decodedToken, arrProducts);

    let totalQuantity = 0;
    let total = 0;

    let count = await arrProducts.forEach((e) => {
      totalQuantity += e.quantity;
      total += e.price * e.quantity;
    });

    const newUpdateWarehouse = await updateWarehouse.create({
      user: decodedToken.userId,
      quantity: Number(totalQuantity),
      total: total,
    });
    let newUpdateWarehouseDetail = arrProducts.forEach((e) => {
      let UpdateWarehouseDetail = updateWarehouseDetail.create({
        update_warehouse: newUpdateWarehouse._id,
        product: e.product,
        quantity: e.quantity,
      });

      let update_product = Products.updateOne(
        { _id: e.product },
        { $inc: { quantity: Number(e.quantity) } },
        function (err, data) {
          if (err) {
            return console.log(err);
          }
          // console.log("UPDATED: " + data);
        }
      );
    });

    const UpdateWarehouse = await updateWarehouse.find().populate("user");
    // console.log(UpdateWarehouse);

    return res.status(200).json({
      success: true,
      data: UpdateWarehouse,
      currentPage: 1,
      length: UpdateWarehouse.length,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports.searchWarehouseUpdate = async (req, res) => {
  try {
    let { ma, startDate, endDate } = req.body[1].dates;
    let { limit, currentPage } = req.body[0].filter;

    let data = await UpdateWarehouse.find({
      $or: [
        { _id: new ObjectId(ma.length < 12 ? "123456789012" : ma) },
        {
          created: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      ],
    }).populate("user");

    let indexOfLastItem = currentPage * limit;
    let indexOfFirstItem = indexOfLastItem - limit;

    let newUpdateWarehouse = [...data];
    newUpdateWarehouse = await newUpdateWarehouse.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    return res.status(200).json({
      data: newUpdateWarehouse,
      length: data.length,
      currentPage: currentPage,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};
