let trainingValues;
let biases = [];
let weights = [];
let threshold = 0.5;
for (let i = 0; i < trainingValues.x[0].length; i++) {
    weights.push(1); // initialize to 1 to avoid division by 0
    biases.push(0);
}


const gaussian = (x) => {
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
        sum += Math.pow(x[i] - biases[i], 2) / (2 * weights[i] * weights[i]);
    }
    return Math.exp(-sum);
}
const catagorize = (x,t = threshold) => (gaussian(x) >= t ? 1 : 0);

const lossCalculation = (xVals, yVals) => {
    let losses = 0;
    for (let i = 0; i < xVals.length; i++) {
        losses += -(yVals[i] * Math.log(gaussian(xVals[i]) + 1e-12) + (1 - yVals[i]) * Math.log(1 - gaussian(xVals[i]) + 1e-12));
    }
    return losses / xVals.length;
}

const updateRegression = (xVals, yVals) => {
    let dW = [];
    let dB = [];
    for (var i = 0; i < trainingValues.x[0].length; i++) {
       dW.push(0);
       dB.push(0);
    }
    for (let i = 0; i < xVals.length; i++) {
        let error = gaussian(xVals[i]) - yVals[i];
        for (let j = 0; j < trainingValues.x[0].length; j++) {
            dB[j] += error * (xVals[i][j] - biases[j]) / (weights[j] * weights[j]);
            dW[j] += error * Math.pow(xVals[i][j] - biases[j], 2) / (weights[j] * weights[j] * weights[j]);
        }
    }

    for (let j = 0; j < trainingValues.x[0].length; j++) {
        dB[j] /= xVals.length;
        dW[j] /= xVals.length;
    }

    return { dB: dB, dW: dW };
}
const classification = (xVals, yVals, t = threshold) => {
    let TP = 0, TN = 0, FP = 0, FN = 0;

    for (let i = 0; i < xVals.length; i++) {
        const predicted = catagorize(xVals[i], t); // xVals[i] is now an array
        if (yVals[i] === 1 && predicted === 1) {
            TP++;
        } else if (yVals[i] === 1 && predicted === 0) {
            FN++;
        } else if (yVals[i] === 0 && predicted === 1) {
            FP++;
        } else if (yVals[i] === 0 && predicted === 0) {
            TN++;
        }
    }
    const tpr = TP / (TP + FN);      // avoid division by zero
    const precision = TP / (TP + FP);
    const fpr = FP / (FP + TN);
    const acc = (TP + TN) / (TP + TN + FP + FN);
    return {TPR: tpr, precision, FPR: fpr, accuracy: acc};
};

const train = (epochs, lr) => {
    for (let epoch = 0; epoch < epochs; epoch++) {
        let grads = updateRegression(trainingValues.x, trainingValues.y);
        for (let j = 0; j < trainingValues.x[0].length; j++) {
            biases[j] -= lr * grads.dB[j];
            weights[j] -= lr * grads.dW[j];
        }

        if (epoch % (epochs/10) === 0) {
            console.log("Epoch " + epoch + ": Loss=" + lossCalculation(trainingValues.x, trainingValues.y).toFixed(4) + " Biases=" + biases.map(v => v.toFixed(2)) + " Weights=" + weights.map(v => v.toFixed(2)));
        }
    }
}
const debug = () =>{
    train(1000,0.05);
    console.log("Prediction:" + catagorize([2,3,1]));
    console.log("TPR: " + classification(trainingValues.x, trainingValues.y).TPR);
    console.log("Precision: " + classification(trainingValues.x, trainingValues.y).precision);
    console.log("FPR: " + classification(trainingValues.x, trainingValues.y).FPR);
    console.log("Accuracy: " + classification(trainingValues.x, trainingValues.y).accuracy);
}












































