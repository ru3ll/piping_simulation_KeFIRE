var simulate = document.getElementById('simulate')


// Constants
const density = 789
const V = 7.9 // volume of the tank
const T = 300 // temp in kelvin
const M = 0.028 // molar mass
const R = 8.314 // gas constant
const Rs = 296.8 // specific gas constant of Nitrogen
const Nitrogen_density = 1.19 // kg/m^-3
const A = 0.0003141593; // area of the pipe
const gamma = 1.4 // heat capacity ratio for nitrogen 
const Cd = 0.98 // assumed Cd for pipe
const p_chamber = 2000000;
const delta_t = 0.01 // ΔT

// variables
let interval; // Store interval reference
let timeout;  // Store timeout reference

var P_tank = 12000000
var fcv = 0;
var P_reducer = 2200000
var P_acc = 2200000;
var m_dot_ethanol = 0;
var m_acc = 0.029 // intial mass of nitrogen in the accumulator in kg
var Q_eth;
var V_acc = 0.00073 // volume of nitrojen in the accumulator in m^3
var N2_tank_mass = (P_tank * V) / (Rs * T) // mass of nitrogen in the tank from the ideal gas equation
var density_at_35_bar = P_reducer/ (Rs * T) // density of nitrogen at reducer pressure

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
            label : "flow rate",
            data: [],
            borderColor: "purple",
            fill: false,
            tension: 0
        },{
            label : "P_acc",
            data: [],
            borderColor: "blue",
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
        fcv = $("#fcv").roundSlider("option", "value");
        fcv = fcv / 100
        console.log(fcv)

        //calculate the volume flow rate
        Q_eth = A * Math.sqrt( 2*(P_acc- p_chamber)/density) * fcv

        // the flow rate is in m^3/s. get the volume of ethanol out
        var V_eth = Q_eth * delta_t

        // get the mass flow rate
        m_dot_ethanol = density * Q_eth

        // compute the pressure in the accumulator due to the expansion
        P_acc = P_acc * V_acc / (V_acc + V_eth)
        

        // compute the new volume of nitrogen in the accumulator
        V_acc = V_acc + V_eth

        // compute the pressure in the nitrogen tank
        // I have assumed that the volume filling in the space left by the ethanol is the 
        // same as the volume of nitrogen that has to leave the tank

        // start ny calculating the mass flow rate

        if (Math.pow((P_acc/P_reducer), gamma) < 1){
            var m_dot_N2 = Cd*A * Math.sqrt( (density_at_35_bar * 2 * (P_reducer - P_acc))/(1-Math.pow((P_acc/P_reducer), gamma)))
        }else{
            var m_dot_N2 = 0
        }
        var m = m_dot_N2 * delta_t

        // update P_accumulator due to the air that nitrogen that just entered
        P_acc = P_acc * (m_acc + m) / m_acc

        m_acc = m_acc + m

        // using the ideal gas equation, the pressure ratios can be found to be 
        // p1/p2 = m1/m2. Thus, 

        P_tank = P_tank * (N2_tank_mass - m) / N2_tank_mass
        console.log("P_tank")
        console.log(P_tank)

        // P_tank = 120
        // update the mass in the tank
        N2_tank_mass = (N2_tank_mass - m)
        
        chart.data.datasets[0].data.push(P_tank);
        chart.data.datasets[1].data.push(P_reducer);
        chart.data.datasets[2].data.push(m_dot_ethanol);
        chart.data.datasets[3].data.push(P_acc);

        // Remove the first data point if there are more than 10
        // if (chart.data.labels.length > 10) {
        //     chart.data.labels.shift();
        //     chart.data.datasets[0].data.shift();
        //     chart.data.datasets[1].data.shift();
        //     chart.data.datasets[2].data.shift();
        //     chart.data.datasets[3].data.shift();

        // }

        // Update the chart
        chart.update();
    }, delta_t * 1000);

    timeout = setTimeout(() => {
        console.log("Function stopped after 5 seconds.");
        document.getElementById("simulate").checked = false; // Uncheck checkbox
        resetSimulation();
    }, 5000);
}

function resetSimulation() {
    console.log("Resetting...");
    P_tank = 12000000;
    P_acc = 2200000;
    m_acc = 0.029
    V_acc = 0.00073
    N2_tank_mass = (P_tank * V) / (Rs * T)

    clearInterval(interval); // Stop the interval
    clearTimeout(timeout);  // Stop the timeout

    // clear the chart
    chart.data.labels = []
    chart.data.datasets[0].data = [];
    chart.data.datasets[1].data = [];
    chart.data.datasets[2].data = []
    chart.data.datasets[3].data=[];
    
}

document.getElementById("simulate").addEventListener("change", function() {
    if (this.checked) {
        startSimulation();
    } else {
        resetSimulation();
    }
});