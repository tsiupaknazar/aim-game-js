const startBtn = document.querySelector("#start");
const screens = document.querySelectorAll(".screen");
const timeList = document.querySelector("#time-list");
const timeEl = document.querySelector("#time");
const board = document.querySelector("#board");
const recordsBtn = document.querySelector("#records");
const modal = document.querySelector("#modal");
const closeBtn = document.querySelector("#close-modal");
const recordsList = document.querySelector("#records-list");
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

let time = 0;
let score = 0;
let selectedTime = null;
let records = {}; // Об'єкт для збереження рекордів за типом часу

startBtn.addEventListener("click", (event) => {
  event.preventDefault();
  screens[0].classList.add("up");
});

timeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("time-btn")) {
    time = parseInt(event.target.getAttribute("data-time"));
    selectedTime = time;
    screens[1].classList.add("up");
    startGame();
  }
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
  setInterval(decreaseTime, 1000);
  createRandomCircle();
  setTime(time);
}

function decreaseTime() {
  if (time === 0) {
    finishGame();
  } else {
    let current = --time;
    if (current < 10) {
      current = `0${current}`;
    }
    setTime(current);
  }
}

function setTime(value) {
  timeEl.innerHTML = `00:${value}`;
}

function finishGame() {
  const prevRecord = getRecord(selectedTime);
  if (!prevRecord || score > prevRecord) {
    setRecord(selectedTime, score);
  }
  let recordText = "";
  const record = getRecord(selectedTime);
  if (record) {
    recordText = `Time: ${selectedTime}s Score: ${record}`;
  } else {
    recordText = "No record";
  }

  let restartBtn = document.createElement("button");
  restartBtn.classList.add("restart-btn");
  restartBtn.innerText = "Restart";
  restartBtn.addEventListener("click", restartGame);

  board.innerHTML = `<div>
  <h1>Score: <span class="primary">${score}</span></h1>
  ${restartBtn.outerHTML}
  </div>`;
  timeEl.parentNode.classList.add("hide");
}

function restartGame() {
  window.location.reload();
}


function createRandomCircle() {
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
  const color = getRandomColor();
  circle.style.background = color;
  circle.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}`;

  board.append(circle);
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function setRecord(time, score) {
  const recordKey = `record_${time}`;
  records[recordKey] = score;
  localStorage.setItem("records", JSON.stringify(records));
}

function getRecord(time) {
  const recordKey = `record_${time}`;
  const savedRecords = localStorage.getItem("records");
  if (savedRecords) {
    records = JSON.parse(savedRecords);
    return records[recordKey] || null;
  }
  return null;
}

function openModal() {
  const savedRecords = localStorage.getItem("records");
  if (savedRecords) {
    records = JSON.parse(savedRecords);
    const recordKeys = Object.keys(records);
    recordsList.innerHTML = "";
    if (recordKeys.length > 0) {
      recordKeys.forEach((recordKey) => {
        const time = recordKey.split("_")[1];
        const record = records[recordKey];
        recordsList.innerHTML += `<li>Time: ${time}s | Score: ${record}</li>`;
      });
    } else {
      recordsList.innerHTML = "<li>No records</li>";
    }
  } else {
    recordsList.innerHTML = "<li>No records</li>";
  }
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}
