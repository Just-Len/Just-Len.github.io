class Process {
    constructor(pid,
                arrival,
                burst,
                startTime = 0,
                finishTime = 0) {
                    this.pid = pid;
                    this.arrival = arrival;
                    this.burst = burst;
                    this.startTime = startTime;
                    this.finishTime = finishTime;
                }
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
    if (key.includes('processes')) {
        processes = new Map(data);
        displayProcesses(data, tableBodyId);
    } else {
        displayResult(data, tableBodyId);
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('d-none');
    });
    document.getElementById(sectionId).classList.remove('d-none');
}
