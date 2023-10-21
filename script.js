buttons = document.getElementsByTagName('input'); // adds all input tags into an object
display = document.getElementById('display'); // captures calculator screen
let approvedInput = ['Backspace', 'Enter','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
let statement = ''; // any changes to statement will reflect on the display

// adds event listeners
const addEventListener = () => {
    for (const button of buttons) { // iterates through buttons object
        if (button === buttons[0]) { // special event listener for the 1st one (calc screen)
            button.addEventListener('input', e => { // listens for new input in calc screen
                if (!approvedInput.includes(e.data)) {  // checks if input is approved
                    display.blur(); // unselects calculator screen
                    statement = display.value;
                    statement = String(statement).replace(e.data,''); // deletes unapproved input
                    display.value = statement;
                };
            });
        } else {
            approvedInput.push(button.value); // adds button values to approvedInput
            button.addEventListener('click', () => {
                operate(button.value); // performs certain action when button is clicked
            });
        };
    }; // event listener to the browser for keystrokes that match the buttons
    document.addEventListener('keydown', e => { // 'document.activeElement != display' to avoid inputting twice
        if (approvedInput.includes(e.key) && document.activeElement != display) {operate(e.key)};
    });
}

// adds operands and operators to screen
const operators = ['+','-','/','*','**','*0.01'];
const constructExpression = value => {
    value === '^' ? value = '**' : value === '%' ? value = '*0.01' : null; // switches symbols to operable operators 
    if (operators.includes(statement[statement.length-1]) && operators.includes(value)) {
        statement = statement.replace(statement[statement.length-1],value); // prevents double operators
    } else {statement += value}; // adds numbers/operators to the screen
}

// performs operations in the memory
let memory = 0;
const constructMemory = value => {
    if (value === 'M+') {memory += Number(eval(statement))}; // adds to memory
    if (value === 'M-') {memory -= Number(eval(statement))}; // subtracts from memory
    if (value === 'MC') {memory = 0}; // resets memory
    if (value === 'MR') {statement = memory}; // display memory on screen
}

// goes up or down history log if up or down arrow pressed
let history = [];
const navigateHistory = value => { // goes up or down if not at the ends of the array
    if ((value === 'ArrowUp' || value === '⬆') && historyIndex != 0) {historyIndex--};
    if ((value === 'ArrowDown' || value === '⬇') && historyIndex != history.length-1) {historyIndex++};
    statement = history[historyIndex];
};

// evaluates the current expression
const evaluate = () => {
    if (statement.includes('/0')) { // error if divided by 0
        statement = 'ERROR: DIVIDED BY 0';
    } else try {
        history.push(statement);
        historyIndex = history.length-1;
        statement = eval(statement); // built-in js function, converts strings into actual numbers/operators 
    } catch(err) { // error if unevaluable
        statement = 'ERROR: INVALID SYNTAX';
    }
}

// arrays used to check buttons/keys passed
const enter = ['Enter', '='];
const M = ['M+','M-','MC','MR'];
const undo = ['Backspace', '⬅'];
const navigate = ['ArrowLeft','ArrowRight'];
const historyLog = ['ArrowUp','ArrowDown','⬆','⬇'];
const scenarios = [enter,M,undo,navigate,historyLog,'C'];

// performs a certain action depending on button/key pressed
const operate = value => {
    let scenario;
    for (const i in scenarios) { // finds category where key/button belongs
        if (scenarios[i].includes(value)) {scenario = scenarios.indexOf(scenarios[i])};
    };
    switch (scenario) {
        case 0: // evaluates expression
            evaluate(value);
            break;
        case 1: // constructs memory
            constructMemory(value);
            break;
        case 2: // delete last character
            statement = String(statement).substring(0,String(statement).length-1);
            break;
        case 3: // navigates within expression if left/right arrow key pressed
            display.focus();
            break;
        case 4: // goes up or down history
            navigateHistory(value);
            break;
        case 5: // clears expression when C pressed
            statement = '';
            break;
        default: // adds numbers or operators to screen
            constructExpression(value);
    }
    display.value = statement;
};
addEventListener(); // adds event listeners once page loads