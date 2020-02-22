const fs = require('fs');

let data = JSON.parse(fs.readFileSync('../../src/data/final.json'));



for(var i = 0; i < data.length; i++) {
    if(data[i].culture.length === 0) {
        data[i].culture = 'Other'
    }
}

console.log(data)

fs.writeFileSync('../../src/data/formattedFinal.json', JSON.stringify(data))

