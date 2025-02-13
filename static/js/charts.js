var simulate = document.getElementById('simulate')
var P_tank = 120
var fcv
var P_reducer
var P_accumulator = 35;
var p_chamber = 20;
var P_valve = 0;
var index = 0 
const Cv = [0, 0.0236, 0.0443, 0.0635, 0.0814, 0.0980, 0.1133, 0.1273, 0.1402, 0.1520, 0.1628, 0.1812, 0.1960, 0.2075, 0.2162, 0.2224]
let interval; // Store interval reference
let timeout;  // Store timeout reference
let m_dot;
const density = 789
const V = 7.9 // volume of the tank
const T = 300 // temp in kelvin
const M = 0.028 // molar mass
const R = 8.314 // gas constant
const Nitrogen_density = 1.19 // kg/m^-3
var P_fcv;
var delta_t = 0.5

var chart = new Chart("myChart", {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label : "tank pressure",
            data: [],
            borderColor: "red",
            fill: false,
            tension: 0
        },{
            label : "Pressure after reducer",
            data: [],
            borderColor: "green",
            fill: false,
            tension: 0
        },{
            label : "pressure at flow control valve",
            data: [],
            borderColor: "blue",
            fill: false,
            tension: 0
        },{
            label : "flow rate",
            data: [],
            borderColor: "purple",
            fill: false,
            tension: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 0, 1)' },
                ticks: { color: 'white' },
                title: {  // X-Axis Title
                    display: true,
                    text: "Time (s)", 
                    color: "white",
                    font: { size: 14, weight: "bold" }
                }
            },
            y: {
                grid: { color: 'rgba(255, 255, 0, 1)', borderColor: 'rgba(255, 0, 0, 1)' },
                ticks: { color: 'white' },
                title: {  // Y-Axis Title
                    display: true,
                    text: "Flow Rate (L/min)",
                    color: "white",
                    font: { size: 14, weight: "bold" }
                }
            },
        },
        plugins: {
            legend: { 
                display: true,
                labels: { color: 'white' }
            }
        }
    }
});


function startSimulation() {
    console.log("simulation started...");
    interval = setInterval(() => {
        console.log("Running...");
        chart.data.labels.push(new Date().toLocaleTimeString());
        P_reducer = $("#pressure").roundSlider("option", "value");
        fcv = $("#fcv").roundSlider("option", "value");
        console.log(fcv)
        P_fcv = P_accumulator * (fcv/100) - p_chamber
        console.log(P_fcv)
        index = Math.floor(fcv/100 * 20)
        m_dot = Cv[index] * Math.sqrt((P_accumulator-P_fcv)/0.789)
        var volume = density / (m_dot * delta_t)
        P_tank = P_tank - ((((volume / Nitrogen_density)/ delta_t)*R*T)/(V*M))/101350
        
        chart.data.datasets[0].data.push(P_tank);
        chart.data.datasets[1].data.push(P_reducer);
        chart.data.datasets[2].data.push(P_fcv);
        chart.data.datasets[3].data.push(m_dot);

        // Remove the first data point if there are more than 10
        if (chart.data.labels.length > 10) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
            chart.data.datasets[2].data.shift();
            chart.data.datasets[3].data.shift();

        }

        // Update the chart
        chart.update();
    }, delta_t * 1000);

    timeout = setTimeout(() => {
        console.log("Function stopped after 5 seconds.");
        document.getElementById("simulate").checked = false; // Uncheck checkbox
        resetSimulation();
    }, 10000);
}

function resetSimulation() {
    console.log("Resetting...");
    index = 0;
    P_tank = 120;
    clearInterval(interval); // Stop the interval
    clearTimeout(timeout);  // Stop the timeout
}

document.getElementById("simulate").addEventListener("change", function() {
    if (this.checked) {
        startSimulation();
    } else {
        resetSimulation();
    }
});