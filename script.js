let selectedRow = 0;
let selectedColumn = 0;
let previousTextArray = [];
let cells = [];

function setup() {
  const paperContainer = document.getElementById("paper-container");
  const textarea = document.getElementById('textarea');

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
      paperContainer.appendChild(cell);

      cells.push(cell);
    }
  }

  previousTextArray = [];
  updatePaper(textarea.value);
}

function updatePaper(text) {
  const paperDirection = document.getElementById("paper-direction").value;

  if (paperDirection === "horizontal") {
    showHorizontalText(text);
  } else {
    showVerticalText(text);
  }
}

function setupInputEventListeners() {
  const textarea = document.getElementById('textarea');

  textarea.addEventListener('input', function (event) {
    updatePaper(event.target.value);
  });
}

function createFormattedText(text) {
  const paper = [];

  let row = 0;
  let column = 0;

  paper[row] = [];

  for (const character of text) {
    // 。、が行の先頭に来る場合は、前の行の最後に移動させる
    if ((character === "。" || character === "、") && column === 0) {
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

function showVerticalText(text) {
  const paperContainer = document.getElementById("paper-container");
  const textArray = createFormattedText(text);

  for(let i = 0; i < Number(selectedRow); i++) {
    for(let j = 0; j < Number(selectedColumn); j++) {
      if (textArray[i]?.[j] === previousTextArray[i]?.[j]) {
        continue;
      }

      const childIndex = (j * selectedColumn) + ((i + j) * selectedColumn);
      const cell = cells[childIndex];
      cell.textContent = textArray[i]?.[j] ?? "\u3000";

      console.log(`i: ${i}, j: ${j}, childIndex: ${childIndex}, text: ${textArray[i]?.[j] ?? "\u3000"}`);
    }
  }
}

function showHorizontalText(text) {
  const paperContainer = document.getElementById("paper-container");
  const textArray = createFormattedText(text);

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

document.addEventListener('DOMContentLoaded', function () {
  setupInputEventListeners();
});