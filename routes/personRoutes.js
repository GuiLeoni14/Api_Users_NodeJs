const router = require('express').Router();
const Person = require('../models/Person');
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
    const person = {
        name,
        job,
        github,
        phone,
        approved,
    };
    try {
        await Person.create(person);
        res.status(201).json({ message: 'Usuario inserido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/', async (req, res) => {
    try {
        const persons = await Person.find();
        res.status(200).json(persons);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const person = await Person.findOne({ _id: id });
        if (!person) {
            res.status(4222).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(person);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, job, github, phone, approved } = req.body;
    const person = {
        name,
        job,
        github,
        phone,
        approved,
    };
    try {
        const updatePerson = await Person.updateOne({ _id: id }, person);
        if (updatePerson.matchedCount === 0) {
            res.status(422).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(person);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const person = await Person.findOne({ _id: id });
        if (!person) {
            res.status(422).json({ message: 'Usuário não encontrado' });
            return;
        }
        await Person.deleteOne({ _id: id });
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
module.exports = router;
