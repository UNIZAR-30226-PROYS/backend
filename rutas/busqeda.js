
var n_modelos = 2;
var modelos = Array(n_modelos);
modelos[0] = require('../modelos/profesor');
modelos[1] = require('../modelos/asignatura');

var _ = require('lodash');

module.exports = function (app)
{
	app.get('/api/busqueda', function (req, res) {

		//Parametros de la busqueda: asignatura, nivel, ciudad, precioHora
		if (_.isEmpty(req.query))
		{
			res.status(400).json({
				succes: false,
				message: 'Los campos de busqueda estan vacios'
			});
		}
		else
		{

			var query = {}; 			//Construimos la query en funcion de los parametros rellenados
			var errorQuery = false;

						query["$and"]=[];
				if(req.query.ciudad){ query["$and"].push({ciudad: req.query.ciudad});}
				if(req.query.precioHora){ query["$and"].push({precioHora: req.query.precioHora});}
				if(req.query.asignatura)
				{
					if(req.query.nivel)	//Busca el _id de la asignatura/nivel y lo añade a la query
					{
						modelos[1].findOne({nombre: req.query.asignatura, nivel: req.query.nivel}, function (err, data) {
							console.log(data);
							if (err || !data) {errorQuery = true;}
							else {query["$and"].push({asignaturas: data._id});}
						});
					}
					else		//Busca todos lo id de la asignatura a todos los niveles
				{
					modelos[1].find({nombre: req.query.asignatura}, {_id: 1}).toArray(function (err, data) {
						console.log(data);
						if (err || !data) {errorQuery = true;}
						else {query["$and"].push({asignaturas: {$in: data}});}		//Seguramente no funcione
					});
				}

			}
			console.log("errorenquery:");
			console.log(errorQuery);
			console.log("query:");
			console.log(query);

			//2o parametro 'proyecciones' para solo devolver los campos que debe ver el usuario
			modelos[0].find(query,
				{nombre: 1, apellidos: 1, telefono: 1, email: 1, precioHora: 1, ciudad: 1, horarios: 1 },
				function(error,data)
				{
					console.log(data);
					if (error || !data)
					{
						console.log("Error en la busqueda");
						console.log(error);
						res.status(403).json({
							success: false,
							message: 'Error en la busqueda'
						});
					}
					else
					{
						res.json(data);
					}
				});
		}

	});
};