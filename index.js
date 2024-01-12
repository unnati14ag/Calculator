document.addEventListener("DOMContentLoaded", function () {
    const result = document.getElementById("result");
    const history = document.getElementById("history");
    const historyToggle = document.getElementById("historyToggle");
    const buttons = document.querySelectorAll(".buttons button");

    let currentInput = "";
    let calculationHistory = "";
    let previousResult = null;
    let lastButtonClicked = null;

    buttons.forEach((button) => {
        button.addEventListener("click", handleButtonClick);
    });

    historyToggle.addEventListener("click", toggleHistory);

    function toggleHistory() {
        history.style.display = (history.style.display === "none") ? "block" : "none";
    }

    function handleButtonClick(event) {
        const buttonValue = event.target.textContent;

        if (buttonValue === "=") {
            calculateResult();
        } else if (buttonValue === "C") {
            clearInput();
        } else if (buttonValue === "←") {
            deleteLastCharacter();
        } else if (isOperator(buttonValue)) {
            handleOperatorClick(buttonValue);
        } else {
            appendToInput(buttonValue);
        }

        lastButtonClicked = buttonValue;
    }

    function calculateResult() {
        try {
            const expression = (previousResult !== null) ? `${previousResult}${currentInput}` : currentInput;
            const resultValue = eval(expression);
            const roundedResult = parseFloat(resultValue.toFixed(10)); // Round to 10 decimal places
            result.value = roundedResult;
    
            if (previousResult !== null) {
                addToHistory(`${expression} = ${roundedResult}`);
            }
    
            previousResult = roundedResult;
            currentInput = ""; // Clear current input after calculation
        } catch (error) {
            result.value = "Error";
            addToHistory(`Error: ${currentInput}`);
            currentInput = "";
        }
    }
    

    function handleOperatorClick(operator) {
        if (previousResult !== null && currentInput !== "") {
            if (!isOperator(lastButtonClicked) && lastButtonClicked !== "=") {
                // Allow continuing operations on the result of the previous operation
                calculateResult();
                appendToInput(operator);
            } else {
                // If an operator is repeated immediately after another operator, update the current input
                currentInput = currentInput.slice(0, -1) + operator;
                result.value = currentInput;
            }
        } else if (currentInput !== "") {
            // If current input is not empty, calculate the result before appending the operator
            calculateResult();
            appendToInput(operator);
        } else {
            // If there is no previous result and current input is empty, append the operator
            appendToInput(operator);
        }
    }

    function clearInput() {
        currentInput = "";
        result.value = "";
        previousResult = null; // Reset previous result to start fresh calculations
    }

    function deleteLastCharacter() {
        currentInput = currentInput.slice(0, -1);
        result.value = currentInput;

        if (currentInput === "") {
            previousResult = null; // Reset previous result to start fresh calculations
        }
    }

    function appendToInput(value) {
        currentInput += value;
        result.value = currentInput;
    }

    function addToHistory(entry) {
        calculationHistory += `${entry}<br>`;
        history.innerHTML = calculationHistory;
    }

    function isOperator(value) {
        return ['+', '-', '*', '/'].includes(value);
    }
});
