// const fs = require('fs');
// const xml2js = require('xml2js');

// const xml = fs.readFileSync('ui.xml', 'utf8');

// const parser = new xml2js.Parser();
// let json = {};
// parser.parseString(xml, function (err, result) {
//     if (err) throw err;
//     json = result;
// });

// fs.writeFile(__dirname + '/ui.json', JSON.stringify(json, null, 2), function (err) {
//     if (err) throw err;
//     console.log('Conversion ahs been completed!');
// });



const fs = require('fs');


const xml2js = require('xml2js');


// let json = {};
// function parser() {
const xml = fs.readFileSync('ui.xml', 'utf8');

const parser = new xml2js.Parser();
let json = {};

parser.parseString(xml, function (err, result) {
    if (err) throw err;
    json = result;
});

const getStyle = component => {
    const { $ } = component;
    if ($ && $.style) {
        $.style = $.style.split(';').reduce((acc, curr) => {
            const [key, value] = curr.split('=');
            acc[key] = value;
            return acc;
        }, {});
    }
    component.mxCell?.forEach(cell => getStyle(cell));
};

json.mxfile.diagram.forEach(diagram => getStyle(diagram.mxGraphModel[0].root[0]));

// return json;
// }
fs.writeFile(__dirname + '/ui.json', JSON.stringify(json, null, 2), function (err) {
    if (err) throw err;
    console.log('Conversion has been completed');
});
console.log(json);

// module.exports = {
//     parser: parser
// };