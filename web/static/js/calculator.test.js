const Calculator = require('./calculator');

describe('Calculator test suite', () => {
  test('calculator clears', () => {
    calculator = new Calculator();
    calculator.clear();

    expect(calculator.currentOperand).toBe('');
    expect(calculator.previousOperand).toBe('');
    expect(calculator.operation).toBe(undefined);
    expect(calculator.validOperand).toBe(true);
  })

  test('calculator can input numbers', () => {
    calculator = new Calculator();
    calculator.appendNumber(1);
    expect(calculator.currentOperand).toBe('1');

    calculator.appendNumber(2);
    expect(calculator.currentOperand).toBe('12');
  })

  test('calculator can deletes', () => {
    calculator = new Calculator();
    calculator.appendNumber(1);
    expect(calculator.currentOperand).toBe('1');

    calculator.appendNumber(2);
    expect(calculator.currentOperand).toBe('12');

    calculator.delete();
    expect(calculator.currentOperand).toBe('1');
  })
})
