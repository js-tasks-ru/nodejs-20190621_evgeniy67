function _isNumber(value) {
  return typeof value === 'number';
}

function sum(a, b) {
  if (!_isNumber(a) || !_isNumber(b)) {
    throw new TypeError('One from arguments don\'t is number');
  }

  return a + b;
}

module.exports = sum;
