const displayEl = document.getElementById("display");
const historyEl = document.getElementById("history");
const keysEl = document.querySelector(".keys");

const state = {
  current: "0",
  previous: null,
  operator: null,
  overwrite: false,
};

const MAX_LEN = 14;

function updateUI() {
  displayEl.textContent = formatDisplay(state.current);
  historyEl.textContent = state.previous !== null && state.operator
    ? `${trimZero(state.previous)} ${symbolFor(state.operator)}`
    : "";
}

function formatDisplay(value) {
  if (value === "Error") return value;
  const num = Number(value);
  if (!Number.isFinite(num)) return "Error";
  return num.toLocaleString("en-US", { maximumFractionDigits: 10 });
}

function trimZero(value) {
  const num = Number(value);
  return Number.isInteger(num) ? String(num) : String(num);
}

function symbolFor(op) {
  return op === "*" ? "x" : op;
}

function inputDigit(digit) {
  if (state.current === "Error") clearAll();

  if (state.overwrite) {
    state.current = digit;
    state.overwrite = false;
    return;
  }

  if (state.current === "0") {
    state.current = digit;
    return;
  }

  if (state.current.replace("-", "").replace(".", "").length >= MAX_LEN) return;
  state.current += digit;
}

function inputDecimal() {
  if (state.current === "Error") clearAll();
  if (state.overwrite) {
    state.current = "0.";
    state.overwrite = false;
    return;
  }
  if (!state.current.includes(".")) state.current += ".";
}

function clearAll() {
  state.current = "0";
  state.previous = null;
  state.operator = null;
  state.overwrite = false;
}

function deleteLast() {
  if (state.overwrite || state.current === "Error") {
    state.current = "0";
    state.overwrite = false;
    return;
  }
  if (state.current.length <= 1 || (state.current.length === 2 && state.current.startsWith("-"))) {
    state.current = "0";
    return;
  }
  state.current = state.current.slice(0, -1);
}

function applyPercent() {
  if (state.current === "Error") return;
  state.current = String(Number(state.current) / 100);
}

function setOperator(nextOp) {
  if (state.current === "Error") return;

  if (state.operator && !state.overwrite) {
    compute();
  }

  state.previous = state.current;
  state.operator = nextOp;
  state.overwrite = true;
}

function compute() {
  if (!state.operator || state.previous === null) return;

  const a = Number(state.previous);
  const b = Number(state.current);
  let result;

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    state.current = "Error";
  } else {
    switch (state.operator) {
      case "+":
        result = a + b;
        break;
      case "-":
        result = a - b;
        break;
      case "*":
        result = a * b;
        break;
      case "/":
        result = b === 0 ? NaN : a / b;
        break;
      default:
        return;
    }

    state.current = Number.isFinite(result) ? String(Number(result.toFixed(10))) : "Error";
  }

  state.previous = null;
  state.operator = null;
  state.overwrite = true;
}

function handleAction(action, value) {
  switch (action) {
    case "digit":
      inputDigit(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "operator":
      setOperator(value);
      break;
    case "equals":
      compute();
      break;
    case "clear":
      clearAll();
      break;
    case "delete":
      deleteLast();
      break;
    case "percent":
      applyPercent();
      break;
    default:
      return;
  }

  updateUI();
}

keysEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  handleAction(button.dataset.action, button.dataset.value);
});

document.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    pressFeedback(`button[data-action="digit"][data-value="${key}"]`);
    return handleAction("digit", key);
  }

  if (key === ".") {
    pressFeedback("button[data-action='decimal']");
    return handleAction("decimal");
  }

  if (["+", "-", "*", "/"].includes(key)) {
    pressFeedback(`button[data-action="operator"][data-value="${key}"]`);
    return handleAction("operator", key);
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    pressFeedback("button[data-action='equals']");
    return handleAction("equals");
  }

  if (key === "Backspace") {
    pressFeedback("button[data-action='delete']");
    return handleAction("delete");
  }

  if (key === "Escape") {
    pressFeedback("button[data-action='clear']");
    return handleAction("clear");
  }

  if (key === "%") {
    pressFeedback("button[data-action='percent']");
    return handleAction("percent");
  }
});

function pressFeedback(selector) {
  const button = document.querySelector(selector);
  if (!button) return;
  button.classList.add("is-pressed");
  setTimeout(() => button.classList.remove("is-pressed"), 90);
}

function startMatrixRain() {
  const canvas = document.getElementById("matrix-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const chars = "0123456789";
  const fontSize = 16;
  let columns = 0;
  let drops = [];

  function setup() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.ceil(width / fontSize);
    drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -40));

    ctx.font = `${fontSize}px DM Mono, monospace`;
    ctx.textBaseline = "top";
  }

  function draw() {
    ctx.fillStyle = "rgba(2, 7, 13, 0.14)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < drops.length; i += 1) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillStyle = Math.random() > 0.93 ? "#cbffe6" : "#53f09f";
      ctx.fillText(char, x, y);

      const resetPoint = Math.ceil(window.innerHeight / fontSize);
      if (drops[i] > resetPoint && Math.random() > 0.975) {
        drops[i] = Math.floor(Math.random() * -25);
      } else {
        drops[i] += 1;
      }
    }

    requestAnimationFrame(draw);
  }

  setup();
  draw();
  window.addEventListener("resize", setup);
}

updateUI();
startMatrixRain();