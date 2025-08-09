// DOM Elements
const mainTimer = document.querySelector('.main-timer');
const lapCountDisplay = document.getElementById('lapCount');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapList = document.getElementById('lapList'); // Corrected ID

// Variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let lapCount = 0;
let laps = [];
let isRunning = false;
let lastLapTime = 0;
let lastLapPressTime = 0;

// Format time as HH:MM:SS:CS
function formatTime(time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const centiseconds = Math.floor((time % 1000) / 10);
    return `${hours.toString().padStart(2, '0')}:${minutes
        .toString().padStart(2, '0')}:${seconds
        .toString().padStart(2, '0')}:${centiseconds
        .toString().padStart(2, '0')}`;
}

// Update timer display
function updateTimer() {
    const now = Date.now();
    elapsedTime = now - startTime;
    mainTimer.textContent = formatTime(elapsedTime);

    // ✅ Always calculate current lap based on elapsedTime
    document.getElementById('currentLap').textContent =
        `Current Lap: ${formatTime(elapsedTime - lastLapTime)}`;
}

// Start stopwatch
function startTimer() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        isRunning = true;

        if (lapCount === 0) {
            lastLapTime = 0; // Start from 0
        }

        startBtn.disabled = true;
        pauseBtn.disabled = false;
        lapBtn.disabled = false;
        resetBtn.disabled = false;
    }
}

// Pause stopwatch
function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        elapsedTime = Date.now() - startTime;
        isRunning = false;

        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}


// Record lap time
function recordLap() {
    const currentTime = isRunning ? Date.now() - startTime : elapsedTime;
    const lapDuration = currentTime;

    if (lapDuration < 0) return;

    lapCount++;
    lapCountDisplay.textContent = `Laps: ${lapCount}`;

    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.innerHTML = `
        <span class="lap-number">Lap ${lapCount}</span>
        <span class="lap-time">${formatTime(lapDuration)}</span>
    `;
    lapList.prepend(lapItem);

    // ✅ Reset current lap start reference to total elapsed time
    lastLapTime = currentTime;

    // Keep current lap display at 00:00 after recording
    document.getElementById('currentLap').textContent = `Current Lap: 00:00:00:00`;
}

// Reset everything
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;

    startTime = 0;
    elapsedTime = 0;
    lapCount = 0;
    lastLapTime = 0;
    laps = [];

    mainTimer.textContent = '00:00:00.00';
    lapCountDisplay.textContent = 'Laps: 0';
    lapList.innerHTML = '';

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
    resetBtn.disabled = true;
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetTimer);
