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
