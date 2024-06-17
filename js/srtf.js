let srtfProcesses = new Map();

document.getElementById('add-srtf-process-btn').addEventListener('click', addProcess);
document.getElementById('srtf-btn').addEventListener('click', calculateSJF);

function addProcess() {
    const pidString = document.getElementById('srtf-pid').value;
    const arrivalTimeString = document.getElementById('srtf-arrival-time').value;
    const burstTimeString = document.getElementById('srtf-burst-time').value;

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

        if (srtfProcesses.has(pid)) {
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
        srtfProcesses.set(process.pid, process);
    }
    displayProcesses(srtfProcesses, 'srtf-table-body');
    saveToLocalStorage('srtf-processes', srtfProcesses);
}

function calculateSJF() {
    const processesArray = [...srtfProcesses.values()];
    const result = srtfAlgorithm(processesArray);
    displayResult(result, 'srtf-table-body');
    saveToLocalStorage('srtf', result);
}

function srtfAlgorithm(processes) {
processes.sort((a, b) => a.burst - b.burst);
    let time = 0;
    let result = [];
    let n = processes.length;
    let complete = 0, minValue = Number.MAX_VALUE;
    let shortest = 0, finishTime;
    let check = false;
    
    let startingTime = new Array(n);
    let timePerProcess = new Array(n);
    
    for(let i = 0; i < n; i++) {
        timePerProcess[i] = processes[i].burst;
    }

    for(let i = 0; i < n; i++) {
        startingTime[i] = 0;
    }

    while(complete != n) {
        for(let j = 0; j < n; j++) {
            if((processes[j].arrival <= time) && (timePerProcess[j] < minValue) && timePerProcess[j] > 0) {
                minValue = timePerProcess[j];
                shortest = j;
                check = true;
            }
        }

        if(check === false) {
            time++;
            continue;
        }

        timePerProcess[shortest]--;

        if(startingTime[shortest] == 0 ) {
            startingTime[shortest] = time;
        }
        minValue = timePerProcess[shortest];
        if(minValue == 0) {
            minValue = Number.MAX_VALUE;
        }

        if(timePerProcess[shortest] == 0) {
            complete++;
            check = false;
            finishTime = startTime + processes[shortest].burst;

            result.push(new Process(
                processes[shortest].pid,
                processes[shortest].arrival,
                processes[shortest].burst,
                startingTime[shortest],
                time + 1
            ));
        }

        time++;
    }

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
    if (key === 'srtf-processes') {
        srtfProcesses = new Map(data);
        displayProcesses(data, tableBodyId);
    } else {
        displayResult(data, tableBodyId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage('srtf-processes', 'srtf-table-body');
});