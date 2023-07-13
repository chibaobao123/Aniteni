const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/userSchema");
const Customer = require("../models/customers");
const Login = require("../models/loginSchema");
const Bills = require("../models/bills");
const BillDetails = require("../models/BillDetails");
const saltRounds = 10;

module.exports.getUsers = async (req, res) => {
  try {
    const user = await User.find();

    return res.status(200).json({
      success: true,
      count: user.length,
      data: user,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports.checkJWT = async function (req, res, next) {
  try {
    let decodedToken = res.locals.currentUser;
    // console.log(decodedToken);

    const user = await User.findOne({ TaiKhoan: decodedToken.TaiKhoan });
    // console.log(user);

    if (_.isNil(user)) {
      // console.log(_.isNil(user));
      res.status(200).json({
        message: false,
      });
    } else {
      res.status(200).json({
        message: true,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};

module.exports.userRegistration = async (req, res) => {
  try {
    // console.log(req.body.data);
    let objUser = req.body.data;

    const userSignUp = await User.findOne({ TaiKhoan: objUser.TaiKhoan });

    if (_.isNil(userSignUp)) {
      let hash = await generatePasswordHash(req.body.data);
      objUser.MatKhau = hash;
      if (hash) {
        const user = await User.create(objUser);
        // let userLogin = await Login.create(objUser);
        if (!_.isNil(user)) {
          res.status(200).json({
            token: generateJWTToken(user),
            user,
            access: true,
          });
        }
      }
    } else {
      res.status(200).json({ access: false });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

function generatePasswordHash(query, cb) {
  let password = query.MatKhau.toString();
  return bcrypt.hash(password, saltRounds);
}

function comparePassword(plaintextPassword, hash) {
  const result = bcrypt.compare(plaintextPassword, hash);
  result
    .then((result) => {
      // console.log(result)
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  return result;
}

function generateJWTToken(user) {
  return jwt.sign(
    { TaiKhoan: user.TaiKhoan, userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET
  );
}

module.exports.signIn = async function (req, res, next) {
  // console.log(req.body.data);
  let { TaiKhoan, MatKhau } = req.body.data;
  if (_.isNil(TaiKhoan) || _.isNil(MatKhau)) {
    return res.status(400).json({ message: "Đăng nhập không hợp lệ" });
  }

  let user = await User.findOne({ TaiKhoan: TaiKhoan });
  // console.log(user)

  if (_.isNil(user)) {
    return res.status(400).json({ message: "Người dùng không tồn tại" });
  }

  let isAuth = await comparePassword(MatKhau, user.MatKhau);
  // console.log(isAuth);

  if (isAuth) {
    let objUser = { ...req.body.data };
    let hash = await generatePasswordHash(objUser);
    objUser.MatKhau = hash;
    let userLogin = await Login.create(objUser);
    let tokenUser = generateJWTToken(user);
    let tokenUserLogin = generateJWTToken(userLogin);
    // console.log(tokenUser)
    // console.log(tokenUserLogin)
    return res.status(200).json({
      tokenUserLogin: tokenUserLogin,
      tokenUser: tokenUser,
      success: true,
      message: "Đăng nhập thành công",
    });
  } else {
    return res
      .status(401)
      .json({ message: "Tài khoản hoặc mật khẩu không đúng" });
  }
};

module.exports.userLogOut = async (req, res) => {
  try {
    let decodedToken = res.locals.currentUser;

    const filter = {
      _id: decodedToken.userId,
      TaiKhoan: decodedToken.TaiKhoan,
    };
    const update = { logoutAt: Date.now() };

    let currentUser = await Login.findOneAndUpdate(filter, update, {
      useFindAndModify: false,
    });
    res.status(200).json({
      message: "Đăng xuất thành công",
    });
  } catch {
    res.status(400).json({
      message: "Bad request",
    });
  }
};

module.exports.getUserOwner = async function (req, res, next) {
  try {
    let decodedToken = res.locals.currentUser;
    let currentUser = await User.findOne({ TaiKhoan: decodedToken.TaiKhoan });

    res.status(200).json({
      user: currentUser,
      message: "load người dùng thành công",
    });
  } catch {
    res.status(400).json({
      message: "Bad request",
    });
  }
};

module.exports.getSearchUsers = async (req, res) => {
  const search = req.params.search;

  const users = await Customer.find({
    phone: { $regex: search },
  });

  return res.status(200).json({
    users: users,
  });
};

module.exports.createbill = async (req, res) => {
  console.log(req.body);
  console.log(res.locals.currentUser);

  let user_id = res.locals.currentUser.userId;
  let customer_id = req.body.custumer._id;
  let totalOrder = req.body.cast.TongTien;
  let paymentMethods = req.body.cast.PhuongThucThanhToan;
  let note = req.body.cast.note;

  if (customer_id != -1) {
    const bill = await Bills.create({
      user: user_id,
      customer: customer_id,
      totalOrder: totalOrder,
      paymentMethods: paymentMethods,
      note: note,
    });
    let billDetails = await req.body.products.forEach((e) => {
      let billDetail = BillDetails.create({
        bill: bill._id,
        product: e._id,
        quantity: e.soLuong,
      });
    });
  }
};

module.exports.createNewCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(200).json({
      customer: customer,
      message: "Tạo khách hàng mới thành công !!!",
    });
  } catch {
    res.status(400).json({
      message: "Bad request",
    });
  }
};
