let processes = [];

document.getElementById('add-process-btn').addEventListener('click', addProcess);
document.getElementById('fcfs-btn').addEventListener('click', calculateFCFS);

function addProcess() {
    const pid = document.getElementById('pid').value;
    const arrival = parseInt(document.getElementById('arrival-time').value);
    const burst = parseInt(document.getElementById('burst-time').value);

    if (pid && !isNaN(arrival) && !isNaN(burst)) {
        const process = { pid, arrival, burst };
        processes.push(process);
        displayProcesses(processes, 'fcfs-table-body');
        saveToLocalStorage('fcfs-processes', processes);
    } else {
        alert('Ingrese informacion valida en los campos.');
    }
}

function calculateFCFS() {
    const result = fcfsAlgorithm(processes);
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
    if (key === 'fcfs-processes') {
        processes = data;
        displayProcesses(data, tableBodyId);
    } else {
        displayResult(data, tableBodyId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage('fcfs-processes', 'fcfs-table-body');
});
