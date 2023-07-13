require("dotenv").config();
module.exports = {
  db: `mongodb+srv://huybao631999:${process.env.DB_PASSWORD}@cluster0.0d5dbtl.mongodb.net/Anteni?retryWrites=true&w=majority`,
};

// db : 'mongodb+srv://huybao631999:baobaochi123@cluster0.0d5dbtl.mongodb.net/?retryWrites=true&w=majority/Anteni',
