const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const usuarioSchema = new mongoose.Schema({
    nombreusuario: {
        type: String, 
        required : true,
        unique : true
    },
    correo : {
        type: String, 
        required : true,
        unique : true
    },
    contrasenia : {
        type: String, 
        required : true
    }
});

// hashear contraseña
//el pre ejecuta una consulta antes de hacer algo 
usuarioSchema.pre('save', async function (next){
    if (this.isModified('contrasenia')){
        this.contrasenia =  await bcrypt.hash(this.contrasenia, 10);
        console.log(this.contrasenia);
    }
    next();
});
//comparar contrseña
usuarioSchema.methods.compararContrasenia = async function  ( contraseniaComparar ){
    return await bcrypt.compare(contraseniaComparar, this.contrasenia);
};

const UsuarioModel = mongoose.model('Usuario',usuarioSchema, 'usuario');
module.exports = UsuarioModel;