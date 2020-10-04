class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.currentOperand = ``;
    this.previousOperand = ``;
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === `.` && this.currentOperand.includes(`.`)) {
      return;
    }
    if (number === `.` && this.currentOperand.length === 0) {
      this.currentOperand = `0` + number.toString();
      return;
    }
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === ``) {
      return;
    }

    if (operation === `√`) {
      if (this.currentOperand < 0) {
        this._giveError(`negative`);
        return;
      }
      this.operation = `^`;
      this.previousOperand = this.currentOperand;
      this.currentOperand = 0.5;
      this.compute();
      this.updateDisplay();
      return;
    }

    if (operation === `±`) {
      this.currentOperand = -1 * this.currentOperand;
      return;
    }

    if (this.previousOperand !== ``) {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = ``;
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) {
      return;
    }
    switch (this.operation) {
      case `+`:
        computation = prev + current;
        break;
      case `-`:
        computation = prev - current;
        break;
      case `*`:
        computation = prev * current;
        break;
      case `÷`:
        if (current === 0) {
          this._giveError(`divisionByZero`)
          return;
        }
        computation = prev / current;
        break;
      case `^`:
        computation = prev ** current;
        break;
      default:
        return;
    }
    this.readyToReset = true;
    this.currentOperand = this._rounding(computation);
    this.operation = undefined;
    this.previousOperand = ``;
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(`.`)[0]);
    const decimalDigits = stringNumber.split(`.`)[1];
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = ``;
    } else {
      integerDisplay = integerDigits.toLocaleString(`en`, {maximumFractionDigits: 0});
    }
    if (decimalDigits !== undefined) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = ``;
    }
  }

  _giveError(typeError) {
    this.clear();
    switch (typeError) {
      case `divisionByZero`:
        alert(`You cannot divide by zero`);
        break;
      case `negative`:
        alert(`Can't square root a negative number`);
        break;
      default:
        alert(`Something went wrong`);
        return;
    }
  }

  _rounding(num) {
    const accuracy = 10000
    return Math.round(num * accuracy)/accuracy
  }
}

const numberButtons = document.querySelectorAll(`[data-number]`);
const operationButtons = document.querySelectorAll(`[data-operation]`);
const equalsButton = document.querySelector(`[data-equals]`);
const deleteButton = document.querySelector(`[data-delete]`);
const allClearButton = document.querySelector(`[data-all-clear]`);
const previousOperandTextElement = document.querySelector(`[data-previous-operand]`);
const currentOperandTextElement = document.querySelector(`[data-current-operand]`);

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach((button) => {
  button.addEventListener(`click`, () => {
    if (calculator.previousOperand === `` &&
      calculator.currentOperand !== `` &&
      calculator.readyToReset) {
      calculator.currentOperand = ``;
      calculator.readyToReset = false;
    }
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener(`click`, () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener(`click`, () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener(`click`, () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener(`click`, () => {
  calculator.delete();
  calculator.updateDisplay();
});
