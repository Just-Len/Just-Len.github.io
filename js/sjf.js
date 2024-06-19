let sjfProcesses = new Map();

document.getElementById('add-sjf-process-btn').addEventListener('click', addProcess);
document.getElementById('sjf-btn').addEventListener('click', calculateSJF);

function addProcess() {
    const pidString = document.getElementById('sjf-pid').value;
    const arrivalTimeString = document.getElementById('sjf-arrival-time').value;
    const burstTimeString = document.getElementById('sjf-burst-time').value;

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

        if (sjfProcesses.has(pid)) {
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
        sjfProcesses.set(process.pid, process);
    }
    displayProcesses(sjfProcesses, 'sjf-table-body');
    saveToLocalStorage('sjf-processes', newProcesses);
}

function calculateSJF() {
    const processesArray = [...sjfProcesses.values()];
    const result = sjfAlgorithm(processesArray);
    displayResult(result, 'sjf-table-body');
    saveToLocalStorage('sjf', result);
}

function sjfAlgorithm(processes) {
    processes.sort((a, b) => a.burst - b.burst);
    let time = 0;
    let result = [];

    processes.forEach(process => {
        const startTime = Math.max(time, process.arrival);
        const finishTime = startTime + process.burst;
        result.push(new Process(
            process.pid,
            process.arrival,
            process.burst,
            startTime,
            finishTime
        ));

        time = finishTime;
    });

    return result;
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage('sjf-processes', 'sjf-table-body');
});