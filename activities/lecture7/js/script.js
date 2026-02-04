// ===== BASIC CALCULATION FUNCTIONS =====

function performCalculation(operation) {
    // get the two input values
    let num1 = parseFloat(document.getElementById('number1').value);
    let num2 = parseFloat(document.getElementById('number2').value);
    let result;

    // check if inputs are valid numbers
    if (isNaN(num1) || isNaN(num2)) {
        alert('Please enter valid numbers');
        return;
    }

    // perform the selected operation
    switch(operation) {
        case 'add':
            result = num1 + num2;
            break;
        case 'subtract':
            result = num1 - num2;
            break;
        case 'multiply':
            result = num1 * num2;
            break;
        case 'divide':
            if (num2 === 0) {
                alert('Cannot divide by zero');
                return;
            }
            result = num1 / num2;
            break;
    }

    // display the result
    document.getElementById('result').innerHTML = `<strong>Result: ${result}</strong>`;
}

// ===== ARRAY FUNCTIONS =====

function evenOddArray(arr) {
    // check if the total number of items in array is even or odd
    return arr.length % 2 === 0 ? 'even' : 'odd';
}

function evenOddArrayItems(arr) {
    // check if each item in the array is even or odd
    return arr.map(num => num % 2 === 0 ? 'even' : 'odd').join(', ');
}

function checkArrayEvenOdd() {
    // get the array input from user
    let input = document.getElementById('numberArray').value;
    
    // convert the comma-separated string into an array of numbers
    let numberArray = input.split(',').map(num => parseFloat(num.trim()));

    // validate array
    if (numberArray.length === 0 || numberArray.some(isNaN)) {
        alert('Please enter valid numbers separated by commas');
        return;
    }

    // get results from both functions
    let arrayCountResult = evenOddArray(numberArray);
    let arrayItemsResult = evenOddArrayItems(numberArray);

    // display the results
    document.getElementById('arrayResult').innerHTML = 
        `<strong>Array:</strong> [${numberArray}]<br>
         <strong>Total items are:</strong> ${arrayCountResult}<br>
         <strong>Each item is:</strong> ${arrayItemsResult}`;
}