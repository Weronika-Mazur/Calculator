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

const MAX_DIGITS = 20;

const currentResult = (function () {
  let value = "0";
  return {
    getValue: function () {
      return value;
    },
    setValue: function (newValue) {
      value = newValue;
    },
    setResult: function () {
      result.textContent = value;
    },
  };
})();

const currentHistory = (function () {
  let value = "0";
  let secondValue = "";
  let operator = "";
  return {
    getValue: function () {
      return value;
    },
    setValue: function (newValue) {
      value = newValue;
    },
    setHistory: function () {
      history.textContent = value + " " + operator;
    },
    setOperator: function (newOperator) {
      operator = newOperator;
    },
    getOperator: function () {
      return operator;
    },
    getSecondValue: function () {
      return secondValue;
    },
    setSecondValue: function (newValue) {
      secondValue = newValue;
    },
  };
})();

function computeValue(operatorSign) {
  let sum = 0;

  switch (operatorSign) {
    case "+":
      sum =
        parseFloat(currentHistory.getValue()) +
        parseFloat(currentResult.getValue());
      break;
    case "-":
      sum =
        parseFloat(currentHistory.getValue()) -
        parseFloat(currentResult.getValue());
      break;
    case "X":
      sum =
        parseFloat(currentHistory.getValue()) *
        parseFloat(currentResult.getValue());
      break;
    case "/":
      sum =
        parseFloat(currentHistory.getValue()) /
        parseFloat(currentResult.getValue());
      break;
    case "%":
      sum =
        parseFloat(currentHistory.getValue()) %
        parseFloat(currentResult.getValue());
      break;
  }
  return sum;
}

function addToResult(e) {
  if (currentResult.getValue() === "0") {
    if (e.target.value === ".") {
      currentResult.setValue(currentResult.getValue() + e.target.value);
    } else {
      currentResult.setValue(e.target.value);
    }
  } else if (result.textContent.length < MAX_DIGITS) {
    if (e.target.value === ".") {
      if (result.textContent.search(/\./) === -1) {
        currentResult.setValue(currentResult.getValue() + e.target.value);
      }
    } else {
      currentResult.setValue(currentResult.getValue() + e.target.value);
    }
  }
  currentResult.setResult();
}

function resetHistory() {
  currentHistory.setValue("0");
  currentHistory.setOperator("");
  currentHistory.setSecondValue("");
  currentHistory.setHistory();

  history.classList.add("hidden");

  numbers.forEach((element) => {
    element.removeEventListener("click", resetHistory);
  });
  delOperator.removeEventListener("click", resetResult);
}

function resetResult() {
  resetHistory();

  currentResult.setValue("0");
  currentResult.setResult();
}

function deleteFromResult() {
  //usuniecie ostatniej liczby
  if (currentResult.getValue() !== "0") {
    if (result.textContent.length === 1) {
      currentResult.setValue("0");
    } else {
      currentResult.setValue(currentResult.getValue().slice(0, -1));
    }
    currentResult.setResult();
  }
}

function addToHistory(e) {
  history.classList.remove("hidden");

  if (currentHistory.getSecondValue() !== "") {
    // wykonanie operacji wcisniecie enter i wcisniecie operatora
    currentHistory.setValue(result.textContent);
    currentHistory.setSecondValue("");
  } else if (currentHistory.getValue() === "0") {
    currentHistory.setValue(currentResult.getValue());
  } else {
    currentHistory.setValue(computeValue(currentHistory.getOperator()));
  }

  currentHistory.setOperator(e.target.value);

  currentHistory.setHistory();
  currentResult.setValue("0");

  numbers.forEach((element) => {
    element.removeEventListener("click", resetHistory);
  });
  delOperator.removeEventListener("click", resetResult);
}

function getNewResultFromHistory() {
  if (currentHistory.getSecondValue() !== "") {
    //powtorzenie poprzedniej operacji
    currentHistory.setValue(result.textContent);
    currentResult.setValue(currentHistory.getSecondValue());
    currentHistory.setHistory();
  } else {
    currentResult.setValue(result.textContent); //wpisanie liczby klikniecie operatora i klikniecie rowna sie
    currentHistory.setSecondValue(currentResult.getValue());
  }

  if (currentHistory.getOperator() !== "") {
    history.textContent =
      history.textContent + " " + currentResult.getValue() + " =";

    currentResult.setValue(computeValue(currentHistory.getOperator()));
    currentResult.setResult();
  } else {
    //wpisanie liczby i klikniecie rowna sie
    history.classList.remove("hidden");

    history.textContent = currentResult.getValue() + " =";
  }
  currentResult.setValue("0");

  numbers.forEach((element) => {
    element.addEventListener("click", resetHistory);
  });
  delOperator.addEventListener("click", resetResult);
}

numbers.forEach((element) => {
  element.addEventListener("click", addToResult);
});

cOperator.addEventListener("click", resetResult);
delOperator.addEventListener("click", deleteFromResult);

plusOperator.addEventListener("click", addToHistory);
xOperator.addEventListener("click", addToHistory);
divideOperator.addEventListener("click", addToHistory);
moduloOperator.addEventListener("click", addToHistory);
minusOperator.addEventListener("click", addToHistory);

equalOperator.addEventListener("click", getNewResultFromHistory);
