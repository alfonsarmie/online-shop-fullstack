const { Sequelize } = require('sequelize');


const db = new Sequelize('online_shop_fullstack_rowing', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false
});



const connectDB = async () => {
  try {
    await db.authenticate();
    console.log('Db connection done.');
  } catch (error) {
    console.error('Could not connect to database:', error);
  }

}

module.exports = { 
    db, 
    connectDB
};

