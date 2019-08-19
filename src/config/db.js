const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myPort', {useNewUrlParser: true});

module.export = mongoose;