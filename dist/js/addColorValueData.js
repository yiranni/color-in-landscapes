const fs = require('fs');

const seasons = ['Spring', 'Summer', 'Autumn', 'Winter']
const cvpath = '../../src/data/'
const cvEndpoint = 'imgColorValue.json';
const datapath = '../../src/data/cleanedData/cleanedall'
const dataEndpoint = 'Data.json'


function combineData(season, cvpath, cvEndpoint, datapath, dataEndpoint) {
    let colorValueData = JSON.parse(fs.readFileSync(cvpath + season.toLowerCase() + cvEndpoint));
    let data = JSON.parse(fs.readFileSync(datapath + season + dataEndpoint))


    let newData = [];
    for (var i = 0; i < colorValueData.length; i++) {
        let obj = {};
        for (var j = 0; j < data.length; j++) {
            if (parseInt(colorValueData[i].objectID) == data[j].objectID) {
                obj.objectID = colorValueData[i].objectID;
                obj.colorValue = colorValueData[i].colorValue;
                obj.objectImage = data[j].primaryImage;
                obj.artistName = data[j].artistDisplayName;
                obj.department = data[j].department;
                obj.culture = data[j].culture;
                obj.title = data[j].title;
                obj.date = data[j].objectBeginDate;
                obj.url = data[j].objectURL;
                obj.season = season;
            }
        }
        newData.push(obj)

    }
    console.log(season + ": " + newData.length)
    fs.writeFileSync('../../src/data/final' + season + 'data.json', JSON.stringify(newData)) 

}

for (var i = 0; i < seasons.length; i++) {
    combineData(seasons[i], cvpath, cvEndpoint, datapath, dataEndpoint)
}