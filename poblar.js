

var mongoose = require('mongoose');

// Crea conexion con la base de datos
mongoose.connect('mongodb://' + config.dbUser + ':' + config.dbPass + '@' + config.dbURI);

// Si la conexion falla
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var ruta = __dirname + '/poblarFiles/*.js';
foldersRutas = this.getGlobbedPaths(ruta);

_.forEach(foldersRutas, function(valor) {
	require(valor)(app);
});