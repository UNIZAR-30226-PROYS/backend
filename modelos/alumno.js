'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var alumnoSchema = new Schema({ 
	nombre: {type: String, required: true},
	apellidos: {type: String, required: true},
	telefono: {type: String,required:true},
	userName: {type: String, required: true, index: true, unique: true},
	password: {type: String, required: true},
	email: {type: String,required: true}
});
 
module.exports=mongoose.model('Alumno',alumnoSchema);