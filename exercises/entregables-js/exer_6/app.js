let timerInterval;
let elapsedSeconds = 0;
let running = false;

function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function updateDisplay() {
    document.getElementById('timer').textContent = formatTime(elapsedSeconds);
}

document.getElementById('startBtn').onclick = function() {
    if (!running) {
        running = true;
        timerInterval = setInterval(() => {
            elapsedSeconds++;
            updateDisplay();
        }, 1000);
    }
};

document.getElementById('pauseBtn').onclick = function() {
    running = false;
    clearInterval(timerInterval);
};

document.getElementById('resetBtn').onclick = function() {
    running = false;
    clearInterval(timerInterval);
    elapsedSeconds = 0;
    updateDisplay();
};

updateDisplay();