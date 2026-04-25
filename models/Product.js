const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definimos el modelo "Product" con validaciones de seguridad
const Product = sequelize.define('Product', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "El nombre no puede estar vacío" },
            len: { 
                args: [3, 50], 
                msg: "El nombre debe tener entre 3 y 50 caracteres" 
            }
        }
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: "El precio debe ser un número válido" },
            min: { 
                args: [0.01], 
                msg: "El precio debe ser mayor a 0" 
            }
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false, // Cambiado a false para obligar a tener un valor inicial
        defaultValue: 0,
        validate: {
            isInt: { msg: "El stock debe ser un número entero" },
            min: { 
                args: [0], 
                msg: "El stock no puede ser negativo" 
            }
        }
    }
}, {
    // Añade automáticamente createdAt y updatedAt
    timestamps: true 
});

module.exports = Product;