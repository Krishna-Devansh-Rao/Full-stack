/* ========================================================
   Calculator Logic
   State model:
   - currentValue: string shown as the big result/number being typed
   - previousValue: number stored before an operator was pressed
   - operator: the pending operator ("+", "−", "×", "÷")
   - expression: the small line showing the full chain (e.g. "12 + 24 × 5")
   - overwrite: true when the next digit press should replace currentValue
======================================================== */

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const calculator = document.getElementById('calculator');
const themeToggle = document.getElementById('themeToggle');

let currentValue = '0';
let previousValue = null;
let operator = null;
let expression = '';
let overwrite = true; // next digit replaces display
let justEvaluated = false; // true right after "=" was pressed

/* --------------------------------------------------------
   Display update
-------------------------------------------------------- */
function updateDisplay() {
  resultEl.textContent = formatForDisplay(currentValue);
  expressionEl.textContent = expression.length ? expression : '\u00A0';

  // small pulse animation on change
  resultEl.classList.remove('pulse');
  // trigger reflow so the animation can replay
  void resultEl.offsetWidth;
  resultEl.classList.add('pulse');
}

// Adds thousands separators without breaking decimal typing
function formatForDisplay(value) {
  if (value === 'Error') return value;

  const isNegative = value.startsWith('-');
  const raw = isNegative ? value.slice(1) : value;

  let [intPart, decPart] = raw.split('.');

  if (intPart === '') intPart = '0';

  // avoid formatting absurdly long integer parts (still works, just safe)
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let out = formattedInt;
  if (decPart !== undefined) out += '.' + decPart;

  return (isNegative ? '-' : '') + out;
}

/* --------------------------------------------------------
   Input handlers
-------------------------------------------------------- */
function inputDigit(digit) {
  if (justEvaluated) {
    // starting a fresh calculation after "="
    currentValue = digit;
    expression = '';
    justEvaluated = false;
    overwrite = false;
    updateDisplay();
    return;
  }

  if (overwrite) {
    currentValue = digit === '.' ? '0.' : digit;
    overwrite = false;
  } else {
    // limit length to keep display sane
    if (currentValue.replace('-', '').replace('.', '').length >= 15) return;
    currentValue += digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (justEvaluated) {
    currentValue = '0.';
    expression = '';
    justEvaluated = false;
    overwrite = false;
    updateDisplay();
    return;
  }

  if (overwrite) {
    currentValue = '0.';
    overwrite = false;
    updateDisplay();
    return;
  }
  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function clearAll() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  expression = '';
  overwrite = true;
  justEvaluated = false;
  updateDisplay();
}

function backspace() {
  if (justEvaluated) {
    clearAll();
    return;
  }
  if (overwrite) return; // nothing to delete from a fresh number

  if (currentValue.length <= 1 || (currentValue.length === 2 && currentValue.startsWith('-'))) {
    currentValue = '0';
    overwrite = true;
  } else {
    currentValue = currentValue.slice(0, -1);
  }
  updateDisplay();
}

function toggleSign() {
  if (currentValue === '0') return;
  currentValue = currentValue.startsWith('-') ? currentValue.slice(1) : '-' + currentValue;
  updateDisplay();
}

function applyPercent() {
  const val = parseFloat(currentValue);
  if (isNaN(val)) return;

  // If there's a pending operator and previous value, percent is relative
  // to the previous value (e.g. 200 + 10% => 10% of 200)
  if (operator && previousValue !== null) {
    const base = parseFloat(previousValue);
    currentValue = trimNumber(base * (val / 100));
  } else {
    currentValue = trimNumber(val / 100);
  }
  overwrite = true;
  updateDisplay();
}

/* --------------------------------------------------------
   Operator handling
-------------------------------------------------------- */
function chooseOperator(op) {
  if (currentValue === 'Error') return;

  // Update active-state glow on operator buttons
  document.querySelectorAll('.btn-operator').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.btn-operator[data-op="${op}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  if (operator !== null && !overwrite) {
    // chain calculation: evaluate what we have so far first
    const result = compute();
    if (result === 'Error') {
      showError();
      return;
    }
    currentValue = trimNumber(result);
    previousValue = currentValue;
    expression = formatForDisplay(currentValue) + ' ' + op;
  } else {
    previousValue = currentValue;
    expression = formatForDisplay(currentValue) + ' ' + op;
  }

  operator = op;
  overwrite = true;
  justEvaluated = false;
  updateDisplay();
}

function compute() {
  const a = parseFloat(previousValue);
  const b = parseFloat(currentValue);
  if (isNaN(a) || isNaN(b)) return 'Error';

  let result;
  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '−':
      result = a - b;
      break;
    case '×':
      result = a * b;
      break;
    case '÷':
      if (b === 0) return 'Error';
      result = a / b;
      break;
    default:
      return b;
  }
  return result;
}

