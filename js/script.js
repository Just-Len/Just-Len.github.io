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

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('d-none');
    });
    document.getElementById(sectionId).classList.remove('d-none');
}
