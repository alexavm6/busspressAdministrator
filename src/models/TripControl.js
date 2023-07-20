//Autores: Vasquez Miguel, Alexandra Ivana & Barandiaran Japaja, Jhossepy Alexander & Marquez Mendez, Andrea Janet.

//importa el schema y modelo de moongose
const {Schema, model, SchemaTypes} = require('mongoose');

//Crea un schema para mongodb
const TripControlSchema = new Schema({
    user_id:  {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "User"
    },
    total_trips:  {
        type: Number,
        required: true
    },
    taken_trips:  {
        type: Number,
        required: true
    },
    untaken_trips:  {
        type: Number,
        required: true
    }
},
{
    timestamps: true
});




//crea un modelo con el nombre elegido y la coleccion donde se guardará
module.exports = model('TripControl', TripControlSchema, 'tripControls');

