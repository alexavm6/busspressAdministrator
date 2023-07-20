//Autores: Vasquez Miguel, Alexandra Ivana & Barandiaran Japaja, Jhossepy Alexander & Marquez Mendez, Andrea Janet.

//importa un enrutador
const { Router } = require('express');
const router = Router();

//importa las funciones que hará el enrutador dependiendo de la ruta
const { 
    renderDashboard,
    renderDates,
    renderStatistics, 
    renderCars,
    renderUpload,
    renderDrivers,
    renderFirstSteps,
    renderUsers 
} = require('../controllers/dashboard.controller');

//importa la funcion que verificará si el usuario esta autentificado
const { isAuthenticated } = require('../helpers/auth');

//dependiendo de la ruta que ingrese renderizará una vista
router.get('/dashboard', isAuthenticated, renderDashboard);

router.get('/dashboard/dates', isAuthenticated, renderDates);

router.get('/dashboard/statistics', isAuthenticated, renderStatistics);

router.get('/dashboard/cars', isAuthenticated, renderCars);

router.get('/dashboard/upload', isAuthenticated, renderUpload);

router.get('/dashboard/drivers', isAuthenticated, renderDrivers);

router.get('/dashboard/firstSteps', isAuthenticated, renderFirstSteps);

router.get('/dashboard/users', isAuthenticated, renderUsers);


module.exports = router;