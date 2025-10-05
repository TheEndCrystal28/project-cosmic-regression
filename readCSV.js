function readCSVToXY(file, xCols, yCol, callback) {
    let reader = new FileReader();
    reader.onload = function(e) {
        let data = e.target.result;
        let lines = data.trim().split(/\r?\n/);
        let headers = lines[0].split(',');

        let xIndices = [];
        for (let i = 0; i < xCols.length; i++) {
            xIndices.push(headers.indexOf(xCols[i]));
        }
        let yIndex = headers.indexOf(yCol);

        let x = [];
        let y = [];

        for (let j = 1; j < lines.length; j++) {
            let values = lines[j].split(',');
            let xRow = [];
            for (let k = 0; k < xIndices.length; k++) {
                xRow.push(values[xIndices[k]]);
            }
            x.push(xRow);
            y.push(values[yIndex]);
        }

        callback({ x: x, y: y });
    };

    reader.readAsText(file);
}