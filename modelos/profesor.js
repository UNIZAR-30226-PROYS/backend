'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var profesorSchema = new Schema({ 
	nombre: {type: String, required: true},
	apellidos: {type: String, required: true},
	telefono: {type: String,required:true},
	userName: {type: String, required: true, index: true, unique: true},
	password: {type: String, required: true},
	email: {type: String, required: true, match: [/[^ ]+@[^ ]+\.(com|es)/, "No es un email válido"]},

	sesion: {type: String, required: true},

	diasPromocionRestantes: {type: Number,default: 0},
	precioHora: {type: Number,required:true},
	ciudad: {type: String,required:true},
	horarios: [{type: String,required: true}],
	asignaturas: [{type: Schema.Types.ObjectId, ref: 'Asignatura',required: true}]
});
 
module.exports=mongoose.model('Profesor',profesorSchema);