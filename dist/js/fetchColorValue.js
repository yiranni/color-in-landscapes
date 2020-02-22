const ColorThief = require("colorthief");
const fs = require("fs")

const imgDataBase = '../../src/data/';
const endpointArray = ['springimg', 'summerimg', 'autumnimg', 'winterimg'];


function fetchColorValue(path, filename, colorArray) {
    let objColor = {
        objectID: filename.split('.')[0],
        colorValue: []
    };
    ColorThief.getColor(path + '/' + filename)
        .then(
            color => {
                objColor.colorValue = color;
                console.log(objColor);
                colorArray.push(objColor);
                return objColor;
            })
        .catch(err => {
            console.log(err)
        });
}

function getImgFileData(base, endpoint) {
    let file = JSON.parse(fs.readFileSync(base + endpoint + '.json'));
    console.log(file);
    let colorArray = [];
    for (var i = 0; i < file.length; i++) {
        fetchColorValue('../../src/img/' + endpoint, file[i], colorArray)
    }
    setTimeout(() => {
        fs.writeFileSync("../../src/data/" + endpoint + "ColorValue.json", JSON.stringify(colorArray))
    }, 20000)
}

for (var i = 0; i < endpointArray.length; i++) {
    getImgFileData(imgDataBase, endpointArray[i]);
}