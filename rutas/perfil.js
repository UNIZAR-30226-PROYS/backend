
// Modelos que utilizan las rutas
var n_modelos = 2;
var modelos = Array(n_modelos);
modelos[0] = require('../modelos/alumno');
modelos[1] = require('../modelos/profesor');

var Asignatura = require('../modelos/asignatura');

var auth = require('../auth');
var _ = require('lodash');
var async = require('async');

module.exports = function (app) 
{
	app.get('/api/perfil/info', auth, function(req,res) {
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
				modelos[req.decoded.tipo].findOne({userName: req.decoded.user.userName}, {_id: 0, __v: 0, password: 0, session: 0})
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
				modelos[req.decoded.tipo].findOne({userName: req.decoded.user.userName}, function(err, data){
					if (err || !data)
					{
						res.status(500).json({
							success: false,
							message: 'Error modificando la informacion'
						});
					} else {

						for (var property in req.body)
						{
							if (data[property] != undefined && property !== "asignaturas")
							{
								data[property] = req.body[property];
							}
						}

						if (req.body.asignaturas != undefined)
						{
							var asignaturas = req.body.asignaturas.split(",");
							var n = asignaturas.length;
							var i = 0;

							async.each(asignaturas, function(asig, next){
								Asignatura.findOne({nombre: asig}, function(err,data){
									if (!err)
									{
										data.asignaturas.push(data._id);
										i++;

										if (i == n)
										{	
											data.save(function(err, me) {
												if (err) {
													res.status(500).json({
														success: false,
														message: 'Error modificando la informacion'
													});
												} else {
													console.log(chalk.green("Modificado usuario " + me.userName));
													res.status(200).json({
														success: true,
														message: 'Modificado correctamente el usuario'
													});
												}
											});
										}
									}
									next();
								});
							});
						} else {
							data.save(function(err, me) {
								if (err) {
									res.status(500).json({
										success: false,
										message: 'Error modificando la informacion'
									});
								} else {
									console.log(chalk.green("Modificado usuario " + me.userName));
									res.status(200).json({
										success: true,
										message: 'Modificado correctamente el usuario'
									});
								}
							});
						}
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