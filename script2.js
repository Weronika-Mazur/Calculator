const numbers = Array.from(document.querySelectorAll(".number"));
const result = document.querySelector(".currentResult");
const history = document.querySelector(".history");

const cOperator = document.querySelector(".cButton");
const delOperator = document.querySelector(".delButton");

const plusOperator = document.querySelector(".plusButton");
const xOperator = document.querySelector(".xButton");
const divideOperator = document.querySelector(".divideButton");
const moduloOperator = document.querySelector(".moduloButton");
const minusOperator = document.querySelector(".minusButton");
const equalOperator = document.querySelector(".equal");

// [firstValue, operatorSign, secondValue, equalOperator] = this.currentHistory;

const MAX_DIGITS = 20;
const operators = {
  plus: "+",
  minus: "-",
  multiplication: "X",
  division: "/",
  percent: "%",
  equal: "=",
};

class Calculator {
  currentNumber = "0";
  currentHistory = [];

  setResult() {
    result.textContent = this.currentNumber;
  }

  setValue(newValue) {
    this.currentNumber = newValue;
  }

  prepareCurrentNumber(e) {
    const [, , , equalOperator] = this.currentHistory;
    if (equalOperator) {
      this.resetResult();
    }

    if (result.textContent.length > MAX_DIGITS) {
      return;
    }

    const currentSign = e.target.value;
    const hasResultDot = result.textContent.search(/\./) !== -1;
    const isCurrentSignDot = currentSign === ".";

    if (
      (isCurrentSignDot && !hasResultDot) ||
      (!isCurrentSignDot && this.currentNumber !== "0")
    ) {
      this.setValue(this.currentNumber + currentSign);
    }

    if (this.currentNumber === "0") {
      this.setValue(currentSign);
    }

    this.currentHistory[2] = this.currentNumber;
    this.setResult();
  }

  resetResult() {
    this.resetHistory();

    this.currentNumber = "0";
    this.setResult();
  }

  resetHistory() {
    this.currentHistory = [];
    this.setHistory();
  }

  deleteFromResult() {
    const [, , , equalOperator] = this.currentHistory;
    if (equalOperator) {
      this.resetResult();
    }

    this.currentNumber = this.currentNumber.slice(0, -1);

    if (this.currentNumber === "") {
      this.currentNumber = "0";
    }

    this.setResult();
  }

  setHistory() {
    const [firstValue, operatorSign] = this.currentHistory;

    if (firstValue && operatorSign) {
      history.textContent = `${firstValue} ${operatorSign}`;
    } else {
      history.textContent = "";
    }
  }

  addToHistory(e) {
    const selectedtOperator = e.target.value;
    const [, , secondValue, equalOperator] = this.currentHistory;

    const getHistoryWithComputedValue = () => {
      const computedValue = this.computeValue();
      return [computedValue, selectedtOperator, "0"];
    };

    this.currentHistory = equalOperator
      ? [this.currentNumber, selectedtOperator, "0"]
      : getHistoryWithComputedValue();

    this.currentNumber = "0";

    this.setHistory();
  }

  computeValue() {
    const [firstValue, operatorSign, secondValue, equalOperator] =
      this.currentHistory;

    if (!firstValue) {
      return this.currentNumber;
    }

    if (secondValue === "0") {
      return firstValue;
    }

    switch (operatorSign) {
      case operators.plus:
        return parseFloat(firstValue) + parseFloat(secondValue);
      case operators.minus:
        return parseFloat(firstValue) - parseFloat(secondValue);
      case operators.multiplication:
        return parseFloat(firstValue) * parseFloat(secondValue);
      case operators.division:
        return parseFloat(firstValue) / parseFloat(secondValue);
      case operators.percent:
        return parseFloat(firstValue) % parseFloat(secondValue);
    }
  }

  getNewResultFromHistory() {
    const [, operatorSign, , equalOperator] = this.currentHistory;

    if (equalOperator && operatorSign) {
      this.currentHistory[0] = this.currentNumber;
    }

    const [firstValue, , secondValue] = this.currentHistory;
    this.currentNumber = this.computeValue();

    this.currentHistory[3] = operators.equal;
    if (operatorSign) {
      history.textContent = `${firstValue} ${operatorSign} ${secondValue} =`;
    } else {
      this.setHistory();
    }

    this.setResult();
  }

  build() {
    const _this = this;
    numbers.forEach((element) => {
      element.addEventListener("click", function (e) {
        _this.prepareCurrentNumber(e);
      });
    });

    cOperator.addEventListener("click", function (e) {
      _this.resetResult(e);
    });
    delOperator.addEventListener("click", function (e) {
      _this.deleteFromResult(e);
    });

    plusOperator.addEventListener("click", function (e) {
      _this.addToHistory(e);
    });
    xOperator.addEventListener("click", function (e) {
      _this.addToHistory(e);
    });
    divideOperator.addEventListener("click", function (e) {
      _this.addToHistory(e);
    });
    moduloOperator.addEventListener("click", function (e) {
      _this.addToHistory(e);
    });
    minusOperator.addEventListener("click", function (e) {
      _this.addToHistory(e);
    });

    equalOperator.addEventListener("click", function (e) {
      _this.getNewResultFromHistory(e);
    });
  }
}

const calc = new Calculator();
calc.build();
