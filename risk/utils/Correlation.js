function calculateCorrelation(obj) {
  const keys = Object.keys(obj);
  const values = Object.values(obj);
  const n = keys.length;

  const correlations = {};

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const variable1 = keys[i];
      const variable2 = keys[j];

      // Calculate the means
      const meanX = values[i];
      const meanY = values[j];

      // Calculate the variances and covariance
      let varianceX = 0;
      let varianceY = 0;
      let covariance = 0;

      for (let k = 0; k < n; k++) {
        const diffX = obj[keys[k]] - meanX;
        const diffY = obj[keys[k]] - meanY;
        varianceX += Math.pow(diffX, 2);
        varianceY += Math.pow(diffY, 2);
        covariance += diffX * diffY;
      }

      varianceX /= n - 1;
      varianceY /= n - 1;
      covariance /= n - 1;

      // Calculate the correlation coefficient
      const correlation = covariance / Math.sqrt(varianceX * varianceY);

      // Store the correlation coefficient
      const correlationKey = `${variable1} to ${variable2}`;
      correlations[correlationKey] = correlation;
    }
  }

  return correlations;
}

const obj = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 };
const correlations = calculateCorrelation(obj);
console.log(correlations);
