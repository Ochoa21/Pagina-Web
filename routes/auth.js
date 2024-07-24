const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');

// Clave del dueño del sistema
const OWNER_KEY = 'clave-del-dueno';

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, password, ownerKey } = req.body;

    if (ownerKey !== OWNER_KEY) {
        return res.status(403).json({ msg: 'Clave de dueño incorrecta' });
    }

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        user = new User({
            username,
            password: await bcrypt.hash(password, 10),
            role: 'user'
        });

        await user.save();
        res.json({ msg: 'Usuario registrado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ userId: user._id }, 'tu-secreto-del-jwt', { expiresIn: '1h' });

        res.json({ token, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Habilitar 2FA
router.post('/enable-2fa', async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        const secret = speakeasy.generateSecret();

        user.secret = secret.base32;
        await user.save();

        res.json({ msg: '2FA habilitado', data_url: secret.otpauth_url });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Verificar OTP
router.post('/verify-otp', async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const user = await User.findById(userId);
        const verified = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            token: otp
        });

        if (verified) {
            res.json({ msg: 'OTP verificado' });
        } else {
            res.status(400).json({ msg: 'OTP inválido' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
