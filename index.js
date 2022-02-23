require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

const personRoutes = require('./routes/personRoutes');
app.use('/person', personRoutes);

app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!name) {
        return res.status(422).json({ message: 'O nome é obrigatório' });
    }
});

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);
mongoose
    .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.cainp.mongodb.net/personsapi?retryWrites=true&w=majority`,
    )
    .then(() => {
        console.log('Conectado com sucesso');
        app.listen(3000);
    })
    .catch((err) => console.log(err));
