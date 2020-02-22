const fs = require('fs');

const request = require('request');

const inputFileBase = '../../src/data/cleanedData/cleanedall';

function downloadImage(folder, uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(encodeURI(uri)) 
            .on('error', function(err) {
                console.log(err)
            } )
            .pipe(fs.createWriteStream(folder + "/" + filename)).on('close', callback);
    });
};

function downloadData(base, season, dataType) {
    fs.readFile(base + season + dataType , "utf8", (err, data) => {
        if (err) console.log(err);

        JSON.parse(data).forEach(e => {
            if (e.primaryImage.length > 0) {
                downloadImage('../../src/img/' + season.toLowerCase() + 'img', e.primaryImageSmall,  e.objectID + '.' +e.primaryImage.split('.').pop(), function () {
                    console.log('Finished Downloading ' + e.primaryImage.split('/').pop());
                });
            }
        });

    });
}

downloadData(inputFileBase, "Spring", "Data.json");
downloadData(inputFileBase, "Summer", "Data.json");
downloadData(inputFileBase, "Autumn", "Data.json");
downloadData(inputFileBase, "Winter", "Data.json");