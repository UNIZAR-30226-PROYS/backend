
// Modelos que utilizan las rutas
var n_modelos = 2;
var modelos = Array(n_modelos);
modelos[0] = require('../modelos/alumno');
modelos[1] = require('../modelos/profesor');

var auth = require('../auth');
var _ = require('lodash');

module.exports = function (app) 
{
	app.get('/api/perfil/get', auth, function(req,res) {
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
					} else 
					{
						res.json(data);
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
			// Es un alumno
			if(req.decoded.tipo >= 0 && req.decoded.tipo < n_modelos)
			{
				modelos[req.decoded.tipo].update({userName: req.decoded.user.userName}, req.body, function(err, n_updates) {
					if (!err || n_updates == 0)
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