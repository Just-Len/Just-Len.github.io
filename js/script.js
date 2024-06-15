document.getElementById('fcfs-btn').addEventListener('click', calculateFCFS);

function calculateFCFS() {
    const input = document.getElementById('process-input').value;
    const processes = parseInput(input);
    const result = fcfsAlgorithm(processes);
    displayResult(result);
    saveToLocalStorage('fcfs', result);
}

function parseInput(input) {
    const processStrings = input.split(';');
    return processStrings.map(str => {
        const [pid, arrival, burst] = str.split(',');
        return { pid, arrival: parseInt(arrival), burst: parseInt(burst) };
    });
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
            startTime,
            finishTime
        });
        time = finishTime;
    });

    return result;
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Resultado:</h2><ul>' + result.map(r => `<li>${r.pid}: ${r.startTime} - ${r.finishTime}</li>`).join('') + '</ul>';
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
