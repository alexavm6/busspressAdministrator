//Autores: Vasquez Miguel, Alexandra Ivana & Barandiaran Japaja, Jhossepy Alexander & Marquez Mendez, Andrea Janet.
//importa los modelos a usar
const Price = require('../models/Price.js');
const Car = require('../models/Car.js');
const InstitutionCar = require('../models/InstitutionCar.js');
const Driver = require('../models/Driver.js');
const DriverInService = require('../models/DriverInService.js');
const DriverPerCar = require('../models/DriverPerCar.js');
const path = require('path');
const passport = require('passport');

//crea un objeto donde iran los metodos
const institutionCtrl = {};

//importa modulo passport
const nodemailer = require('nodemailer');
const multer = require('multer');
const mime = require('mime-types');
const Institution = require('../models/Institution.js');
const Companie = require('../models/Companie.js');
const InstitutionTicket = require('../models/InstitutionTicket.js');
const InstitutionTicketDetail = require('../models/InstitutionTicketDetail.js');


institutionCtrl.renderLogin = async (req, res) => {
    
    res.render('institution/login');
};

institutionCtrl.login = passport.authenticate('local', {
    failureRedirect: '/institution/login',
    successRedirect: '/dashboard',
    failureFlash: true
});

institutionCtrl.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'Sesión de institución cerrada exitosamente');
        res.redirect('/institution/login');
    });
    /*
    req.flash('success_msg', 'Sesión cerrada exitosamente');
    res.redirect('/user/login');
    */
};



//por cada direccion renderiza una vista diferente
institutionCtrl.renderSignup = async (req, res) => {
    const unreservedCars = await Car.countDocuments({state: "Unreserved"});
    res.render('institution/signupForm1', {unreservedCars});
};

let semanasGlobal, ciclosGlobal, carrosGlobal;

let institutionRegistrationPriceGlobal, totalPorCantidadDeCarrosGlobal, totalSemanasDelServicioGlobal, totalGlobal;




//si el ingreso de sesion es exitoso o falla te redirige a una vista diferente
institutionCtrl.signupForm1 = async (req, res) => {
    try{
        console.log("POST: /institution/signupForm1", req.body);

        const {semanas, ciclos, carros} = req.body;

        

        semanasGlobal = semanas;
        ciclosGlobal = ciclos;
        carrosGlobal = carros;

        const institutionRegistration = await Price.findOne({name:"Institution Registration"});
        const institutionRegistrationPrice = institutionRegistration.price;

        institutionRegistrationPriceGlobal = institutionRegistrationPrice;

        const institutionUnitCar = await Price.findOne({name:"Institution Unit Car"});
        const institutionUnitCarPrice = institutionUnitCar.price;
        const totalPorCantidadDeCarros = carros * institutionUnitCarPrice;

        totalPorCantidadDeCarrosGlobal = totalPorCantidadDeCarros;

        const institutionUnitWeek = await Price.findOne({name:"Institution Unit Week"});
        const institutionUnitWeekPrice = institutionUnitWeek.price;
        const totalSemanasDelServicio = semanas * ciclos * institutionUnitWeekPrice;

        totalSemanasDelServicioGlobal = totalSemanasDelServicio;

        const total = totalPorCantidadDeCarros + totalSemanasDelServicio + institutionRegistrationPrice;

        totalGlobal = total;

        console.log(total, institutionRegistrationPrice, totalSemanasDelServicio, totalPorCantidadDeCarros);

        res.render('institution/signupForm2', {total, institutionRegistrationPrice, totalSemanasDelServicio, totalPorCantidadDeCarros});

    }catch(e){
        console.log(e.message);
    }
};



