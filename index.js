const express = require('express');
const { sequelize, Product, Category } = require('./models');

const app = express();
app.use(express.json());
app.use(express.static('public'));

/**
 * 🛠 CONFIGURACIÓN DE BASE DE DATOS
 * Nota: Si sigues viendo errores de "Unknown Column", cambia force: false 
 * a force: true, guarda, deja que el servidor reinicie, y luego regrésalo a false.
 */
sequelize.sync({ force: false })
    .then(() => {
        console.log('✅ Conexión con Laragon exitosa. Tablas sincronizadas.');
    })
    .catch(err => {
        console.error('❌ Error crítico de sincronización:', err.message);
    });

// --- RUTAS API ---

// 1. LISTAR: Trae productos con el nombre de su categoría
app.get('/productos', async (req, res) => {
    try {
        const productos = await Product.findAll({ 
            include: [{ 
                model: Category, 
                attributes: ['nombre'] // Solo traemos el nombre para no ensuciar el JSON
            }] 
        }); 
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error.message);
        res.status(500).json({ error: 'No se pudo cargar la lista de productos' });
    }
});

// 2. CREAR: Guarda un producto (Verifica que el CategoryId exista en HeidiSQL)
app.post('/productos', async (req, res) => {
    try {
        const nuevoProducto = await Product.create(req.body);
        res.status(201).json({ 
            mensaje: '✅ Producto guardado con éxito', 
            id: nuevoProducto.id 
        });
    } catch (error) {
        console.error("DETALLE DEL ERROR (Terminal):", error.message);
        res.status(400).json({ 
            error: "Error al guardar",
            ayuda: "Asegúrate de que la categoría (CategoryId) exista primero." 
        });
    }
});

// 3. CATEGORÍAS: Crea nuevas categorías
app.post('/categorias', async (req, res) => {
    try {
        const categoria = await Category.create(req.body);
        res.status(201).json({ mensaje: '✅ Categoría creada', id: categoria.id });
    } catch (error) {
        res.status(400).json({ error: 'La categoría ya existe o el nombre es inválido' });
    }
});

// 4. ACTUALIZAR: Modifica precio, stock o nombre
app.put('/productos/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });
        
        await product.update(req.body);
        res.json({ mensaje: "✅ Datos actualizados correctamente" });
    } catch (error) {
        res.status(400).json({ error: "Error al procesar la actualización" });
    }
});

// 5. ELIMINAR: Borra un producto del inventario
app.delete('/productos/:id', async (req, res) => {
    try {
        const resultado = await Product.destroy({ where: { id: req.params.id } });
        if (resultado) {
            res.json({ mensaje: '✅ Producto eliminado' });
        } else {
            res.status(404).json({ error: 'El producto ya no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al intentar eliminar' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});