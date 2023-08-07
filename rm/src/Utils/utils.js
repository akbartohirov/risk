export const scaleFunction = (number) => {
  const calculated = number > 5 ? 1 / (number - 4) : 6 - number;
  const result = Math.round(calculated * 100) / 100;
  if (result) {
    return result;
  }
};

export const sumFunction = (arr) => {
  return arr.reduce((a, b) => a + b);
};

export const average = (arr) => {
  return arr.reduce((a, b) => a + b) / arr.length;
};
