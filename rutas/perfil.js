
// Modelos que utilizan las rutas
var n_modelos = 2;
var modelos = Array(n_modelos);
modelos[0] = require('../modelos/alumno');
modelos[1] = require('../modelos/profesor');

var auth = require('../auth');
var _ = require('lodash');

module.exports = function (app) 
{
	app.get('/api/perfil/info', function(req,res) {
		// Solo se devolverá la info si el usuario se encuentra logeado
		if (req.decoded) 
		{
			if(req.decoded.tipo >= 0 && req.decoded.tipo < n_modelos)
			{
				modelos[req.decoded.tipo].findOne({userName: req.decoded.user.userName}, { _id: 0, password: 0, session: 0})
				                         .populate("asignaturas", ["nombre"])
				                         .exec(function(error, data) {
					if (error || !data)
					{
						res.status(403).json({
							success: false,
							message: 'Error obteniendo la informacion'
						});
					} 
					else 
					{
						res.json(data);
					}
				});
			}
		}
		else
		{
			/*res.status(500).json({
				success: false,
				message: 'Se ha prohibido el acceso'
			});*/
			modelos[1].findOne({userName: "profesor1"}, { _id: 0, __v: 0, password: 0, session: 0})
				                         .populate("asignaturas", ["nombre"])
				                         .select("-_id")
				                         .exec(function(error, data) {
					if (error || !data)
					{
						res.status(403).json({
							success: false,
							message: 'Error obteniendo la informacion'
						});
					} 
					else 
					{
						res.json(data);
					}
				});
		}
	});

	// Se le envia un objeto con las propiedades que se desean recuperar
	app.post('/api/perfil/get', auth, function(req,res) {
		// Solo se devolverá la info si el usuario se encuentra logeado
		if (req.decoded) 
		{
			// Es un alumno
			if(req.decoded.tipo >= 0 && req.decoded.tipo < n_modelos)
			{
				modelos[req.decoded.tipo].findOne({userName: req.decoded.user.userName}, function(error, data) {
					if (error || !data)
					{
						res.status(403).json({
							success: false,
							message: 'Error obteniendo la informacion'
						});
					} 
					else 
					{
						var obj = req.body;
						for(var property in obj)
						{
							if (data[property])
							{
								obj[property] = data[property];
							}
						}
						res.json(obj);
					}
				});
			}
		}
		else
		{
			res.status(500).json({
				success: false,
				message: 'Se ha prohibido el acceso'
			});
		}
	});

	app.post('/api/perfil/set', auth, function (req, res) {
		if (req.decoded && !_.isEmpty(req.body))
		{
			if(req.decoded.tipo >= 0 && req.decoded.tipo < n_modelos)
			{
				console.log(req.body);
				modelos[req.decoded.tipo].update({userName: req.decoded.user.userName}, req.body, function(err, n_updates) {
					if (err || n_updates == 0)
					{
						res.status(500).json({
							success: false,
							message: 'Error modificando la informacion'
						});
					}
					else
					{
						res.status(200).json({
							success: true
						})
					}
				});
			}
		} else
		{
			res.status(500).json({
				success: false,
				message: 'Se ha prohibido el acceso'
			});
		}
	});
};