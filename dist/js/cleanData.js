const fs = require('fs');
let fileBaseDirectory = '../../src/data/';
// let springData = 'allSpringData.json'
// let summerData = 'allSummerData.json'
// let autumnData = 'allAutumnData.json';
// let winterData = 'allWinterData.json';

let dataArry = ['allSpringData.json', 'allSummerData.json', 'allAutumnData.json', 'allWinterData.json']
for (var i = 0; i < dataArry.length; i++) {
    cleanData(fileBaseDirectory, dataArry[i])
}


function cleanData(base, season) {
    let file = JSON.parse(fs.readFileSync(base + season));
    let cleanedFile = [];
    for (var i = 0; i < file.length; i++) {
        if ((file[i].classification).includes("Painting") && !(file[i].tags).includes('portrait') && !(file[i].tags).includes('Portraits') && !((file[i].title).toLowerCase()).includes('portrait') && (file[i].tags).includes('Landscapes')) {
            cleanedFile.push(file[i])
        
        } 
    }
    console.log(season + ": " + cleanedFile.length)
    fs.writeFileSync('../../src/data/cleanedData/cleaned' + season, JSON.stringify(cleanedFile))
}