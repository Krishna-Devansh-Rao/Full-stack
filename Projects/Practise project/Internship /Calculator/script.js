const display = document.getElementById("display");
const history = document.getElementById("history");

let currentNumber = "0";
let firstNumber = null;
let operator = null;
let waitingForNumber = false;


// -------------------- display ------------------

function updateDisplay() {
    display.textContent = formatNumber(currentNumber);
}

function formatNumber(value) {
    if (value === "Error") return "Error";

    if (value.endsWith(".")) {
        return value;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "Error";
    }

    return number.toLocaleString("en-US", {
        maximumFractionDigits: 10
    });
}


// -------------------- NUmber ------------------

function inputNumber(value) {

    if (currentNumber === "Error") {
        clearCalculator();
    }

    if (waitingForNumber) {
        currentNumber = "0";
        waitingForNumber = false;
    }

    if (value === ".") {

        if (currentNumber.includes(".")) {
            return;
        }

        currentNumber += ".";

    } else {

        if (currentNumber === "0") {
            currentNumber = value;
        } else {
            currentNumber += value;
        }
    }

    updateDisplay();
}


// -------------------- Operator ------------------


function chooseOperator(newOperator) {

    const number = Number(currentNumber);

    if (firstNumber === null) {

        firstNumber = number;

    } else if (!waitingForNumber) {

        const result = calculateResult(
            firstNumber,
            number,
            operator
        );

        if (result === "Error") {
            showError();
            return;
        }

        firstNumber = result;
        currentNumber = String(result);
    }

    operator = newOperator;
    waitingForNumber = true;

    history.textContent =
        `${formatNumber(String(firstNumber))} ${newOperator}`;

    updateDisplay();
}

// -------------------- Calculations ------------------

function calculateResult(first, second, operation) {

    if (operation === "+") {
        return first + second;
    }

    if (operation === "-") {
        return first - second;
    }

    if (operation === "×") {
        return first * second;
    }

    if (operation === "÷") {

        if (second === 0) {
            return "Error";
        }

        return first / second;
    }

    return second;
}

// -------------------- Calculation ------------------

function calculate() {

    if (firstNumber === null || operator === null) {
        return;
    }

    const secondNumber = Number(currentNumber);

    let result = calculateResult(
        firstNumber,
        secondNumber,
        operator
    );

    if (result === "Error") {
        showError();
        return;
    }

    result = Number(result.toFixed(10));

    // Show complete calculation above
    history.textContent =
        `${formatNumber(String(firstNumber))} ${operator} ${formatNumber(currentNumber)}`;

    currentNumber = String(result);

    firstNumber = null;
    operator = null;
    waitingForNumber = true;

    updateDisplay();
}

// -------------------- Clear all things in calc ------------------

function clearCalculator() {

    currentNumber = "0";
    firstNumber = null;
    operator = null;
    waitingForNumber = false;
    history.textContent = "";

    updateDisplay();
}

// -------------------- Add and subtract ------------------

function changeSign() {

    if (
        currentNumber === "0" ||
        currentNumber === "Error"
    ) {
        return;
    }

    currentNumber =
        String(Number(currentNumber) * -1);

    updateDisplay();
}


// ------------------ Percentage ------------------

function percentage() {

    if (currentNumber === "Error") {
        return;
    }

    currentNumber =
        String(Number(currentNumber) / 100);

    updateDisplay();
}


// ------------------ Backspace ------------------

function deleteNumber() {

    if (
        waitingForNumber ||
        currentNumber === "Error"
    ) {
        return;
    }

    if (currentNumber.length === 1) {

        currentNumber = "0";

    } else {

        currentNumber =
            currentNumber.slice(0, -1);

        if (currentNumber === "-") {
            currentNumber = "0";
        }
    }

    updateDisplay();
}


// ------------------ Mouse buttons ------------------

document.querySelectorAll(".number").forEach(button => {

    button.addEventListener("click", function () {

        inputNumber(this.textContent.trim());

    });

});


document.querySelectorAll(".operator").forEach(button => {

    button.addEventListener("click", function () {

        if (this.dataset.action === "equals") {
            calculate();
            return;
        }

        chooseOperator(this.dataset.operator);

    });

});


document.querySelectorAll(".action").forEach(button => {

    button.addEventListener("click", function () {

        const action = this.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "sign") {
            changeSign();
        }

        if (action === "percent") {
            percentage();
        }

        if (action === "delete") {
            deleteNumber();
        }

    });

});


// ------------------ Keyboard ------------------

document.addEventListener("keydown", function (event) {

    const key = event.key;

    // 0 - 9
    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
        return;
    }

    // Decimal
    if (key === ".") {
        inputNumber(".");
        return;
    }

    // Addition
    if (key === "+") {
        chooseOperator("+");
        return;
    }

    // Subtraction
    if (key === "-") {
        chooseOperator("-");
        return;
    }

    // Multiplication
    if (key === "*") {
        chooseOperator("×");
        return;
    }

    // Division
    if (key === "/") {
        event.preventDefault();
        chooseOperator("÷");
        return;
    }

    // Equals
    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
        return;
    }

    // Backspace
    if (key === "Backspace") {
        event.preventDefault();
        deleteNumber();
        return;
    }

    // Clear
    if (key === "Escape" || key === "Delete") {
        clearCalculator();
        return;
    }

    // Percentage
    if (key === "%") {
        percentage();
        return;
    }

});


// ------------------ Theme ------------------

document.getElementById("themeBtn").addEventListener("click", function () {

    document.body.classList.toggle("light");

    this.textContent =
        document.body.classList.contains("light")
            ? "☾"
            : "☼";

});


// ------------------ Menu ------------------

document.getElementById("menuBtn").addEventListener("click", function () {

    alert(
        "Calculator Shortcuts\n\n" +
        "0-9  → Numbers\n" +
        "+    → Addition\n" +
        "-    → Subtraction\n" +
        "*    → Multiplication\n" +
        "/    → Division\n" +
        "Enter → Equals\n" +
        "Backspace → Delete\n" +
        "Esc → Clear"
    );

});


// Start
updateDisplay();