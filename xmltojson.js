const fs = require('fs');

const xml2js = require('xml2js');

let json = {};
function parser() {
    const xml = fs.readFileSync('ui.xml', 'utf8');

    const parser = new xml2js.Parser();

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
            if (Object.hasOwnProperty.call($.style, 'text') && !Object.hasOwnProperty.call($.style, 'shape')) {
                $.style.shape = 'text';
            }
        }
        component.mxCell?.forEach(cell => getStyle(cell));
    };

    json.mxfile.diagram.forEach(diagram => getStyle(diagram.mxGraphModel[0].root[0]));

    return json;
}

module.exports = {
    parser: parser
};