
require('../modelos/alumno');
require('../modelos/profesor');
require('../modelos/valoraciones');


module.exports = function (app) 
{
	app.get('/api/valoraciones/:id', function (req, res) {
		Profesor.findOne({userName: req.params.id},function(err,data){
			Valoraciones.find({profesor: data._id}).populate('alumno','userName').exec(function(err,data){
				console.log(data.puntuacion);
				res.json(data);
			});
		});
	});
};