const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!name) {
        return res.status(422).json({ error: 'O nome é obrigatório' });
    }
    if (!email) {
        return res.status(422).json({ error: 'O email é obrigatório' });
    }
    if (!password) {
        return res.status(422).json({ error: 'O password é obrigatório' });
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ error: 'As senhas não conferem' });
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
        return res.status(422).json({ error: 'O email já esta sendo usado!' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try {
        await user.save();
        res.status(200).json({ message: 'Usuário criado sucesso' });
    } catch (error) {
        return res.status(500).json({ error: 'Error inesperado no servidor' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(422).json({ error: 'O email é obrigatório' });
    }
    if (!password) {
        return res.status(422).json({ error: 'A senha é obrigatória' });
    }

    let user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado!' });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return res.status(422).json({ error: 'Senha inválida!' });
    }
    try {
        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        );
        user = await User.findById(user._id, '-password'); // created by me
        res.status(200).json({ message: 'Autenticação realizada com sucesso', token, user });
    } catch (error) {
        return res.status(500).json({ error: 'Error inesperado no servidor' });
    }
});

module.exports = router;
