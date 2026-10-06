/* ========================================
   GET HTML ELEMENTS
======================================== */

const expressionDisplay = document.querySelector(".expression");
const resultDisplay = document.querySelector(".result");

const buttons = document.querySelectorAll(".button");


/* ========================================
   CALCULATOR STATE
======================================== */

let currentValue = "0";
let previousValue = null;
let currentOperator = null;
let shouldResetDisplay = false;


/* ========================================
   UPDATE DISPLAY
======================================== */

function updateDisplay() {
    resultDisplay.textContent = currentValue;

    if (previousValue !== null && currentOperator !== null) {
        expressionDisplay.textContent =
            `${previousValue} ${currentOperator}`;
    } else {
        expressionDisplay.textContent = "";
    }
}


/* ========================================
   NUMBER INPUT
======================================== */

function inputNumber(number) {

    if (currentValue === "Error") {
        currentValue = number;
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    if (shouldResetDisplay) {
        currentValue = number;
        shouldResetDisplay = false;
    } else if (currentValue === "0") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}


/* ========================================
   DECIMAL
======================================== */

function inputDecimal() {

    if (currentValue === "Error") {
        currentValue = "0.";
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    if (shouldResetDisplay) {
        currentValue = "0.";
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}


/* ========================================
   CLEAR
======================================== */

function clearCalculator() {

    currentValue = "0";
    previousValue = null;
    currentOperator = null;
    shouldResetDisplay = false;

    updateDisplay();
}


/* ========================================
   PLUS / MINUS
======================================== */

function toggleSign() {

    if (currentValue === "0" || currentValue === "Error") {
        return;
    }

    if (currentValue.startsWith("-")) {
        currentValue = currentValue.slice(1);
    } else {
        currentValue = "-" + currentValue;
    }

    updateDisplay();
}


/* ========================================
   PERCENTAGE
======================================== */

function calculatePercentage() {

    if (currentValue === "Error") {
        return;
    }

    const number = parseFloat(currentValue);

    currentValue = String(number / 100);

    updateDisplay();
}


/* ========================================
   SELECT OPERATOR
======================================== */

function chooseOperator(operator) {

    if (currentValue === "Error") {
        return;
    }

    if (currentOperator !== null && !shouldResetDisplay) {
        calculateResult();
    }

    previousValue = parseFloat(currentValue);
    currentOperator = operator;

    shouldResetDisplay = true;

    updateDisplay();
}


/* ========================================
   CALCULATE
======================================== */

function calculateResult() {

    if (
        previousValue === null ||
        currentOperator === null
    ) {
        return;
    }

    const currentNumber = parseFloat(currentValue);

    let result;


    switch (currentOperator) {

        case "+":
            result = previousValue + currentNumber;
            break;

        case "-":
            result = previousValue - currentNumber;
            break;

        case "×":
            result = previousValue * currentNumber;
            break;

        case "÷":

            if (currentNumber === 0) {
                currentValue = "Error";
                previousValue = null;
                currentOperator = null;
                shouldResetDisplay = true;

                updateDisplay();

                return;
            }

            result = previousValue / currentNumber;
            break;

        default:
            return;
    }


    currentValue = formatResult(result);

    previousValue = null;
    currentOperator = null;

    shouldResetDisplay = true;

    updateDisplay();
}


/* ========================================
   FORMAT RESULT
======================================== */

function formatResult(number) {

    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(
        parseFloat(number.toFixed(10))
    );
}


/* ========================================
   BUTTON CLICK HANDLER
======================================== */

buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        const value = button.textContent.trim();


        /* Numbers */

        if (
            value >= "0" &&
            value <= "9"
        ) {
            inputNumber(value);
            return;
        }


        /* Decimal */

        if (value === ".") {
            inputDecimal();
            return;
        }


        /* Clear */

        if (value === "AC") {
            clearCalculator();
            return;
        }


        /* Plus / Minus */

        if (value === "±") {
            toggleSign();
            return;
        }


        /* Percentage */

        if (value === "%") {
            calculatePercentage();
            return;
        }


        /* Operators */

        if (
            value === "+" ||
            value === "−" ||
            value === "×" ||
            value === "÷"
        ) {

            let operator = value;

            if (operator === "−") {
                operator = "-";
            }

            chooseOperator(operator);
            return;
        }


        /* Equals */

        if (value === "=") {
            calculateResult();
        }

    });

});


/* ========================================
   KEYBOARD SUPPORT
======================================== */

document.addEventListener("keydown", function(event) {

    const key = event.key;


    /* Numbers */

    if (key >= "0" && key <= "9") {
        inputNumber(key);
        return;
    }


    /* Decimal */

    if (key === ".") {
        inputDecimal();
        return;
    }


    /* Operators */

    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        let operator = key;

        if (key === "*") {
            operator = "×";
        }

        if (key === "/") {
            operator = "÷";
        }

        chooseOperator(operator);

        return;
    }


    /* Enter / Equal */

    if (
        key === "Enter" ||
        key === "="
    ) {
        calculateResult();
        return;
    }


    /* Escape / Clear */

    if (key === "Escape") {
        clearCalculator();
        return;
    }


    /* Backspace */

    if (key === "Backspace") {

        if (
            currentValue.length > 1 &&
            currentValue !== "Error"
        ) {
            currentValue =
                currentValue.slice(0, -1);
        } else {
            currentValue = "0";
        }

        updateDisplay();

        return;
    }


    /* Percentage */

    if (key === "%") {
        calculatePercentage();
    }

});


/* ========================================
   INITIAL DISPLAY
======================================== */

updateDisplay();