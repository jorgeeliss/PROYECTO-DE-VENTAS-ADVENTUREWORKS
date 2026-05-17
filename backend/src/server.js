require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Product = require('./models/Product');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const User = require('./models/User');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Función para inicializar la DB con datos semilla si está vacía
async function seedDatabase() {
  const count = await Product.count();
  if (count === 0) {
    console.log('Sembrando base de datos con productos iniciales...');
    await Product.bulkCreate([
      {
        name: 'Mountain-200 Black, 38',
        category: 'Bicicletas',
        subCategory: 'Mountain',
        price: 2294,
        rating: 4.9,
        reviews: 128,
        isBestSeller: false,
        image: 'http://localhost:5173/images/products/mountain_bike_black.png'
      },
      {
        name: 'Road-250 Red, 44',
        category: 'Bicicletas',
        subCategory: 'Road',
        price: 2443,
        originalPrice: 2700,
        rating: 4.8,
        reviews: 204,
        isBestSeller: true,
        image: 'http://localhost:5173/images/products/road_bike_red.png'
      },
      {
        name: 'Touring-1000 Yellow, 60',
        category: 'Bicicletas',
        subCategory: 'Touring',
        price: 2384,
        rating: 4.5,
        reviews: 87,
        isBestSeller: false,
        image: 'http://localhost:5173/images/products/touring_bike_yellow.png'
      },
      {
        name: 'Sport-100 Helmet, Blue',
        category: 'Accesorios',
        subCategory: 'Helmets',
        price: 34,
        rating: 4.7,
        reviews: 412,
        isBestSeller: false,
        image: 'http://localhost:5173/images/products/sports_helmet_blue.png'
      },
      {
        name: 'Classic Vest, S',
        category: 'Ropa',
        subCategory: 'Vests',
        price: 126,
        rating: 4.6,
        reviews: 56,
        isBestSeller: false,
        image: 'http://localhost:5173/images/products/classic_vest.png'
      }
    ]);
  }
}

// Inicializar la base de datos y arrancar el servidor
sequelize.sync().then(async () => {
  console.log('Base de datos conectada y sincronizada.');
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('No se pudo conectar a la base de datos:', err);
});
