
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
};