function evaluateEquals() {
  if (operator === null || previousValue === null) return;
  if (currentValue === 'Error') return;

  const fullExpression = formatForDisplay(previousValue) + ' ' + operator + ' ' + formatForDisplay(currentValue);
  const result = compute();

  document.querySelectorAll('.btn-operator').forEach(b => b.classList.remove('active'));

  if (result === 'Error') {
    showError();
    return;
  }

  currentValue = trimNumber(result);
  expression = fullExpression;
  previousValue = null;
  operator = null;
  overwrite = true;
  justEvaluated = true;
  updateDisplay();
}

function showError() {
  currentValue = 'Error';
  previousValue = null;
  operator = null;
  overwrite = true;
  justEvaluated = true;
  updateDisplay();
  // shake feedback
  resultEl.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)' }
    ],
    { duration: 300, easing: 'ease-in-out' }
  );
}

/* Cleans floating point noise and trims trailing zeros */
function trimNumber(num) {
  if (typeof num !== 'number' || !isFinite(num)) return 'Error';
  // round to avoid binary floating point artifacts (e.g. 0.1 + 0.2)
  let rounded = parseFloat(num.toPrecision(12));
  return rounded.toString();
}

/* --------------------------------------------------------
   Button press ripple / scale feedback is handled via CSS,
   but we add a small helper to visually "pulse" any button
   when triggered from the keyboard (since :active won't fire).
-------------------------------------------------------- */
function pulseButton(selector) {
  const btn = document.querySelector(selector);
  if (!btn) return;
  btn.style.transform = 'scale(0.9)';
  setTimeout(() => { btn.style.transform = ''; }, 120);
}

/* --------------------------------------------------------
   Click event delegation
-------------------------------------------------------- */
document.querySelector('.keypad').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  if (btn.dataset.num !== undefined) {
    inputDigit(btn.dataset.num);
    return;
  }

  const action = btn.dataset.action;

  switch (action) {
    case 'clear':
      clearAll();
      break;
    case 'sign':
      toggleSign();
      break;
    case 'percent':
      applyPercent();
      break;
    case 'decimal':
      inputDecimal();
      break;
    case 'backspace':
      backspace();
      break;
    case 'equals':
      evaluateEquals();
      break;
    case 'op':
      chooseOperator(btn.dataset.op);
      break;
  }
});

/* --------------------------------------------------------
   Keyboard support
-------------------------------------------------------- */
window.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key >= '0' && key <= '9') {
    inputDigit(key);
    pulseButton(`.btn-number[data-num="${key}"]`);
    return;
  }

  switch (key) {
    case '.':
      inputDecimal();
      break;
    case '+':
      chooseOperator('+');
      break;
    case '-':
      chooseOperator('−');
      break;
    case '*':
      chooseOperator('×');
      break;
    case '/':
      e.preventDefault();
      chooseOperator('÷');
      break;
    case '%':
      applyPercent();
      break;
    case 'Enter':
    case '=':
      e.preventDefault();
      evaluateEquals();
      pulseButton('.btn-equals');
      break;
    case 'Backspace':
      backspace();
      break;
    case 'Escape':
      clearAll();
      break;
    default:
      return;
  }
});

/* --------------------------------------------------------
   Theme toggle
-------------------------------------------------------- */
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('calc-theme', isLight ? 'light' : 'dark');
});

// Restore saved theme
(function restoreTheme() {
  const saved = localStorage.getItem('calc-theme');
  if (saved === 'light') {
    document.body.classList.add('light');
  }
})();

/* --------------------------------------------------------
   Initial render
-------------------------------------------------------- */
updateDisplay();