const fs = require('fs');
const xmltojson = require('./xmltojson');
const json = xmltojson.parser();
const { execSync } = require('child_process');

const projectName = 'my-app';
const appComponent = `../${projectName}/src/app/app.component.html`;
const router = '<router-outlet></router-outlet>';

function install() {
    try {
        execSync('ng version', { stdio: 'ignore' });
        console.log('Angular is already installed.');
    } catch (error) {
        console.log('Installing Angular...');
        execSync('npm install -g @angular/cli --silent --skip-install', { stdio: 'inherit' });
    }


    try {
        execSync(`ng new ${projectName} --routing=true --style=css --skip-git`, { stdio: 'inherit' });
        console.log('New project has been created successfully.');
        setAppComponent();
    } catch (error) {
        console.log('Project already exist');
        setAppComponent();
    }
    function setAppComponent() {
        console.log(`Changing directory ${projectName}...`);
        process.chdir(projectName);
        fs.writeFile(appComponent, ' ', (err) => {
            if (err) throw err;
            console.log('Cleared out app.component.html file successfully');
        });

    }

    // return Promise.resolve();

}

function create() {
    const diagrams = json.mxfile.diagram;

    for (const diagram of diagrams) {
        const tempName = diagram.$.name;
        const name = tempName.replace("-", "");
        console.log(`Creating new component ${name}...`);
        const htmlComponent = `../${projectName}/src/app/${name}/${name}.component.html`;
        const cssComponent = `../${projectName}/src/app/${name}/${name}.component.css`;

        function createCompoennt() {
            fs.readFile(htmlComponent, 'utf8', (err) => {
                if (err) {
                    execSync(`ng g module ${name} --route ${name} --module app.module`, { stdio: 'inherit' });
                    console.log(`Component ${name} Created Successfully`);
                    setComponent();
                } else {
                    console.log(`Component ${name} already existed`);
                    setComponent();
                }
            });

            function setComponent() {
                fs.writeFile(htmlComponent, '<html></html> ', (err) => {
                    if (err) throw err;
                    console.log(`Cleared out ${name}.component.html file successfully`);
                });
                fs.writeFile(cssComponent, `html { background-color: ${diagram.mxGraphModel[0].$.background}; width: ${diagram.mxGraphModel[0].$.pageWidth}px; height: ${diagram.mxGraphModel[0].$.pageHeight}px; } `, (err) => {
                    if (err) throw err;
                    console.log(`Cleared out ${name}.component.css file successfully`);
                });
                fs.appendFile(appComponent, ` >> <a routerLinkActive="active" routerLink="${name}" >${tempName}</a>   `, function (err) {
                    if (err) throw err;
                });
            }
            // return new Promise(resolve => setTimeout(resolve, 1000));

        }
        // setTimeout(function () {

        function createElement() {
            const tempCells = diagram.mxGraphModel[0].root[0].mxCell;
            const cells = tempCells.filter(cell => cell.$.style && cell.$.style.shape);

            for (cell of cells) {
                const style = cell.$.style;
                const id = cell.$.id;
                const value = cell.$.value;
                const geometry = cell.mxGeometry[0].$;
                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                var x = parseInt(`${geometry.x}`) + parseInt(`${geometry.width}`) + 10;
                var xx = parseInt(`${geometry.x}`) + 25;
                const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                const fontStyle = style.fontStyle === "1" ? "font-weight: bold" : "font-style: normal";
                let font = style.fontFamily ? style.fontFamily : "Helvetica";

                switch (cell.$.style.shape) {
                    case "mxgraph.mockup.buttons.button":

                        const buttonHTML = `<button id="${id}" >${value}</button>`;
                        fs.appendFile(htmlComponent, `\n ${buttonHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A button added`);
                        });

                        console.log(`#${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; font-family:${font}; ${fontStyle}; border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}}`);
                        const buttonCSS = `#${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; font-family:${font}; ${fontStyle}; border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}}`;
                        fs.appendFile(cssComponent, `\n ${buttonCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`button style added`);
                        });

                        break;

                    case "mxgraph.mockup.text.textBox":

                        const textboxHTML = `<input id="${id}" type="text" placeholder="${value}">`;
                        fs.appendFile(htmlComponent, `\n ${textboxHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A textbox added`);
                        });

                        const textboxCSS = `#${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; color: ${style.fontColor}; text-align: ${style.align}; font-size: ${style.fontSize}px; font-family:${font}; padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;}`;
                        fs.appendFile(cssComponent, `\n ${textboxCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`textbox style added`);
                        });

                        break;

                    case "ellipse":

                        const radioHTML = `<input type="radio" name="${value}" id="${id}" value="${value}"><label for="${id}" id="${id}label">${value}</label>`;
                        fs.appendFile(htmlComponent, `\n ${radioHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A radio button added`);
                        });

                        const radioCSS = `#${id} {background-color: ${style.fillColor}; ${position} ${dashed}; border-color: ${style.strokeColor}; padding-left: ${style.spacingLeft}px;}
                                    #${id}label {position: absolute; left: ${x}px; top: ${geometry.y}px; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor}; font-family:${font};}`;

                        fs.appendFile(cssComponent, `\n ${radioCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`radio button style added`);
                        });

                        break;

                    case "mxgraph.mockup.forms.comboBox":

                        const comboHTML = `<select id="${id}"><option value="${value}">${value}</option></select>`;
                        fs.appendFile(htmlComponent, `\n ${comboHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A comboBox added`);
                        });

                        const comboCSS = `#${id} {${position} background-color: ${style.fillColor}; border-width: ${style.strokeWidth}px; ${dashed}; border-color: ${style.strokeColor}; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor}; font-family:${font}; padding-left: ${style.spacingLeft}px;}`;
                        fs.appendFile(cssComponent, `\n ${comboCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`comboBox style added`);
                        });

                        break;

                    case "mxgraph.mockup.forms.rrect":

                        const checkboxHTML = `<input type="checkbox" name="${value}" id="${id}" value="${value}">
                                        <label for="${id}" id="${id}label">${value}</label>`
                        fs.appendFile(htmlComponent, `\n ${checkboxHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A checkbox added`);
                        });

                        const checkboxCSS = `#${id} {background-color: ${style.fillColor}; ${position} ${dashed}; border-color: ${style.strokeColor}; padding-left: ${style.spacingLeft}px;}
                                        #${id}label {position: absolute; left: ${x}px; top: ${geometry.y}px; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor}; font-family:${font};}`;
                        fs.appendFile(cssComponent, `\n ${checkboxCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`Checkbox style added`);
                        });

                        break;

                    case "rectangle":

                        const linkHTML = `<a href="" id="${id}">${value}</a>`;
                        fs.appendFile(htmlComponent, `\n ${linkHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A link added`);
                        });

                        const linkCSS = `#${id} { color: ${style.fontColor}; font-size: ${style.fontSize}px; font-family: ${font}; ${position} }`;
                        fs.appendFile(cssComponent, `\n ${linkCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`link style added`);
                        });

                        break;

                    case "text":

                        const textHTML = `<p id="${id}" >${value}</p>`;
                        fs.appendFile(htmlComponent, `\n ${textHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A text added`);
                        });

                        const textCSS = `#${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; color: ${style.fontColor}; font-family: ${font}; text-align: ${style.align}; font-size: ${style.fontSize}px; padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;}`;

                        fs.appendFile(cssComponent, `\n ${textCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`text style added`);
                        });

                        break;

                    default:
                        break;
                }
            }
        }
        createCompoennt();
        setTimeout(function () {
            createElement();
        }, 1000);

    }
    setTimeout(function () {
        // return resolve();
        run();
    }, 3000);
}

function run() {
    fs.appendFile(appComponent, router, (err) => {
        if (err) throw err;
        console.log('Set app.component.html');
        console.log(`Running the application...`);
        execSync('ng serve --open', { stdio: 'inherit' });
    });
}


install();

setTimeout(function () {
    create();
}, 1000);

