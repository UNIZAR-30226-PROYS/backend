
var modeloProf = require('../modelos/profesor');

module.exports = function (app) 
{
	app.get('/api/busqueda', function (req, res) {

		//Parametros de la busqueda: asignatura, nivel, ciudad, precioHora
		if (_.isEmpty(req.body))
		{
			res.status(400).json({
				succes: false,
				message: 'Los campos de busqueda estan vacios'
			});
		}
		else
		{
			var query = {}; 			//Construimos la query en funcion de los parametros rellenados

			query["$and"]=[];
			if((req.body.ciudad).length > 0){ query["$and"].push({ciudad: req.body.ciudad});}
			if(((req.body.asignatura).length > 0) && ((req.body.nivel).length > 0))
			{
				//Busca el _id de la asignatura/nivel y lo añade a la query
				//Buscar tambien asignaturas de todos los niveles???
				Asignatura.findOne({nombre: req.params.asignatura, nivel: req.params.nivel},function(err,data)
				{
					query["$and"].push({asignaturas: data._id});
				});
			}
			if((req.body.precioHora).length > 0){ query["$and"].push({precioHora: req.body.precioHora});}

			//2o parametro 'proyecciones' para solo devolver los campos que debe ver el usuario
			modeloProf.find(query,
				{nombre: 1, apellidos: 1, telefono: 1, email: 1, precioHora: 1, ciudad: 1, horarios: 1 },
				function(error,data)
				{
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