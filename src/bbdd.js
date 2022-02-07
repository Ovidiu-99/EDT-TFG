const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ovidiu:holahola2@cluster0.u8pam.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(db => console.log('Se ha conectado a la base de datos'))
    .catch(err => console.error(err));