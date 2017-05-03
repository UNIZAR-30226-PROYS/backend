'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var profesorSchema = new Schema({ 
	nombre: {type: String, required: true},
	apellidos: {type: String, required: true},
	telefono: {type: String,required:true},
	userName: {type: String, required: true, index: true, unique: true},
	password: {type: String, required: true},
	email: {type: String,required: true},

	diasPromocionRestantes: {type: Number,default: 0},
	precioHora: {type: Number, default: 0},
	ciudad: {type: String,required:true},
	horarios: [{type: String,default: ""}],
	asignaturas: [{type: Schema.Types.ObjectId, ref: 'Asignatura'}],
	
	cursos: [{type:String,default:""}],
	experiencia: {type:String,default:""},
	modalidad: {type:String,default:""},
	
	valoracionMedia: {type:Number},
	numeroValoraciones: {type:Number,default:0}
});
 
module.exports=mongoose.model('Profesor',profesorSchema);
