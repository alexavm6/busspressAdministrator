//Autores: Vasquez Miguel, Alexandra Ivana & Barandiaran Japaja, Jhossepy Alexander & Marquez Mendez, Andrea Janet.

//importa el schema y modelo de moongose
const {Schema, model, SchemaTypes} = require('mongoose');
const bcrypt = require('bcryptjs'); 

//Crea un schema para mongodb
const UserSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    document_type:  {
        type: String,
        required: true
    },
    document_number:  {
        type: String,
        required: true
    },
    names:  {
        type: String,
        required: true
    },
    last_names:  {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:  {
        type: String,
        required: true
    },
    address:  {
        type: String,
        required: true
    },
    campus:  {
        type: String,
        required: true
    },
    phone_number:  {
        type: String,
        required: true
    },
    college_career:  {
        type: String,
        required: true
    },
    course:  {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    age: {
        type: Number
    },
    cycles: {
        type: Number
    },
    institution_id:  {
        type: SchemaTypes.ObjectId,
        ref: "Institution"
    }
},
{
    timestamps: true
});

//coloca meotodos de encriptacion de password al schema
UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}


//crea un modelo con el nombre elegido y la coleccion donde se guardará
module.exports = model('User', UserSchema, 'users');

