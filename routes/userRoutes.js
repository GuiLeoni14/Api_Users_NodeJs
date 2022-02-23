const router = require('express').Router();
const User = require('../models/User');
router.post('/', async (req, res) => {
    const { name, job, github, phone, approved } = req.body;
    if (!name) {
        res.status(422).json({ error: 'O nome é obrigatório' });
        return;
    } else if (!job) {
        res.status(422).json({ error: 'O job é obrigatório' });
        return;
    } else if (!github) {
        res.status(422).json({ error: 'O github é obrigatório' });
        return;
    } else if (!phone) {
        res.status(422).json({ error: 'O phone é obrigatório' });
        return;
    }
    const user = {
        name,
        job,
        github,
        phone,
        approved,
    };
    try {
        await User.create(user);
        res.status(201).json({ message: 'Usuario inserido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            res.status(4222).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, job, github, phone, approved } = req.body;
    const user = {
        name,
        job,
        github,
        phone,
        approved,
    };
    try {
        const updateUser = await User.updateOne({ _id: id }, user);
        if (updateUser.matchedCount === 0) {
            res.status(422).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado' });
            return;
        }
        await User.deleteOne({ _id: id });
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
module.exports = router;
