var tesseract = require('node-tesseract');
var path = require('path');
var fs = require('fs');
var async = require('async');
var inputDir = "/media/shiv/data/sujeet-tesseract";
var outputDir = "/media/shiv/data/sujeet-tesseract-out";


var readImageFiles = function(imageDir) {
    var imageArr = [];
    fs.readdirSync(imageDir).forEach(file => {
        imageArr.push(imageDir + "/" + file);
    })
    return imageArr;
}

var rmDir = function(dirPath) {
    try {
        var files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    fs.rmdirSync(dirPath);
};


var runTesseract = function(image, cb) {
    tesseract.process(image, function(err, text) {
        if (err) {
            reject(err);
        } else {
            var fileName = path.basename(image);
            var outputFile = outputDir + "/" + fileName.substr(0, fileName.indexOf('.'));
            fs.writeFileSync(outputFile, text, 'utf8');
            cb(null, outputFile);
        }
    });
};


var getTesseractOutputs = function() {
    return new Promise(function(resolve, reject) {
        rmDir(outputDir);
        fs.mkdirSync(outputDir);
        var imagesArr = readImageFiles(inputDir);
        async.map(imagesArr, runTesseract, function(e, totalResponse) {
            resolve(totalResponse)
        });
    });
}


getTesseractOutputs()
    .then(function(response) {
        console.log("*******************response*********************");
        console.log(response);
    }).catch(function(error) {
        console.log("error");
        console.log(error);
    })
