require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

const personRoutes = require('./routes/personRoutes');
const authRouter = require('./routes/authRoutes');
app.use('/person', personRoutes);
app.use('/auth', authRouter);
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
