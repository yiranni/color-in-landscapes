const fs = require('fs');
const imgFolderBase = '../../src/img/';

const imgFolderArry = ['springimg', 'summerimg', 'autumnimg', 'winterimg'];

function sortNumber(a, b) {
    return Number(a.substr(0, a.indexOf('_'))) - Number(b.substr(0, b.indexOf('_')));
}

for (var i = 0; i < imgFolderArry.length; i++) {
    writeArray(imgFolderBase, imgFolderArry[i]);
}

// writeArray(imgFolderBase, 'springimg')

function writeArray(base, season) {
    let array = [];
    fs.readdirSync(base + season).forEach(file => {
        array.push(file)
    });
    array.sort(sortNumber)
    fs.writeFileSync('../../src/data/' + season + '.json', JSON.stringify(array))
}