const express = require('express');
const sequelize = require('./config/database');
const Product = require('./models/Product');
const Category = require('./models/Category'); // Importación limpia

// Definición de Relaciones
Product.belongsTo(Category);
Category.hasMany(Product);

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Conexión y Sincronización
sequelize.sync({ force: false })
    .then(() => {
        console.log('✅ Conexión exitosa a Laragon y tabla sincronizada.');
    })
    .catch(err => {
        console.error('❌ Error al conectar con la base de datos:', err);
    });

// 1. LEER (GET)
app.get('/productos', async (req, res) => {
    try {
        const productos = await Product.findAll({ include: Category }); 
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// 2. CREAR (POST) - CORREGIDO
app.post('/productos', async (req, res) => {
    try {
        const nuevoProducto = await Product.create(req.body);
        res.status(201).json({
            mensaje: '✅ Producto guardado con éxito',
            dato: nuevoProducto
        });
    } catch (error) {
        // Mapea los mensajes de validación definidos en tu modelo Product.js
        const mensajes = error.errors ? error.errors.map(e => e.message) : 'Error interno';
        res.status(400).json({ error: mensajes });
    } // <--- Faltaba esta llave
}); // <--- Faltaba este paréntesis

// 3. ACTUALIZAR (PUT)
app.put('/productos/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.update(req.body);
            res.json({ mensaje: "✅ Actualizado con éxito" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar los datos" });
    }
});

// 4. ELIMINAR (DELETE)
app.delete('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Product.destroy({ where: { id: id } });
        if (eliminado) {
            res.json({ mensaje: '✅ Producto eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});
// Ruta temporal para crear categorías rápido
app.post('/categorias', async (req, res) => {
    try {
        const categoria = await Category.create(req.body);
        res.json(categoria);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear categoría' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});