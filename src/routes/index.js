const router = require('express').Router(); // requiero express para crear rutas

router.get('/', (req, res) => {
    res.render('partials/index.hbs');
})

module.exports = router;