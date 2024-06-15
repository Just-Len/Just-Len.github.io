let sjfProcesses = new Map();

document.getElementById('add-sjf-process-btn').addEventListener('click', addProcess);
document.getElementById('sjf-btn').addEventListener('click', calculateSJF);

function addProcess() {
    const pid = document.getElementById('sjf-pid').value;
    const arrival = parseInt(document.getElementById('sjf-arrival-time').value);
    const burst = parseInt(document.getElementById('sjf-burst-time').value);

    if (sjfProcesses.has(pid)) {
        alert('Los ID de proceso (PID) deben ser únicos.')
    }
    else if (!pid || isNaN(arrival) || isNaN(burst)) {
        alert('Ingrese informacion valida en los campos.');
    } else {
        const process = { pid, arrival, burst };
        sjfProcesses.set(pid, process);
        displayProcesses(sjfProcesses, 'sjf-table-body');
        saveToLocalStorage('sjf-processes', sjfProcesses);
    }
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

function displayProcesses(processes, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = '';
    processes.forEach(process => {
        const row = `<tr>
            <td>${process.pid}</td>
            <td>${process.arrival}</td>
            <td>${process.burst}</td>
            <td></td>
            <td></td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function displayResult(result, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = '';
    result.forEach(r => {
        const row = `<tr>
            <td>${r.pid}</td>
            <td>${r.arrival}</td>
            <td>${r.burst}</td>
            <td>${r.startTime}</td>
            <td>${r.finishTime}</td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key, tableBodyId) {
    const data = JSON.parse(localStorage.getItem(key)) || [];
    if (key === 'sjf-processes') {
        sjfProcesses = new Map(data);
        displayProcesses(data, tableBodyId);
    } else {
        displayResult(data, tableBodyId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage('sjf-processes', 'sjf-table-body');
});