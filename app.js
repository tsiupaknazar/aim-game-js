const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

const startBtn = select("#start");
const screens = selectAll(".screen");
const timeList = select("#time-list");
const timeEl = select("#time");
const board = select("#board");
const recordsBtn = select("#records");
const modal = select("#modal");
const closeBtn = select("#close-modal");
const recordsList = select("#records-list");
const difficultyBtns = selectAll(".difficulty-btn");

const colors = [
  "#04bd35",
  "#041dbd",
  "#ff9d3b",
  "#35baa8",
  "#bdbab7",
  "#9eb117",
  "#86b6e0",
  "#dfc110",
  "#5ad01a",
  "#1f2dd1",
  "#8aa94c",
  "#381234",
  "#e2f084",
  "#e83360",
  "#de844c",
  "#777640",
  "#3f7c55",
  "#6226e6",
];

const difficultyDisappearTimes = {
  easy: 4,
  medium: 2,
  hard: 1,
};

let time = 0;
let score = 0;
let selectedTime = null;
let selectedDifficulty = "easy";
let disappearIntervalId;
let currentCircle;

startBtn.addEventListener("click", () => {
  screens[0].classList.add("up");
});

timeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("time-btn")) {
    time = parseInt(event.target.getAttribute("data-time"));
    selectedTime = time;
    screens[1].classList.add("up");
  }
});

difficultyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedDifficulty = btn.getAttribute("data-difficulty");
    difficultyBtns.forEach((btn) => btn.classList.remove("selected"));
    btn.classList.add("selected");
    screens[2].classList.add("up");
    startGame();
  });
});

recordsBtn.addEventListener("click", () => {
  openModal();
});

closeBtn.addEventListener("click", () => {
  closeModal();
});

board.addEventListener("click", (event) => {
  if (event.target.classList.contains("circle")) {
    score++;
    event.target.remove();
    createRandomCircle();
  }
});

function startGame() {
  setTime(selectedTime);
  clearInterval(disappearIntervalId);
  disappearIntervalId = setInterval(() => {
    if (currentCircle) {
      currentCircle.remove();
      createRandomCircle();
    }
  }, difficultyDisappearTimes[selectedDifficulty] * 1000);
  createRandomCircle();
  countdown();
}

function countdown() {
  const intervalId = setInterval(() => {
    if (time > 0) {
      time--;
      setTime(time);
    } else {
      finishGame();
      clearInterval(intervalId);
    }
  }, 1000);
}

function setTime(value) {
  timeEl.textContent = `00:${value < 10 ? "0" + value : value}`;
}

function finishGame() {
  clearInterval(disappearIntervalId);
  const recordKey = `record_${selectedTime}_${selectedDifficulty}`;
  const prevRecord = getRecord(recordKey);
  if (!prevRecord || score > prevRecord) {
    setRecord(recordKey, score);
  }
  const record = getRecord(recordKey);
  const recordText = record
    ? `Time: ${selectedTime}s | Difficulty: ${selectedDifficulty} | Score: ${record}`
    : "No record";

  board.innerHTML = `<div>
    <h1>Score: <span class="primary">${score}</span></h1>
    <button class="restart-btn" onclick="restartGame()">Restart</button>
  </div>`;
  timeEl.parentNode.classList.add("hide");
}

function createRandomCircle() {
  if (time === 0) {
    return;
  }

  const circle = document.createElement("div");
  const size = getRandomNumber(10, 60);
  const { width, height } = board.getBoundingClientRect();
  const x = getRandomNumber(0, width - size);
  const y = getRandomNumber(0, height - size);

  circle.classList.add("circle");
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.top = `${y}px`;
  circle.style.left = `${x}px`;
  circle.style.background = getRandomColor();

  board.append(circle);
  currentCircle = circle;
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function handleCircleClick(event) {
  if (event.target.classList.contains("circle")) {
    score++;
    event.target.remove();
    createRandomCircle();
  }
}

function setRecord(key, score) {
  const savedRecords = JSON.parse(localStorage.getItem("records")) || {};
  savedRecords[key] = score;
  localStorage.setItem("records", JSON.stringify(savedRecords));
}

function getRecord(key) {
  const savedRecords = JSON.parse(localStorage.getItem("records")) || {};
  return savedRecords[key] || null;
}

function openModal() {
  const savedRecords = JSON.parse(localStorage.getItem("records")) || {};
  const recordKeys = Object.keys(savedRecords);
  recordsList.innerHTML = recordKeys.length
    ? recordKeys
        .map((key) => {
          const [time, difficulty] = key.split("_").slice(1);
          const record = savedRecords[key];
          return `<li>Time: ${time}s | Difficulty: ${difficulty} | Score: ${record}</li>`;
        })
        .join("")
    : "<li>No records</li>";
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

function restartGame() {
  window.location.reload();
}
