'use strict';

var jwt = require('jsonwebtoken');
var config = require('./config');
var bcrypt = require('bcrypt-nodejs');
var chalk = require('chalk');

var mongoose = require('mongoose');
var Usuario = require('./modelos/usuario');


//
// TOKEN DE SESIÓN
// 
// {
//   tipo : integer ,
//   user : Usuario (objeto información del usuario)
// }
//

module.exports.AuthMiddleware = function (req, res, next) {

	var token = req.headers['xtoken'];

	if (token) {
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				return res.status(403).json({
					success: false,
					message: 'Error autenticando el token'
				});
			} else if (decoded.user) {
				Usuario.findOne({userName: decoded.user.username}, function(err, data) {
					if (err) {
						return res.status(403).json({
							success: false,
							message: 'Error autenticando el token'
						});
					} else if (decoded.user && decoded.user.sesion && data.sesion == decoded.user.sesion) {
						req.decoded = decoded;
						next();
					} else {
						return res.status(403).json({
							success: false,
							message: 'Error autenticando el token'
						});
					}
				});
			} else {
				return res.status(403).json({
					success: false,
					message: 'El Token no pertenece a un usuario valido'
				});
			}
		});
	} else {
		console.log(chalk.red("No se envio el token"));
		return res.status(403).json({
			success: false,
			message: 'No se envió token'
		})
	}
}

module.exports.TokenMiddleware = function (req, res, next) {

	var token = req.headers['xtoken'];

	if (token) {
		jwt.verify(token, config.secret, function(err, deco) {
			if (!err) {
				if (deco.user) {
					Usuario.findOne({userName: deco.user.username}, function(err, data) {
						if (!err && data && data.sesion == deco.user.sesion) {
							req.decoded = deco;
							next();
						}
					});
				} else {
					// En el caso del usuario que no se ha registrado pero ha usado el carrito
					req.decoded = deco;
					console.log(chalk.black(JSON.stringify(req.decoded)));
					next();
				}	
			} else {
				next();
			}
		});
	} else {
		next();
	}
}