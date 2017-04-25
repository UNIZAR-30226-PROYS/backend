
require('../modelos/alumno');
require('../modelos/profesor');
require('../modelos/valoracion');


module.exports = function (app) 
{
	app.get('/api/valoraciones/:id', function (req, res) {
		Profesor.findOne({userName: req.params.id}).exec(function(err,data){
			console.log(data.valoracionMedia);
			res.json(data);
		});
	});

	app.post('api/valoraciones/valorar', function(req, res){

		if (req.decoded && !_.isEmpty(req))
		{
			
			Valoracion.insertOne({profesor:req.decoded.profesorID,alumno:req.decoded.alumnoID, puntuacion:req.decoded.puntuacion});
			Profesor.findOne({_id:req.decoded.profesorID}, function(err,data_user){
								var mu = data_user.valoracionMedia;
								var num_val = data_user.numeroValoraciones;
								mu = mu * num_val + req.decoded.puntuacion;
								data_user.numeroValoraciones = num_val + 1;
								data_user.valoracionMedia = mu/num_val;
								data_user.save();
								});
		} else
		{
			res.status(500).json({
				success: false,
				message: 'Se ha prohibido el acceso'
			});
		}

	});
};
