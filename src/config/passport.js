//Autores: Vasquez Miguel, Alexandra Ivana & Barandiaran Japaja, Jhossepy Alexander & Marquez Mendez, Andrea Janet.

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const Administrator = require('../models/Administrator');

//le dice a passport que utilize la estrategia local de autenticacion
passport.use(new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password'
}, async (user, password, done) => {

    //Match user
    const userFound = await Administrator.findOne({user});
    if (!userFound) {
        return done(null, false, { message: 'Administrador no encontrado' });
    } else {
        //Match password of the user found
        const match = await userFound.matchPassword(password);
        if (match) {
            return done(null, userFound);
        } else {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
    }

}));

//serializa el user y lo guarda en la variable global user
passport.serializeUser((user, done) => {
    //console.log(user);
    //console.log(user.id);
    done(null, user.id);
});

//deserializa el user
passport.deserializeUser((id, done) => {

    Administrator.findById(id, (err, user) => {
        //console.log(user);
        //console.log('error: ',err);
        done(err, user);
    }); 

});