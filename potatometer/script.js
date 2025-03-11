const STARTING_STATE = 0;
const RUNNING_STATE = 1;
const PAUSED_STATE = 2;
const TIMEOUT_STATE = 3;

let timer;
let state = STARTING_STATE;
let startingPlayer = 0;
let activePlayer = 0;
let isMuted = false;

const presetTimes = [3 * 60 * 1000, 3 * 60 * 1000]; // in miliseconds
const timers = [presetTimes[0], presetTimes[1]];

const timeBoxes = [document.getElementById("timeBox1"), document.getElementById("timeBox2")];
const toggleButtons = [document.getElementById("playerToggleButton1"), document.getElementById("playerToggleButton2")];

let clickSound = new Audio("Click.mp3");

function format_time(player) {
    if (timers[player] < 20000) { // 20 seconds
        timeBoxes[player].textContent = "0:" + String(Math.floor(timers[player] % 60000 / 1000)).padStart(2, "0") + "." + Math.floor(timers[player] % 1000 / 100);
        timeBoxes[player].style.background = "#FFFDEA";
    } else {
        timeBoxes[player].textContent = Math.floor(timers[player] / 60000) + ":" + String(Math.floor(timers[player] % 60000 / 1000)).padStart(2, "0");
        timeBoxes[player].style.background = "#EAF6FF";
    }
}

function start_button_clicked() {
    if (state == STARTING_STATE) {
        timer = window.setInterval(tick, 10);
        state = RUNNING_STATE;
        timeBoxes[(activePlayer + 1) % 2].style.color = "#4A4A4A";
        document.getElementById("startButton").getElementsByClassName("largeText")[0].textContent = "Switch";
    } else if (state == RUNNING_STATE) {
        activePlayer = (activePlayer + 1) % 2;
        timeBoxes[activePlayer].style.color = "#000000";
        timeBoxes[(activePlayer + 1) % 2].style.color = "#4A4A4A";
    }
}

function toggle_players() {
    if (state != STARTING_STATE) {
        return;
    }
    startingPlayer = (startingPlayer + 1) % 2; 
    activePlayer = startingPlayer;
    toggleButtons[0].innerHTML = activePlayer + 1;
    toggleButtons[1].innerHTML = (activePlayer + 1) % 2 + 1;
}

function adjust_time(player, amount) {
    if (state != STARTING_STATE) {
        return;
    }
    presetTimes[player] += amount;
    if (presetTimes[player] < 0) {
        presetTimes[player] = 0;
    }
    timers[player] = presetTimes[player];
    format_time(player);
}

function reset() {
    state = STARTING_STATE;
    window.clearInterval(timer);
    timers[0] = presetTimes[0];
    timers[1] = presetTimes[1];
    format_time(0);
    format_time(1);
    document.getElementById("startButton").getElementsByClassName("largeText")[0].textContent = "Start";
    timeBoxes[0].style.color = "#000000";
    timeBoxes[1].style.color = "#000000";
    activePlayer = startingPlayer;
    document.getElementById("deadPotato").className = "hiddenImage";
    document.getElementById("kingPotato").className = "hiddenImage";
    document.getElementById("sadPotato").className = "hiddenImage";
    document.getElementById("knifePotato").className = "hiddenImage";
    document.getElementById("pauseButton").className = "button text pause";
    document.getElementById("pauseButton").innerHTML = "Pause";
}

function mute() {
    if (isMuted) {
        clickSound.volume = 0;
        document.getElementById("muteButton").className = "button text unmute";
        document.getElementById("muteButton").textContent = "Unmute";
    } else {
        clickSound.volume = 1;
        document.getElementById("muteButton").className = "button text mute";
        document.getElementById("muteButton").textContent = "Mute";
    }
    isMuted = !isMuted;
}

function pause() {
    if (state == RUNNING_STATE) {
        window.clearInterval(timer);
        state = PAUSED_STATE;
        document.getElementById("pauseButton").className = "button text continue";
        document.getElementById("pauseButton").innerHTML = "Continue";
    } else if (state == PAUSED_STATE) {
        timer = window.setInterval(tick, 10);
        state = RUNNING_STATE;
        document.getElementById("pauseButton").className = "button text pause";
        document.getElementById("pauseButton").innerHTML = "Pause";
    }
}

function tick() {
    timers[activePlayer] -= 10;
    if (timers[activePlayer] < 0) {
        window.clearInterval(timer);
        timers[activePlayer] = 0;
        state = TIMEOUT_STATE;
        if (Math.floor(Math.random() * 2) == 0) {
            if (activePlayer == 0) {
                document.getElementById("deadPotato").className = "hiddenImage left";
                document.getElementById("knifePotato").className = "hiddenImage right";
            } else {
                document.getElementById("deadPotato").className = "hiddenImage right";
                document.getElementById("knifePotato").className = "hiddenImage left";
            }
        } else {
            if (activePlayer == 0) {
                document.getElementById("sadPotato").className = "hiddenImage left";
                document.getElementById("kingPotato").className = "hiddenImage right";
            } else {
                document.getElementById("sadPotato").className = "hiddenImage right";
                document.getElementById("kingPotato").className = "hiddenImage left";
            }
        }
        clickSound.play();
    }
    format_time(activePlayer);
}