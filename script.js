buttons = document.getElementsByTagName('input')
display = document.getElementById('display')
let approvedInput = ['Backspace', 'Enter','ArrowUp','ArrowDown','ArrowLeft','ArrowRight']
let statement = ''
let history = []
let memory = 0

const addEventListener = () => {
    for (const button of buttons) {
        if (button === buttons[0]) {
            button.addEventListener('input', e => {
                if (!approvedInput.includes(e.data)) {
                    display.blur()
                    statement = display.value
                    statement = String(statement).replace(e.data,'')
                    display.value = statement
                }
            })
        } else {
            approvedInput.push(button.value)
            button.addEventListener('click', () => {
                operate(button.value)
            })
        }
    }
    document.addEventListener('keydown', e => {
        if (approvedInput.includes(e.key) && document.activeElement != display) {operate(e.key)}
    })
}

const constructExpression = value => {
    value === '^' ? value = '**' : value === '%' ? value = '*0.01' : null
    if (operators.includes(statement[statement.length-1]) && operators.includes(value)) {
        statement = statement.replace(statement[statement.length-1],value)
    } else {statement += value} 
}

const constructMemory = value => {
    if (value === 'M+') {memory += Number(eval(statement))} 
    if (value === 'M-') {memory -= Number(eval(statement))}
    if (value === 'MC') {memory = 0}
    if (value === 'MR') {statement = memory}
}

const navigateHistory = value => {
    if (value === 'ArrowUp' || value === '⬆' && historyIndex != 0) {
        historyIndex--
        statement = history[historyIndex]
    } else if (historyIndex != history.length-1) {
        historyIndex++
        statement = history[historyIndex]
    }
}

const evaluate = () => {
    if (statement.includes('/0')) {
        statement = 'ERROR: DIVIDED BY 0'
    } else try{
        history.push(statement)
        historyIndex = history.length-1
        statement = eval(statement)
    } catch(err) {
        statement = 'ERROR: INVALID SYNTAX'
    }
}

const operators = ['+','-','/','*','**','*0.01']
const enter = ['Enter', '=']
const M = ['M+','M-','MC','MR']
const undo = ['Backspace', '⬅']
const navigate = ['ArrowLeft','ArrowRight']
const historyLog = ['ArrowUp','ArrowDown','⬆','⬇']
const scenarios = [enter,M,undo,navigate,historyLog,'C']

const operate = value => {
    let scenario
    for (const i in scenarios) {
        if (scenarios[i].includes(value)) {scenario = scenarios.indexOf(scenarios[i])}
    }
    switch (scenario) {
        case 0:
            evaluate(value)
            break;
        case 1:
            constructMemory(value)
            break;
        case 2:
            statement = String(statement).substring(0,String(statement).length-1)
            break;
        case 3:
            display.focus();
            break;
        case 4:
            navigateHistory(value);
            break;
        case 5:
            statement = ''
            break;
        default:
            constructExpression(value)
    }
    display.value = statement
}
addEventListener()