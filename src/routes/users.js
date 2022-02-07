const router = require('express').Router(); // requiero express para crear rutas

const User = require('../models/User');

const passport = require('passport');

const { isAuthenticated } = require('../helpers/auth');

router.get('/users/signin', (req, res) => {
    res.render('users/signin.hbs');
});

router.get('/users/profile', (req, res) => {
    res.render('users/profile.hbs');
});


router.get('/users/diagrama', (req, res) => {
    res.render('users/diagrama.hbs');
});

router.put('/users/diagrama/:id', isAuthenticated, async(req, res) => {
    const { diagrama } = req.body;
    await User.findByIdAndUpdate(req.params.id, { diagrama });
    res.redirect('/users/diagrama');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash: true
}));



router.get('/users/signup', (req, res) => {
    res.render('users/signup.hbs');
});


router.post('/users/signup', async(req, res) => { //no se afecta con la de arriba puesto que esta es post y la otra get
    const { name, surname, email, direccion, password, confirm_password, date } = req.body;
    const diagrama = '{ "class": "go.TreeModel","nodeDataArray": [{"key":1, "name": "Proyecto"},{"key":2, "name":"(nombre)","parent":1}] }';
    const errors = [];
    if (name.length <= 0) {
        errors.push({ text: 'Inserta un nombre' })
    }
    if (surname.length <= 0) {
        errors.push({ text: 'Inserta tus apellidos' })
    }
    if (!date) {
        errors.push({ text: 'Inserta tu fecha de nacimiento' })
    }
    if (!direccion) {
        errors.push({ text: 'Inserta una direccion' })
    }
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe ser de al menos 4 caracteres' })
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, surname, email, password, confirm_password, date });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            errors.push({ text: 'Ya existe un usuario con ese email, introduce otro' })
            res.render('users/signup', { errors, name, password, confirm_password });
        } else {
            const newUser = new User({ name, surname, email, direccion, password, date, diagrama });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            res.redirect('/users/signin');
        }

    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;