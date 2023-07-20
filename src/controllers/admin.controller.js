//Autores: Vasquez Miguel, Alexandra Ivana & Barandiaran Japaja, Jhossepy Alexander & Marquez Mendez, Andrea Janet.

//crea un objeto donde iran los metodos
const adminCtrl = {};

//importa los modelos a usar
const User = require('../models/User');

const Car = require('../models/Car');
const CarScheduleDrivers = require('../models/CarScheduleDrivers');
const CarScheduleUsers = require('../models/CarScheduleUser');
const ClassSchedule = require('../models/ClassSchedule');
const Driver = require('../models/Driver');
const DriverPerCar = require('../models/DriverPerCar');
const Service = require('../models/Service');
const Stop = require('../models/Stop');
const TripControl = require('../models/TripControl');

//por cada direccion renderiza una vista diferente
adminCtrl.renderNewuser = (req, res) => {
    res.render('admin/newuser');
};

adminCtrl.newuser = async (req, res) => {
    const errors = [];
    const { 
        user,
        document_type,
        document_number,
        names,
        last_names,
        email,
        address,
        campus,
        phone_number,
        college_career,
        course,
        start_service,
        end_service,
        password,
        confirm_password
    } = req.body;

    if (password != confirm_password) {
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    
    if (password.length < 8) {
        errors.push({text: 'Las contraseñas deben tener al menos 8 caracteres'});
    }

    if (errors.length > 0) {
        res.render('admin/newuser', {
            errors,
            user,
            document_type,
            document_number,
            names,
            last_names,
            email,
            address,
            campus,
            phone_number,
            college_career,
            course,
            start_service,
            end_service,
            password,
            confirm_password
        });

    }else{

        const { 
            user,
            email,
            document_number
        } = req.body;

        //console.log(user, email, document_number);

        const user1 = await User.findOne({user: user}); 
        //console.log('Usuario', user1);
        if (user1) {
            errors.push({text: 'Ya existe un usuario con este codigo'});
        }
        
        
        const email1 = await User.findOne({email: email});
        //console.log('Email', email1);
        if (email1) {
            errors.push({text: 'Ya existe un usuario con este email'});
        }

        
        const document_number1 = await User.findOne({document_number: document_number});
        //console.log('Numero de documento', document_number1);
        if (document_number1) {
            errors.push({text: 'Ya existe un usuario con este numero de documento'});
        }

        if (errors.length > 0) {
            res.render('admin/newuser', {
                errors,
                user,
                document_type,
                document_number,
                names,
                last_names,
                email,
                address,
                campus,
                phone_number,
                college_career,
                course,
                start_service,
                end_service,
                password,
                confirm_password
            });
        }else{
            const newUser = new User({
                user,
                document_type,
                document_number,
                names,
                last_names,
                email,
                address,
                campus,
                phone_number,
                college_career,
                course,
                start_service,
                end_service,
                password
            });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Usuario registrado exitosamente');
            res.redirect('/admin/newuser'); 
            
        }
        
    }


};



module.exports = adminCtrl;