const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = document.querySelector('.calculator-screen');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false; // Flag to check if we're waiting for the second operand

keys.addEventListener('click', e => {
    const target = e.target;
    if (!target.matches('button')) {
        return; // Exit if not a button
    }

    const value = target.value;

    // Handle number inputs
    if (!isNaN(value)) { // Check if the value is a number
        if (waitingForSecondValue === true) {
            display.value = value;
            waitingForSecondValue = false;
        } else {
            // If display is '0' or empty, replace it. Otherwise, append.
            display.value = display.value === '0' ? value : display.value + value;
        }
    }

    // Handle decimal point
    if (target.classList.contains('decimal')) {
        if (!display.value.includes('.')) {
            display.value += '.';
        }
    }

    // Handle operators
    if (target.classList.contains('operator')) {
        if (firstValue === null) {
            firstValue = parseFloat(display.value);
        } else if (operator) {
            // If an operator was already pressed, calculate the result first
            const result = calculate(firstValue, parseFloat(display.value), operator);
            display.value = String(result);
            firstValue = result; // Set result as the new first value for chaining operations
        }
        operator = value; // Store the new operator
        waitingForSecondValue = true; // Set flag to indicate waiting for next number
    }

    // Handle equals sign
    if (target.classList.contains('equal-sign')) {
        if (firstValue === null || operator === null) {
            return; // Don't do anything if not enough info
        }
        const secondValue = parseFloat(display.value);
        const result = calculate(firstValue, secondValue, operator);
        display.value = String(result);

        // Reset for new calculations
        firstValue = null;
        operator = null;
        waitingForSecondValue = false;
    }

    // Handle clear button
    if (target.classList.contains('all-clear')) {
        firstValue = null;
        operator = null;
        waitingForSecondValue = false;
        display.value = '0';
    }
});


// Calculation function
function calculate(num1, num2, op) {
    if (op === '+') return num1 + num2;
    if (op === '-') return num1 - num2;
    if (op === '*') return num1 * num2;
    if (op === '/') {
        if (num2 === 0) {
            return 'Error'; // Handle division by zero
        }
        return num1 / num2;
    }
    return num2; // Fallback for initial state or if no operator set
}
