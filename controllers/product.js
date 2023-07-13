const _ = require('lodash')
require('dotenv').config()

const multer = require('multer');
const path = require('path')

const Products = require('../models/productsSchema')
const Units = require('../models/units')
const Category = require('../models/category')

module.exports.getSearchProduct = async (req, res) => {
    try {
        const search = req.params.search
        const products = await Products.find({
            $or: [
                { name: { $regex: search } },
                { code: { $regex: search } },
            ]
        });

        console.log(products)

        return res.status(200).json({
            products: products,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message })
    }
}

module.exports.getProducts = async (req, res) => {
    try {
        const products = await Products.find()
        // .populate('unit')
        // .populate('category')

        return res.status(200).json({
            products: products,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message })
    }
}

module.exports.getUnits = async (req, res) => {
    try {
        const units = await Units.find();

        return res.status(200).json({
            units: units,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message })
    }
}

module.exports.getCategory = async (req, res) => {
    try {
        const category = await Category.find();

        return res.status(200).json({
            category: category,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message })
    }
}

// 8. Upload Image Controller

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads\\products')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

module.exports.uploadImageProduct = multer({
    storage: storage,
    limits: { fileSize: '100000000' },
    fileFilter: (req, file, cb) => {
        console.log(file)
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
    }
}).single('photoProduct')


module.exports.add1Product = async (req, res) => {
    try {
        const product = await Products.create({ ...req.body, image: req.file.path, user: res.locals.currentUser.userId });

        return res.status(200).json({
            product: product,
        });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message })
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        const filter = {
            _id: req.body._id,
        };
        const product = await Products.findOneAndUpdate(
            {
                filter,
                userUpdate: res.locals.currentUser.userId
            }
        );

        return res.status(200).json({
            product: product,
        });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message })
    }
}

