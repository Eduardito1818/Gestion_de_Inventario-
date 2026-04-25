const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: {
            notEmpty: { msg: "El nombre es obligatorio" },
            len: { args: [3, 60], msg: "El nombre debe tener entre 3 y 60 caracteres" }
        }
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
        validate: {
            isDecimal: { msg: "El precio debe ser un número válido" },
            min: { args: [0.01], msg: "El precio debe ser mayor a cero" }
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isInt: { msg: "El stock debe ser un número entero" },
            min: { args: [0], msg: "El stock no puede ser negativo" }
        }
    }
}, {
    timestamps: true 
});

module.exports = Product;