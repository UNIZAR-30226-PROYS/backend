
var n_modelos = 2;
var modelos = Array(n_modelos);
modelos[0] = require('../modelos/profesor');
modelos[1] = require('../modelos/asignatura');
const EmptyQuery = JSON.stringify({"$and":[]});
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
			construirQuery(req, res, lanzarQuery);
		}
	});

	function construirQuery(req, res, lanzarQuery)
	{
		var query = {}; 			//Construimos la query en funcion de los parametros rellenados
		query["$and"]=[];
		if(req.query.ciudad){ query["$and"].push({ciudad: req.query.ciudad});}
		if(req.query.precioHora){ query["$and"].push({precioHora: req.query.precioHora});}
		if(req.query.horario){ query["$and"].push({horario: req.query.horario});}
		if(req.query.nombre){ query["$and"].push({nombre: req.query.nombre});}
		if(req.query.asignatura)
		{
			if(req.query.nivel)	//Busca el _id de la asignatura/nivel y lo añade a la query
			{
				modelos[1].findOne({nombre: req.query.asignatura, nivel: req.query.nivel}, function (err, data) {
					console.log(data);
					if (err || !data)
					{
						if(!err) err = new Error("No existe ninguna asignatura con ese nombre/nivel");
						lanzarQuery(err,res, query);
					}
					else
					{
						query["$and"].push({asignaturas: data._id});
						lanzarQuery(null,res,query);
					}
				});
			}
			else		//Busca todos lo id de la asignatura a todos los niveles
			{
				modelos[1].find({nombre: req.query.asignatura}, {_id: 1}, function (err, data) {
					console.log(data);
					if (err || !data.length)
					{
						if (!err) err = new Error("No existe ninguna asignatura con ese nombre");
						lanzarQuery(err, res, query);
					}
					else
					{
						query["$and"].push({asignaturas: {$in: data}});  //Seguramente no funcione
						lanzarQuery(null,res, query);
					}
				});
			}
		}
		else
		{
			lanzarQuery(null,res, query);
		}
	}
};

//2o parametro 'proyecciones' para solo devolver los campos que debe ver el usuario
function lanzarQuery(err, res, query) {
	console.log(query);

	if (err || (JSON.stringify(query) === EmptyQuery))
	{
		if(!err) err = new Error("No hay ningun parametro de busqueda valido");
		//console.log(err);
		res.status(400).json({
			success: false,
			message: err.toString()
		});
	}
	else
	{
		modelos[0].find(query,
			{nombre: 1, apellidos: 1, telefono: 1, email: 1, precioHora: 1, ciudad: 1, horarios: 1, valoracionMedia: 1},
			{sort: {valoracionMedia: -1}},
			function (error, data) {
				console.log(data);
				if (error || !data)
				{
					console.log("Error en la busqueda");
					//console.log(error);
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
}