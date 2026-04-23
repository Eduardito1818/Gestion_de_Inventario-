const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definimos cómo se verá un "Producto" en nuestra base de datos
const Product = sequelize.define('Product', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0 
    }
}, {
    // Esto añade automáticamente columnas de "creado el" y "actualizado el"
    timestamps: true 
});

module.exports = Product;