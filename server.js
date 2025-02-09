
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const dataPath = path.join(__dirname, 'data', 'restaurants.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Obtener todos los restaurantes
app.get('/api/restaurants', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer los datos');
        res.json(JSON.parse(data));
    });
});

// Eliminar un producto del menú
app.delete('/api/restaurants/:restaurantIndex/menu/:itemIndex', (req, res) => {
    const { restaurantIndex, itemIndex } = req.params;

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer los datos');

        let restaurants = JSON.parse(data);

        if (restaurants[restaurantIndex] && restaurants[restaurantIndex].menu[itemIndex]) {
            restaurants[restaurantIndex].menu.splice(itemIndex, 1);

            fs.writeFile(dataPath, JSON.stringify(restaurants, null, 2), err => {
                if (err) return res.status(500).send('Error al guardar los cambios');
                res.send('Producto eliminado correctamente');
            });
        } else {
            res.status(404).send('Restaurante o producto no encontrado');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
