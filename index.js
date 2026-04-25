const express = require('express');
const sequelize = require('./config/database');
const Product = require('./models/Product');
const Category = require('./models/Category');

// 1. Verificación de carga (Debug)
console.log('--- Verificando Modelos ---');
console.log('Product:', Product ? 'Cargado ✅' : 'ERROR ❌');
console.log('Category:', Category ? 'Cargado ✅' : 'ERROR ❌');

// 2. Definición de Relaciones (UN SOLA VEZ)
if (Product && Category) {
    Product.belongsTo(Category);
    Category.hasMany(Product);
    console.log('✅ Relaciones establecidas correctamente.');
} else {
    console.error('❌ Error: No se pudieron establecer relaciones porque falta un modelo.');
    process.exit(1); // Detiene el servidor si los modelos fallan
}

const app = express();
app.use(express.json());
app.use(express.static('public'));

// 3. Sincronización con Laragon
sequelize.sync({ force: false })
    .then(() => {
        console.log('✅ Base de datos sincronizada en Laragon.');
    })
    .catch(err => {
        console.error('❌ Error de sincronización:', err);
    });

// --- RUTAS API ---

// LEER (GET)
app.get('/productos', async (req, res) => {
    try {
        const productos = await Product.findAll({ include: Category }); 
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// CREAR PRODUCTO (POST)
app.post('/productos', async (req, res) => {
    try {
        const nuevoProducto = await Product.create(req.body);
        res.status(201).json({
            mensaje: '✅ Producto guardado con éxito',
            dato: nuevoProducto
        });
    } catch (error) {
        const mensajes = error.errors ? error.errors.map(e => e.message) : 'Error interno';
        res.status(400).json({ error: mensajes });
    }
});

// CREAR CATEGORÍA (POST)
app.post('/categorias', async (req, res) => {
    try {
        const categoria = await Category.create(req.body);
        res.json({ mensaje: '✅ Categoría creada', dato: categoria });
    } catch (error) {
        res.status(400).json({ error: 'Error al crear categoría' });
    }
});

// ACTUALIZAR (PUT)
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
        res.status(400).json({ error: "Error al actualizar" });
    }
});

// ELIMINAR (DELETE)
app.delete('/productos/:id', async (req, res) => {
    try {
        const eliminado = await Product.destroy({ where: { id: req.params.id } });
        if (eliminado) {
            res.json({ mensaje: '✅ Producto eliminado' });
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});