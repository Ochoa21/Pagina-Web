const express = require('express');
const router = express.Router();
const BlockedUrl = require('../models/BlockedUrl');
const jwt = require('jsonwebtoken');

// Middleware de autenticación
const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'tu-secreto-del-jwt');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'No autorizado' });
    }
};

// Bloquear URL
router.post('/block', auth, async (req, res) => {
    const { url } = req.body;

    try {
        let blockedUrl = new BlockedUrl({ url });
        await blockedUrl.save();
        res.json({ msg: 'URL bloqueada con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Extraer URLs de un sitio web
router.post('/extract', auth, async (req, res) => {
    const { url } = req.body;

    try {
        const response = await fetch(url);
        const text = await response.text();
        const urls = text.match(/(https?:\/\/[^\s]+)/g) || [];
        res.json({ urls });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
