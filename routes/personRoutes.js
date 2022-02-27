const router = require('express').Router();
const Person = require('../models/Person');
const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Parado ai chefia, acesso negado!' });
    }
    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Token inválido' });
    }
}
router.post('/', checkToken, async (req, res) => {
    const { name, avatar, job, github, linkedin, description } = req.body;
    if (!name) {
        res.status(422).json({ error: 'O nome é obrigatório' });
        return;
    } else if (!job) {
        res.status(422).json({ error: 'O job é obrigatório' });
        return;
    } else if (!github) {
        res.status(422).json({ error: 'O github é obrigatório' });
        return;
    } else if (!description) {
        res.status(422).json({ error: 'A descrição é obrigatório' });
        return;
    } else if (!avatar) {
        res.status(422).json({ error: 'O avatar é obrigatório' });
        return;
    } else if (!avatar.includes('http')) {
        res.status(422).json({ error: 'url do avatar é inválida' });
        return;
    } else if (!linkedin) {
        res.status(422).json({ error: 'O linkedin é obrigatório' });
        return;
    } else if (!github.includes('https://github.com/')) {
        res.status(422).json({ error: 'url do github é inválida' });
        return;
    } else if (!linkedin.includes('https://www.linkedin.com/')) {
        res.status(422).json({ error: 'url do linkedin é inválida' });
        return;
    }
    const person = {
        name,
        job,
        github,
        linkedin,
        description,
        avatar,
    };
    try {
        await Person.create(person);
        res.status(201).json({ message: 'Usuário inserido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/', checkToken, async (req, res) => {
    try {
        const persons = await Person.find();
        res.status(200).json(persons);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/:id', checkToken, async (req, res) => {
    const id = req.params.id;
    try {
        const person = await Person.findOne({ _id: id });
        if (!person) {
            res.status(422).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(person);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.patch('/:id', checkToken, async (req, res) => {
    const id = req.params.id;
    const { name, avatar, job, github, linkedin, description } = req.body;
    const person = {
        name,
        job,
        github,
        linkedin,
        description,
        avatar,
    };
    try {
        const updatePerson = await Person.updateOne({ _id: id }, person);
        if (updatePerson.matchedCount === 0) {
            res.status(422).json({ error: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json({ message: 'Usuário inserido com sucesso', person });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.delete('/:id', checkToken, async (req, res) => {
    const id = req.params.id;
    try {
        const person = await Person.findOne({ _id: id });
        if (!person) {
            res.status(422).json({ error: 'Usuário não encontrado' });
            return;
        }
        await Person.deleteOne({ _id: id });
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
module.exports = router;
