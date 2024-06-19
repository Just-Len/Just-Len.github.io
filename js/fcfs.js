let processes = new Map();

document.getElementById('add-process-btn').addEventListener('click', addProcess);
document.getElementById('fcfs-btn').addEventListener('click', calculateFCFS);

function addProcess() {
    const pidString = document.getElementById('pid').value;
    const arrivalTimeString = document.getElementById('arrival-time').value;
    const burstTimeString = document.getElementById('burst-time').value;

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

        if (processes.has(pid)) {
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
        processes.set(process.pid, process);
    }
    displayProcesses(processes, 'fcfs-table-body');
    saveToLocalStorage('fcfs-processes', newProcesses);
}

function calculateFCFS() {
    const processesArray = [...processes.values()];
    const result = fcfsAlgorithm(processesArray);
    displayResult(result, 'fcfs-table-body');
    saveToLocalStorage('fcfs', result);
}

function fcfsAlgorithm(processes) {
    processes.sort((a, b) => a.arrival - b.arrival);
    let time = 0;
    let result = [];

    processes.forEach(process => {
        const startTime = Math.max(time, process.arrival);
        const finishTime = startTime + process.burst;
        result.push({
            pid: process.pid,
            arrival: process.arrival,
            burst: process.burst,
            startTime,
            finishTime
        });
        time = finishTime;
    });

    return result;
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage('fcfs-processes', 'fcfs-table-body');
});
