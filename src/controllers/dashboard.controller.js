//Autores: Vasquez Miguel, Alexandra Ivana & Barandiaran Japaja, Jhossepy Alexander & Marquez Mendez, Andrea Janet.

//crea un objeto donde iran los metodos
const dashboardCtrl = {};

//importa los modelos a usar
const Car = require('../models/Car');
const CarScheduleDrivers = require('../models/CarScheduleDrivers');
const CarScheduleUser = require('../models/CarScheduleUser');
const ClassSchedule = require('../models/ClassSchedule');
const Driver = require('../models/Driver');
const DriverPerCar = require('../models/DriverPerCar');
const Service = require('../models/Service');
const Stop = require('../models/Stop');
const TripControl = require('../models/TripControl');
const User = require('../models/User');
const Institution = require('../models/Institution');
const InstitutionStudent = require('../models/InstitutionStudent');
const InstitutionCar = require('../models/InstitutionCar');
const DriverInService = require('../models/DriverInService');
const DayCodeRunsByInstitution = require('../models/DayCodeRunsByInstitution');
const CycleScheduleByInstitution = require('../models/CycleScheduleByInstitution');


//por cada direccion renderiza una vista diferente
dashboardCtrl.renderDashboard = async (req, res) => {

    const institution_id = req.user._id;

    try{
        const institutionStudents = await InstitutionStudent.countDocuments();
            
        const users = await User.countDocuments();

        const institutionCars = await InstitutionCar.countDocuments();

        const driversInService = await DriverInService.countDocuments();

        
        
        res.render('dashboard/dashboard', {institutionStudents, users, institutionCars, driversInService});

    }catch(e){
        console.log(e);
    }

};

dashboardCtrl.renderDates = async (req, res) => {

    try {

        const institution_id = req.user._id;
        const daysCodeRunsByInstitution = await DayCodeRunsByInstitution.find();
        const cycleSchedulesByInstitution = await CycleScheduleByInstitution.find();
        res.render('dashboard/dates', {daysCodeRunsByInstitution, cycleSchedulesByInstitution});

    }catch(e){
        console.log(e);
    }
    
};

dashboardCtrl.renderStatistics = async (req, res) => {
    try {

        
        res.render('dashboard/statistics');

    }catch(e){
        console.log(e);
    }
    
};

dashboardCtrl.renderCars = async (req, res) => {

    try {

        const carsArray = [];

        const institution_id = req.user._id;
        const institutionCars = await InstitutionCar.find();

        for (const institutionCar of institutionCars) {

            const driverPerCarArray = await DriverPerCar.find({institution_car_id: institutionCar._id}).populate({ path: 'driver_in_service_id', model: DriverInService}).populate({ path: 'institution_car_id', model: InstitutionCar});
            const driverPerCar = driverPerCarArray[0];

            carsArray.push(driverPerCar);
            
        }

        res.render('dashboard/cars', {carsArray});

    }catch(e){
        console.log(e);
    }

};


dashboardCtrl.renderUpload = async (req, res) => {


    res.render('dashboard/upload');
};


dashboardCtrl.renderDrivers = async (req, res) => {
    
    try {

        const carsArray = [];

        const institution_id = req.user._id;
        const institutionCars = await InstitutionCar.find();

        for (const institutionCar of institutionCars) {

            const driverPerCarArray = await DriverPerCar.find({institution_car_id: institutionCar._id}).populate({ path: 'driver_in_service_id', model: DriverInService}).populate({ path: 'institution_car_id', model: InstitutionCar});
            const driverPerCar = driverPerCarArray[0];

            carsArray.push(driverPerCar);
            
        }

        res.render('dashboard/drivers', {carsArray});

    }catch(e){
        console.log(e);
    }

};


dashboardCtrl.renderUsers = async (req, res) => {
    
    try {

        const institution_id = req.user._id;
        const institutionStudents = await InstitutionStudent.find();

        const users = await User.find();

        res.render('dashboard/users', {institutionStudents, users});

    }catch(e){
        console.log(e);
    }

};

dashboardCtrl.renderFirstSteps = async (req, res) => {
    try{
        const institution = await Institution.find({name: "Exodus"});
        const institution_id = institution[0]._id;
        const users = await User.find({institution_id: institution_id});
        for (const user of users) {
            const classSchedules = await ClassSchedule.find({user_id: user._id});
            for (const classSchedule of classSchedules) {
                const newCarScheduleUser = new CarScheduleUser({
                    day: classSchedule.day,
                    pick_hour: new Date(),
                    driver_per_cars_id: "64b8a653c8093204607ce311",
                    user_id: user._id
                });
                
                
                await newCarScheduleUser.save();
                console.log(newCarScheduleUser);
            }
            
        }
        req.flash('success_msg', 'Rutas genradas exitosamente');
        res.redirect('/dashboard/dates'); 
    }catch(e){
        console.log(e);
    }
    
};



module.exports = dashboardCtrl;