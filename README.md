# Codecov Example Demo

## Introduction
This repository is meant to be used as an example repository for Codecov. It runs as a server-side calculator, meaning that all arithmetic functions are done by a server.

## How to run
To run the project, you will need to fork the repository. Then, you will need to run the frontend and api servers in two terminals.

In the first terminal, run
```
cd api && pip install -r requirements.txt
python app.py
```

In the second, run
```
cd web && npm install
node server.js
```

Note that you will need a machine running `python` and `node`. You can then access the demo at `http://localhost:3000`.

## Using the repository as a Codecov tutorial
The project is set up to show off multiple features of Codecov, including merging reports, status checks, and flags. It is meant for you to fork and see Codecov working for yourself.

### Acknowledgements
A significant portion of the `web/` folder derives from [this repository](https://github.com/Nomzy-kush/CalculatorJS-Section).


## Introduction

Let’s learn by example.

This tutorial will walk you through the basic concepts and features of Codecov. We will do so by building out a server-side calculator, the calculator calls an API to process any calculations and returns back the computed result.

The tutorial is built using `python3` ([`Flask`](https://flask.palletsprojects.com/en/2.0.x/)) on the backend and `javascript` ([`Expressjs`](https://expressjs.com/)) on the frontend. We will be using `GitHub Actions` as the CI/CD, and [`GitHub`](https://github.com) as the code host. Future iterations will include other languages, CI/CDs, and code hosts. We will assume some familiarity with code coverage as well as an existing GitHub account.

All code can be found on our [demo repository](https://github.com/codecov/codecov-demo). You can also follow along with each step below with the corresponding [tag](https://github.com/codecov/codecov-demo/tags).

## Step 0: Setting up the demo repository

To start, let’s set up the demo repository.

1. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo#forking-a-repository) the [demo repository](https://github.com/codecov/codecov-demo) from GitHub. It is strongly recommended that you fork the repository to your personal GitHub account.
2. [Clone](https://docs.github.com/en/get-started/quickstart/fork-a-repo#cloning-your-forked-repository) your new repository to your local machine.
3. After you have cloned the repository, `cd` into it by running
```
cd codecov-demo
```
4. Checkout the `step0` tag by running
```
git checkout step0 -b step1
```
Note that we are creating a branch `step1` to start writing code.
5. `pip` install `flask` and `pytest-cov` by running
```
pip install flask
pip install pytest-cov
```
Note that it is recommended that this is done in a [virtual environment](https://docs.python.org/3/library/venv.html).
6. Save down these dependencies by running
```
pip freeze --local > api/requirements.txt
```

Your repository should now look like this.
```
example-demo/
|-- .gitignore
|-- api/
       |-- __init__.py
       |-- requirements.txt
```

## Step 1: Setting and getting code coverage

Let's continue by adding in our calculator logic. Create the file `api/calculator.py` with the following contents:

```python
class Calculator:
    def add(x, y):
        return x + y

    def subtract(x, y):
        return x - y

    def multiply(x, y):
        return x * y

    def divide(x, y):
        if y == 0:
            return 'Cannot divide by 0'
        return x * 1.0 / y
```
We are defining a `Calculator` class that can `add`, `subtract`, `multiply`, and `divide`.

Next, we are going to create a simple Flask server to run our calculator code. Create a file `app.py`
```
from flask import (
    Flask,
    request,
)

from calculator import Calculator

app = Flask(__name__)

@app.route('/api/add', methods=['POST'])
def add():
    return operation('add', 2)

@app.route('/api/subtract', methods=['POST'])
def subtract():
    return operation('subtract', 2)

@app.route('/api/multiply', methods=['POST'])
def multiply():
    return operation('multiply', 2)

@app.route('/api/divide', methods=['POST'])
def divide():
    return operation('divide', 2)

def operation(method, num_factors):
    factors = []
    if num_factors == 2:
        factors.append(float(request.json.get('x')))
        factors.append(float(request.json.get('y')))

    return str(getattr(Calculator, method)(*factors))


app.run(host='0.0.0.0', port=8080)
```
The server accepts `POST` requests to the `/api/add`, `/api/subtract`, `/api/multiply`, and `/api/divide` endpoints. It expects to receive `JSON` values `x` and `y` as data.

You can start the server by running
```
python api/app.py
```
in a terminal from the `root` directory. You can test if the server is running by hitting one of the above endpoints. Try it by running the command below.

```
> curl -d '{"x": 1, "y": 2}' -H 'Content-Type: application/json' http://localhost:8080/api/add
3.0
```

You can see that the server is adding `1` and `2` together and returning `3.0`.

Let's add some tests for our calculator. Create a new directory `tests` and add a blank `__init__.py` file and a `test_calculator.py` file with the contents
```
from ..calculator import Calculator


def test_add():
    assert Calculator.add(1, 2) == 3.0
    assert Calculator.add(1.0, 2.0) == 3.0
    assert Calculator.add(0, 2.0) == 2.0
    assert Calculator.add(2.0, 0) == 2.0
    assert Calculator.add(-4, 2.0) == -2.0

def test_subtract():
    assert Calculator.subtract(1, 2) == -1.0
    assert Calculator.subtract(2, 1) == 1.0
    assert Calculator.subtract(1.0, 2.0) == -1.0
    assert Calculator.subtract(0, 2.0) == -2.0
    assert Calculator.subtract(2.0, 0.0) == 2.0
    assert Calculator.subtract(-4, 2.0) == -6.0

def test_multiply():
    assert Calculator.multiply(1, 2) == 2.0
    assert Calculator.multiply(1.0, 2.0) == 2.0
    assert Calculator.multiply(0, 2.0) == 0.0
    assert Calculator.multiply(2.0, 0.0) == 0.0
    assert Calculator.multiply(-4, 2.0) == -8.0

def test_divide():
    assert Calculator.divide(1, 2) == 0.5
    assert Calculator.divide(1.0, 2.0) == 0.5
    assert Calculator.divide(0, 2.0) == 0
    assert Calculator.divide(-4, 2.0) == -2.0
```

To run our tests, enter
```
pytest
```

into a terminal. However, we are more curious about the code coverage of our `calculator` class. We can use the command

```
pytest --cov api/
```

to show us coverage results. Doing this should give you a report that looks like

```
Name                           Stmts   Miss  Cover
--------------------------------------------------
api/__init__.py                    0      0   100%
api/app.py                        22     22     0%
api/calculator.py                 11      1    91%
api/tests/__init__.py              0      0   100%
api/tests/test_calculator.py      25      0   100%
--------------------------------------------------
TOTAL                             58     23    60%
```

Notice that `api/app.py` isn’t covered, as we haven’t tested the Flask application, but our `api/calculatory.py` file is missing tests on one line of code.

You can commit this code to the repository by running

```
git add .
git commit -m 'step1: add calculator backend and tests'
git push origin step1
```
Create a pull request on GitHub and merge the changes.

## Step 2: Getting a Codecov account and uploading coverage

Before we continue, let’s create an account and set up our repository on [Codecov](https://codecov.io).

Create an account on Codecov by clicking on our [signup page](https://about.codecov.io/sign-up/).
(optional) If you forked the demo repository to an organization, you may need to request access from an admin to authorize Codecov as a third-party application. An admin can approve this request in the "Third-party access" tab in the organization's settings page:
```
https://github.com/organizations/[YOUR_ORG_NAME]/settings/oauth_application_policy.
```
For more information see [GitHub OAuth Application Authorization](https://docs.codecov.com/docs/github-oauth-application-authorization).
Install the Codecov [GitHub app integration](https://github.com/apps/codecov) for the demo repository.


Now that we have set up our Codecov account, let’s upload coverage reports.

If you are still on the `step1` branch, pull the latest from `main` and create a new branch `step2`
```
git checkout main
git pull
git checkout -b 'step2'
```

Create a new file `.github/workflows/api.yml`
```
name: API workflow

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    name: Test python API
    defaults:
      run:
        working-directory: ./api
    steps:
    - uses: actions/checkout@v1
    - uses: actions/setup-python@v2
      with:
        python-version: '3.10'
    - name: Install requirements
      run: pip install -r requirements.txt
    - name: Run tests and collect coverage
      run: pytest --cov --cov-report xml .
    - name: Upload coverage reports to Codecov with GitHub Action
      uses: codecov/codecov-action@v2
```
This GitHub Actions workflow will checkout the code, install requirements, run tests, and upload the coverage reports to Codecov. Two things to note
The coverage report format is `xml`. Codecov requires that to properly parse the report.
The upload step uses the [Codecov GitHub action](https://github.com/codecov/codecov-action). It is built on top of our [universal uploader](https://github.com/codecov/uploader). It is recommended to use the `action` as it automatically runs [integrity checks](https://docs.codecov.com/docs/codecov-uploader#integrity-checking-the-uploader) on the binary.

Let’s commit our code and open a pull request. Run
```
git add .
git commit -m ‘step2: upload coverage reports to Codecov’
git push origin step2
```
Next, go to the demo repository on GitHub and open a pull request (PR).
**When opening pull requests, be sure to select your own repository as the base branch.**



You will see status checks on the PR from GitHub Actions. You can click on them to see the progress of the CI/CD. Once complete, you will receive status checks and a comment from Codecov.


`codecov/patch` and `codecov/project` status checks



If you go to the project on Codecov, you will notice that the dashboard is blank. This is because no coverage information has been uploaded onto the default branch. To fix this, merge the pull request on GitHub and wait for the CI/CD to complete.

## Step 3: Customizing Codecov

One of Codecov’s core uses is getting code coverage information directly in a developer’s workflow. The status checks shown above are part of that. The `project` check is used to maintain a coverage percentage across an entire codebase, while the `patch` check is used for code changed in a PR. A more mature repository may have strict a `project` percentage, while a project new to code coverage may only expect new code to be well-tested (`patch` coverage). We will be setting some of these values in this section, but you can read more about status checks [here](https://docs.codecov.com/docs/commit-status).

Now that we have coverage on our `main` branch, let’s see how to improve our coverage. Go back to [Codecov](https://app.codecov.io/gh) and click your demo repository. If you are not seeing any coverage information, click `settings` on the top right and ensure your default branch is `main`.

Back on the dashboard, you will see some data relating to our recent commit. On the top is the coverage chart which will show you coverage change over time. Below that is a sunburst graph that highlights parts of the codebase that have low coverage. To the right of that are the most recent commits. However, we will use the bottom section, the fileviewer, to identify lines of code that haven’t been tested.



Click on `api` and `calculator.py` to see what line hasn’t been covered.


Note that we haven’t added a test for dividing by 0.

Before we add the test, let’s ensure that our coverage always hits 100%. Create a new branch `step3`

```
git checkout main
git pull
git checkout -b 'step3'
```

Create a new file `codecov.yml` in the `root` directory

```
coverage:
  status:
    project:
      default:
        target: 100%
        threshold: 1%
```
This configuration tells Codecov to fail a status check if 100% of the codebase is not covered with tests. However, it also allows for a 1% threshold, meaning the true minimum is 99%.

Commit the new file and open a pull request
```
git add .
git commit -m 'step3: add project status check target'
git push origin step3
```
You will notice that after CI finishes, we have a failing status check

Since our project still has an uncovered line, we will need to add a test to cover it before we can merge our code.

At the end of `api/tests/test_calculator.py` add a test for the divide by 0 case
```
def test_divide_by_0():
    assert Calculator.divide(2.0, 0) == 'Cannot divide by 0'
```
to the end of the file.

Let’s commit our code again and see if our project is fully covered.
```
git add .
git commit -m 'step3: cover divide by 0 case'
git push origin step3
```
We now see all of our status checks passing


and the Codecov comment


shows coverage increasing in the `api/calculator.py` as we expect.

Finally, let’s add a Codecov badge to a `README.md` file. You can copy the Markdown code from the `Settings` tab in Codecov, under `Badge`.


Your `README.md` file will look something like
```
[![codecov](https://codecov.io/gh/{{REPOSITORY}}/branch/main/graph/badge.svg)](https://codecov.io/gh/{{REPOSITORY}})
```
As before, commit the changes and merge the pull request
```
git add .
git commit -m 'step3: add Codecov badge'
git push origin step3
```
You should see the badge appear on the repository screen in GitHub


## Step 4: Merging reports and Codecov Flags

Another core feature of Codecov is our processing and merging of coverage reports. That means we take in any number of reports and aggregate them together, so you can see your coverage data in one view. Let’s see what that looks like.

Next, we are going to build out a frontend for our calculator app. We are going to be adding a few files to the `web` directory. You can make it by running
```
mkdir web
```
from the root directory.

`web/index.html`

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Codecov Server-side Calculator App</title>
    <link rel="stylesheet" href="/static/css/calculator.css">
</head>
<body>
    <div class="calculator">
        <div class="output">
            <div data-previous-operand class="previous-operand">123 +</div>
            <div data-current-operand class="current-operand">456</div>
        </div>
        <button class="span-3 disabled"></button>
        <button data-all-clear>C</button>
        <button data-number>7</button>
        <button data-number>8</button>
        <button data-number>9</button>
        <button data-operation>÷</button>
        <button data-number>4</button>
        <button data-number>5</button>
        <button data-number>6</button>
        <button data-operation>*</button>
        <button data-number>1</button>
        <button data-number>2</button>
        <button data-number>3</button>
        <button data-operation>-</button>
        <button data-number>.</button>
        <button data-number>0</button>
        <button data-equals>=</button>
        <button data-operation>+</button>
    </div>
    <script type="module" src="/static/js/calculatorView.js"></script>
</body>
</html>
```

`web/package.json`
```
{
  "name": "web",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "test": "jest --collectCoverage",
    "build": "babel --plugins @babel/plugin-transform-modules-commonjs script.js"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "axios": "^0.25.0",
    "express": "^4.17.2"
  },
  "devDependencies": {
    "@babel/plugin-transform-modules-commonjs": "^7.16.8",
    "jest": "^27.4.7"
  }
}
```

`const axios = require('axios')
const express = require("express");
const path = require("path");

const app = express();

const backendHost = 'http://localhost';
const backendPort = '8080';

app.use(express.json());
app.use("/static", express.static(path.resolve(__dirname, "static")));

app.post("/api/:operation", (req, res) => {
  axios.post(
    backendHost + ':' +  backendPort + '/api/' + req.params['operation'],
    req.body
  ).then(response => {
    res.json(response.data);
  }).catch(error => {
    console.log("Error: " + error);
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});
app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
```

`web/static/css/calculator.css`
```
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #ccc;
}

.calculator {
  align-content: center;
  display: grid;
  grid-template-columns: repeat(4, 100px);
  grid-template-rows: minmax(120px, auto) repeat(5, 100px);
  justify-content: center;
  min-height: 100vh;
}

.calculator > button {
  background-color: rbga(255, 255, 255, 0.75);
  border: 1px solid #FFFFFF;
  cursor: pointer;
  font-size: 32px;
  outline: none;
}

.calculator > button:hover {
  background-color: #aaaaaa;
}

.span-3 {
  grid-column: span 3;
}

.disabled:hover {
  background-color: rbga(255, 255, 255, 0.75);
  cursor: not-allowed;
}

.output{
  align-items: flex-end;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  grid-column: 1 / -1;
  justify-content: space-around;
  padding: 10px;
  word-break: break-all;
  word-wrap: break-word;
}

.output .previous-operand{
  color: rgba(255,255, 255, 0.75);

.output .current-operand{
  color: white;
  font-size: 42px;
}
```

`web/static/js/calculator.js`
```
export class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }

  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
    this.validOperand = true
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  appendNumber(number) {
    if (!this.validOperand) return
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
    if (!this.validOperand) return
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }

  compute() {
    if (!this.validOperand) {
      return;
    }

    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return

    let operation
    switch (this.operation) {
      case '+':
        operation = 'add'
        break
      case '-':
        operation = 'subtract'
        break
      case '*':
        operation = 'multiply'
        break
      case '÷':
        operation = 'divide'
        break
      default:
        return
    }
    this.callApi(operation)
  }

  async callApi(operation) {
    const response = await fetch("/api/" + operation, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        x: this.previousOperand,
        y: this.currentOperand
      })
    })
    if (!response.ok) {
      throw new Error("Error: " + response.status);
    }
    this.currentOperand = await response.json();
    this.operation = undefined;
    this.previousOperand = '';
    this.updateDisplay();
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = stringNumber;
      if (stringNumber.length > 0) {
        this.validOperand = false;
      }
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}
```

`web/static/js/calculatorView.js`
```
import { Calculator } from './calculator.js';

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute()
})

allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})

document.addEventListener('keydown', function (event) {
  let patternForNumbers = /[0-9]/g;
  let patternForOperators = /[+\-*\/]/g
  if (event.key.match(patternForNumbers)) {
    event.preventDefault();
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
  }
  if (event.key === '.') {
    event.preventDefault();
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
  }
  if (event.key.match(patternForOperators)) {
    event.preventDefault();
    calculator.chooseOperation(event.key)
    calculator.updateDisplay()
  }
  if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculator.compute()
  }
});
```



[Add frontend]
[Run frontend]
[Run tests and add coverage]
[Flags]

Step 5: Carryforward Flags

[Add carryforward flags]
[Make a PR]



