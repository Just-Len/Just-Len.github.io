let roundRobinProcesses = new Map();
let counter = 0;
let quantum = 0;

document.getElementById('add-round-robin-process-btn').addEventListener('click', addProcess);
document.getElementById('round-robin-btn').addEventListener('click', calculateRoundRobin);

function addProcess() {
    if(counter == 0) {
        document.getElementById('round-robin-quantum').disabled = true;
    }
    counter++;

    const pidString = document.getElementById('round-robin-pid').value;
    const arrivalTimeString = document.getElementById('round-robin-arrival-time').value;
    const burstTimeString = document.getElementById('round-robin-burst-time').value;
    const quantumString = document.getElementById('round-robin-quantum').value;
    quantum = parseInt(quantumString);

    const pids = pidString.split(" ");
    const arrivalTimes = arrivalTimeString.split(" ");
    const burstTimes = burstTimeString.split(" ");

    if (pids.length !== arrivalTimes.length || pids.length !== burstTimes.length) {
        alert('Debe ingresar la misma cantidad de elementos separados por espacios en los campos.');
        return;
    }

    const newProcesses = [];
    for (let i = 0; i < pids.length; ++i) {
        const pid = pids[i];
        const arrival = parseInt(arrivalTimes[i]);
        const burst = parseInt(burstTimes[i]);

        if (roundRobinProcesses.has(pid)) {
            alert('Los ID de proceso (PID) deben ser únicos.');
            return;
        }
        else if (!pid || isNaN(arrival) || isNaN(burst)) {
            alert('Ingrese informacion valida en los campos.');
            return;
        } else {
            const process = new Process(pid, arrival, burst);
            newProcesses.push(process);
        }
    }

    for (const process of newProcesses) {
        roundRobinProcesses.set(process.pid, process);
    }
    displayProcesses(roundRobinProcesses, 'round-robin-table-body');
    saveToLocalStorage('round-robin-processes', newProcesses);
}

function calculateRoundRobin() {
    const processesArray = [...roundRobinProcesses.values()];
    const result = roundRobinAlgorithm(processesArray);
    displayResult(result, 'round-robin-table-body');
    saveToLocalStorage('round-robin', result);
}

function roundRobinAlgorithm(processes) {
    processes.sort((a, b) => a.arrival - b.arrival);
    let time = 0;
    let result = [];
    let n = processes.length;
    let complete = 0;
    let indexRound = 0;
    let check = false;
    let startingTime = new Array(n);
    let burstPerProcess = new Array(n);
    let rest = 0;

    for(let i = 0; i < n; i++) {
        burstPerProcess[i] = processes[i].burst;
        startingTime[i] = 0;
    }

    while(complete != n) {
        for(let j = 0; j < n; j++) {
            if(time >= processes[j].arrival) {
                if(indexRound == j) {
                    burstPerProcess[j] = burstPerProcess[j] - quantum;
                    check = true;
                    break;
                }else {
                    continue;
                }
            }
        }

        if(check) {
            if(startingTime[indexRound] == 0 ) {
                if(rest != 0) {
                    startingTime[indexRound] = time - rest;
                }else {
                    startingTime[indexRound] = time;
                }
                rest = 0;
            }
    
            if(burstPerProcess[indexRound] == 0) {
                complete++;
                
                result.push(new Process(
                    processes[indexRound].pid,
                    processes[indexRound].arrival,
                    processes[indexRound].burst,
                    startingTime[indexRound],
                    time + 2
                ));

                if(indexRound == n - 1) {
                    indexRound = 0;
                }else{
                    indexRound++;
                }
            }else if(burstPerProcess[indexRound] < 0) {
                rest = Math.abs(burstPerProcess[indexRound]);
                burstPerProcess[indexRound + 1] -= rest;
                burstPerProcess[indexRound] = 0;
                complete++;

                result.push(new Process(
                    processes[indexRound].pid,
                    processes[indexRound].arrival,
                    processes[indexRound].burst,
                    startingTime[indexRound],
                    time + 2
                ));

                if(indexRound == n - 1) {
                    indexRound = 0;
                }else{
                    indexRound++;
                }
            }
            time += quantum;
            check = false;
        }else {
            time++;
        }
    }

    return result;
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage('round-robin-processes', 'round-robin-table-body');
});