//si el ingreso de sesion es exitoso o falla te redirige a una vista diferente
institutionCtrl.signupForm2 = async (req, res) => {

    const {name, acronym, ruc, email, user, password, card} = req.body;

    console.log(req.body,semanasGlobal, ciclosGlobal, carrosGlobal,institutionRegistrationPriceGlobal, totalPorCantidadDeCarrosGlobal, totalSemanasDelServicioGlobal, totalGlobal);
    

    const newInstitution = new Institution({
        user: user,
        password: password,
        name: name,
        acronym: acronym,
        ruc: ruc,
        weeksPerCycle: parseInt(semanasGlobal),
        email: email,
        cycles: parseInt(ciclosGlobal),
        cars: parseInt(carrosGlobal)
    });

    newInstitution.password = await newInstitution.encryptPassword(password);
                        console.log(newInstitution)
    
    await newInstitution.save();
                        console.log(newInstitution)

    const institution_id = newInstitution._id;
                        console.log(institution_id) 

    const companieInfo = await Companie.findById('648ba532a5f1532634da4949');
                        console.log(companieInfo)

    const companie_id = companieInfo._id;
                        console.log(companie_id)
    
    const newInstitutionTicket = new InstitutionTicket({
        date: Date.now(),
        description: "Monto total",
        amount: parseInt(totalGlobal),
        companie_id: companie_id,
        institution_id: institution_id
    });

    await newInstitutionTicket.save();
                        console.log(newInstitutionTicket)

    const newInstitutionTicket_id = newInstitutionTicket._id;
                        console.log(newInstitutionTicket_id)

    const amounts = [parseInt(institutionRegistrationPriceGlobal), parseInt(totalPorCantidadDeCarrosGlobal), parseInt(totalSemanasDelServicioGlobal)];
    const descriptions = ["Monto de matricula para instituciones", "Monto por cantidad de carros", "Monto por semanas del servicio"];
                        console.log(amounts, descriptions)

    for (let index = 0; index < amounts.length; index++) {

        const newInstitutionTicketDetail = new InstitutionTicketDetail({
            amount: amounts[index],
            institution_ticket_id: newInstitutionTicket_id,
            description: descriptions[index]
        });

        await newInstitutionTicketDetail.save();
        console.log(newInstitutionTicketDetail)
    }


    const contentHTML = `
        <h1>Tu institución ha sido registrada correctamente</h1>
        <p>Este es tu recibo electrónico<p>
        <p>Tu contraseña es la que ingresaste al inscribirte</p>
        <p></p>
        <ul>
            <li>Monto total: S/.${totalGlobal} cargado a la tarjeta ${card}</li>
            <li>${descriptions[0]}: S/.${amounts[0]}</li>
            <li>${descriptions[1]}: S/.${amounts[1]}</li>
            <li>${descriptions[2]}: S/.${amounts[2]}</li>
        </ul>
    `;

    
        
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
            user: "busspressenterprise@gmail.com",
            pass: "ynyrcscacpgkzxwo",
        },
    });
            console.log("Envia correo 1")
            console.log(transporter)

    const info = await transporter.sendMail({
        from: "'Busspress' <busspressenterprise@gmail.com>",
        to: email,
        subject: "Comienza a usar Busspress",
        html: contentHTML
    });
            console.log("Envia correo 2")
            console.log(info)


    const arrayCars = await Car.find({state: "Unreserved"}).limit(parseInt(carrosGlobal));
    console.log(arrayCars)

    const driverPerCarsInstitutionCars = [];
    const driverPerCarsDriversInService = [];

    for (let car of arrayCars) {

        const res = await Car.updateOne({ _id: car._id }, { state: 'Reserved' });

        const newInstitutionCar = new InstitutionCar({
            license_plate_number: car.license_plate_number,
            institution_id: institution_id
        });

        await newInstitutionCar.save();

        driverPerCarsInstitutionCars.push(newInstitutionCar._id);

    }

    const arrayDrivers = await Driver.find({state: "Out of service"}).limit(parseInt(carrosGlobal));
    console.log(arrayDrivers)

    for (let driver of arrayDrivers) {

        const res = await Driver.updateOne({ _id: driver._id }, { state: 'In service' });

        let newDocument_number = driver.document_number;
        

        const newDriverInService = new DriverInService({
            user: driver.user,
            document_type: driver.document_type,
            document_number: newDocument_number,
            names: driver.names,
            last_names: driver.last_names,
            email: driver.email,
            password: newDocument_number,
            address: driver.address,
            phone_number: driver.phone_number,
            gender: driver.gender,
            age: driver.age,
            score: 0,
            institution_id: institution_id
        });

        newDriverInService.password = await newDriverInService.encryptPassword(newDocument_number);

        await newDriverInService.save();

        driverPerCarsDriversInService.push(newDriverInService._id);

    }


    for (let index = 0; index < driverPerCarsInstitutionCars.length; index++) {
        
        const newDriverPerCar = new DriverPerCar({
            driver_in_service_id: driverPerCarsDriversInService[index],
            institution_car_id: driverPerCarsInstitutionCars[index]
        });

        await newDriverPerCar.save();
        
    }


    req.flash('success_msg', 'Registro exitoso, revise su email');
    res.redirect('/institution/signup');


};



 
module.exports = institutionCtrl;