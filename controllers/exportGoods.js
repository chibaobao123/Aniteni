const _ = require("lodash");
require("dotenv").config();

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const moment = require("moment-timezone");
const ExportGoods = require("../models/exportGoods");
const Products = require("../models/productsSchema");
const ExportGoodsDetail = require("../models/exportGoodsDetail");
const dateVietNam = moment.tz(Date.now(), "Asia/Ho_Chi_Minh").format();

module.exports.exportGoods = async (req, res) => {
  try {
    let decodedToken = res.locals.currentUser;
    let arr = req.body;
    // console.log(decodedToken, arr);

    let totalQuantity = 0;

    let count = await arr.ProductList.forEach((e) => {
      totalQuantity += e.quantity;
    });

    const newExportGoods = await ExportGoods.create({
      user: decodedToken.userId,
      userCreate: arr.Information._id,
      quantity: Number(totalQuantity),
    });

    let newExportGoodsDetail = await arr.ProductList.forEach((e) => {
      let exportGoodsDetail = ExportGoodsDetail.create({
        update_warehouse: newExportGoods._id,
        product: e.product,
        quantity: e.quantity,
      });

      let minusNumber = -Number(e.quantity);

      let update_product = Products.updateOne(
        { _id: e.product },
        { $inc: { quantity: minusNumber } },
        function (err, data) {
          if (err) {
            return console.log(err);
          }
          // console.log("UPDATED: " + data);
        }
      );
    });

    const resData = await ExportGoods.find().populate("user");
    // // console.log(UpdateWarehouse);

    return res.status(200).json({
      success: true,
      data: resData.slice(0, 10),
      length: resData.length,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports.searchExportGoods = async (req, res) => {
  try {
    let { ma, startDate, endDate } = req.body[1].dates;
    let { limit, currentPage } = req.body[0].filter;

    console.log(startDate, endDate);

    let data = await ExportGoods.find({
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

    console.log(indexOfLastItem, indexOfFirstItem);

    let newExportGoods = await [...data];
    console.log(newExportGoods);
    newExportGoods = await newExportGoods.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    return res.status(200).json({
      success: true,
      data: newExportGoods,
      length: data.length,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};
