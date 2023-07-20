
const ctx1 = document.getElementById('myChart1');

new Chart(ctx1, {
    type: 'bar',
    data: {
    labels: ['Roberto Carlos, Mamani Rojas', 'Martin Carlos,Toledo Muñoz', 'Julian Rodo, Medoza Galba', 'Jennie Maria, Medina Rodriguez'],
    datasets: [{
        label: 'Puntaje por conductor',
        data: [20, 18, 10, 7],
        borderWidth: 1
    }]
    },
    options: {
    scales: {
        y: {
        beginAtZero: true
        }
    }
    }
});



const ctx2 = document.getElementById('myChart2');

new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
          label: 'Nuevos usuarios por mes',
          data: [5, 6, 10, 25, 1, 3, 13, 27, 2, 3, 4, 2],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
    }
});



const ctx3 = document.getElementById('myChart3');

new Chart(ctx3, {
    type: 'polarArea',
    data: {
        labels: [
          '1',
          '2',
          '3',
          '4',
          '5'
        ],
        datasets: [{
          label: 'Nivel de satisfacción en el viaje',
          data: [1, 5, 7, 20, 3],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(54, 162, 235)'
          ]
        }]
    }
});




const ctx4 = document.getElementById('myChart4');

new Chart(ctx4, {
    type: 'pie',
    data: {
        labels: [
          'Viajes Tomados',
          'Viajes No Tomados'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [6, 18],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
          ],
          hoverOffset: 4
        }]
    }
});




