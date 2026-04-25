const sequelize = require('../config/database');
const ProductFactory = require('./Product');
const CategoryFactory = require('./Category');

// Creamos los modelos usando la MISMA instancia de sequelize
const Product = ProductFactory(sequelize);
const Category = CategoryFactory(sequelize);

// RELACIONES: Ahora sí funcionarán porque comparten el mismo padre
Product.belongsTo(Category, { foreignKey: 'CategoryId' });
Category.hasMany(Product, { foreignKey: 'CategoryId' });

module.exports = { 
    sequelize, 
    Product, 
    Category 
};