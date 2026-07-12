let selectedRow = 0;
let selectedColumn = 0;
let previousTextArray = [];
let cells = [];

//値が入力されているか、自然数かをチェックする
function validateInput() {
  const rowInput = document.getElementById("paper-row");
  const columnInput = document.getElementById("paper-column");
  const rowValue = rowInput.value.trim();
  const columnValue = columnInput.value.trim();

  if (rowValue === "" || columnValue === "") {
    alert("行数と列数を入力してください。");
    return false;
  }

  const rowNumber = Number(rowValue);
  const columnNumber = Number(columnValue);

  if (!Number.isInteger(rowNumber) || rowNumber <= 0 || !Number.isInteger(columnNumber) || columnNumber <= 0) {
    alert("行数と列数は自然数である必要があります。");
    return false;
  }

  return true;
}

function setup() {
  if (!validateInput()) {
    return;
  }

  const settingsPage = document.getElementById("settings-page");
  const mainPage = document.getElementById("main-page");

  settingsPage.style.display = "none";
  mainPage.style.display = "flex";

  const paperContainer = document.getElementById("paper-container");
  const textarea = document.getElementById('textarea');
  const direction = document.getElementById("paper-direction").value;

  paperContainer.innerHTML = "";
  cells = [];

  selectedRow = Number(document.getElementById("paper-row").value);
  selectedColumn = Number(document.getElementById("paper-column").value);

  paperContainer.style.gridTemplateColumns = `repeat(${selectedColumn}, 32px)`;
  paperContainer.style.gridTemplateRows = `repeat(${selectedRow}, 32px)`;

  textarea.setAttribute("maxlength", selectedRow * selectedColumn);

  for(let i = 0; i < selectedRow; i++) {
    for(let j = 0; j < selectedColumn; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      paperContainer.appendChild(cell);

      cells.push(cell);
    }
  }

  previousTextArray = [];

  changeTextStyle(direction);
  updatePaper(textarea.value);

  window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
  });
}

function updatePaper(text) {
  const paperDirection = document.getElementById("paper-direction").value;

  showText(text, paperDirection);
}

function setupInputEventListeners() {
  const textarea = document.getElementById('textarea');

  textarea.addEventListener('input', function (event) {
    updatePaper(event.target.value);
  });
}

function createVerticalTextArray(text) {
  const normalizedText = normalizeText(text);
  const paper = [];

  let row = 0;
  let column = selectedColumn - 1; // 一番右から開始

  for (const character of normalizedText) {
    // 。、が行の先頭に来る場合は、前の列の最後に移動させる
    if ((character.includes("。") || character.includes("、")) && row === 0) {
      paper[selectedRow - 1][column + 1] += character;
      continue;
    }

    if (character === "\n") {
      if (row === 0) {
        paper[row] = paper[row] || [];
        paper[row][column] = character;
        continue;
      }

      column--;
      row = 0;
      continue;
    }

    paper[row] = paper[row] || [];
    paper[row][column] = character;
    row++;

    if (row >= selectedRow) {
      column--;
      row = 0;
    }
  }

  return paper;
}

function createHorizontalTextArray(text) {
  const normalizedText = normalizeText(text);
  const paper = [];

  let row = 0;
  let column = 0;

  paper[row] = [];

  for (const character of normalizedText) {
    // 。、が行の先頭に来る場合は、前の行の最後に移動させる
    if ((character.includes("。") || character.includes("、")) && column === 0) {
      paper[row - 1][selectedColumn - 1] += character;
      continue;
    }

    // 改行文字が来た場合は、次の行に移動する
    if (character === "\n") {

      // 改行文字が行の最後に来た場合はそのまま
      if (column === 0) {
        paper[row][column] = character;
        continue;
      }

      row++;
      column = 0;
      paper[row] = [];
      continue;
    }

    paper[row][column] = character;
    column++;

    if (column >= selectedColumn) {
      row++;
      column = 0;
      paper[row] = [];
    }
  }

  return paper;
}

function normalizeText(text) {
  const textArray = [...text];

  return textArray.reduce((result, char, index) => {
    const prevChar = textArray[index - 1];

    if (prevChar === "。" && (char === "」" || char === "』")) {
      result[result.length - 1] += char;
    } else {
      result.push(char);
    }

    return result;
  }, []);
}

function showText(text, direction = "vertical") {
  const paperContainer = document.getElementById("paper-container");
  const textArray = (direction === "vertical") ? createVerticalTextArray(text) : createHorizontalTextArray(text);

  for(let i = 0; i < Number(selectedRow); i++) {
    for(let j = 0; j < Number(selectedColumn); j++) {
      if (textArray[i]?.[j] === previousTextArray[i]?.[j]) {
        continue;
      }

      const childIndex = i * selectedColumn + j;
      const cell = cells[childIndex];
      cell.textContent = textArray[i]?.[j] ?? "\u3000";
    }
  }

  previousTextArray = textArray;
}

function changeTextStyle(direction) {
  const cell = document.getElementsByClassName("cell");

  for (let i = 0; i < cells.length; i++) {
    if (direction === "vertical") {
      cells[i].style.textOrientation = "upright";
      cells[i].style.writingMode = "vertical-rl";
    } else if (direction === "horizontal") {
      cells[i].style.textOrientation = "mixed";
      cells[i].style.writingMode = "horizontal-tb";
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setupInputEventListeners();
});