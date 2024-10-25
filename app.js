const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category'); // Импортируем модель Category
const Product = require('./models/Product'); // Импортируем модель Product

// Загружаем переменные окружения из .env
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Подключение к базе данных успешно');
    })
    .catch(err => {
        console.error('Ошибка подключения к базе данных:', err);
    });

// Маршрут для добавления категории
app.post('/categories', async (req, res) => {
    try {
        const category = new Category({ name: req.body.name });
        await category.save();
        res.status(201).send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Маршрут для добавления продукта
app.post('/products', async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        });
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Маршрут для получения всех продуктов
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
