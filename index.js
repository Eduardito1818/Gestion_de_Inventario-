const express = require('express');
const sequelize = require('./config/database');
const Product = require('./models/Product');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Conexión y Sincronización con Laragon
sequelize.sync({ force: false })
    .then(() => {
        console.log('✅ Conexión exitosa a Laragon y tabla sincronizada.');
    })
    .catch(err => {
        console.error('❌ Error al conectar con la base de datos:', err);
    });

// 1. LEER (GET): Obtener todos los productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Product.findAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// 2. CREAR (POST): Registrar un producto nuevo
app.post('/productos', async (req, res) => {
    try {
        const nuevoProducto = await Product.create(req.body);
        res.status(201).json({
            mensaje: '✅ Producto guardado con éxito',
            dato: nuevoProducto
        });
    } catch (error) {
        res.status(400).json({ error: 'No se pudo guardar. Revisa los datos.' });
    }
});

// 3. ACTUALIZAR (PUT): Modificar un producto por ID
app.put('/productos/:id', async (req, res) => {
    try {
        // Buscamos primero por la Llave Primaria (ID)
        const product = await Product.findByPk(req.params.id);
        
        if (product) {
            // Si existe, actualizamos con los datos que vienen en el Body
            await product.update(req.body);
            res.json({ mensaje: "✅ Actualizado con éxito" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar los datos" });
    }
});

// 4. ELIMINAR (DELETE): Borrar un registro por ID
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});