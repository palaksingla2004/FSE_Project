const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize("fse", "root", "P@l@k585", {
    host: "localhost",
    dialect: "mysql",
    logging: false, // Disable logging to clean up console output
});

// Define User Model
const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: true },
    cartData: { type: DataTypes.JSON, allowNull: true }
});

// Define Product Model
const Product = sequelize.define("Product", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    new_price: { type: DataTypes.FLOAT, allowNull: true },
    old_price: { type: DataTypes.FLOAT, allowNull: true },
    date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    available: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Sync models with database
sequelize.sync()
    .then(() => console.log("Database synced successfully!"))
    .catch(err => console.error("Database sync error:", err));

module.exports = { sequelize, User, Product };
