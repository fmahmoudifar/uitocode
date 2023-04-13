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
            console.log('Cleared out app.component.html');
        });
    }
}

function create() {
    const diagrams = json.mxfile.diagram;
    // console.log(diagrams);

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
                    console.log(`Cleared out ${name}.component.html`);
                });
                fs.writeFile(cssComponent, `html { background-color: ${diagram.mxGraphModel[0].$.background}; width: ${diagram.mxGraphModel[0].$.pageWidth}px; height: ${diagram.mxGraphModel[0].$.pageHeight}px; } `, (err) => {
                    if (err) throw err;
                    console.log(`Cleared out ${name}.component.css`);
                });
                fs.appendFile(appComponent, ` >> <a routerLinkActive="active" routerLink="${name}" >${tempName}</a>   `, function (err) {
                    if (err) throw err;
                });
            }
        }

        function createElement() {
            const cells = diagram.mxGraphModel[0].root[0].mxCell.filter(cell => cell.$.style && cell.$.style.shape);

            for (cell of cells) {
                // console.log(cell);
                const style = cell.$.style;
                const id = cell.$.id;
                const value = cell.$.value;
                const geometry = cell.mxGeometry[0].$;
                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                const y = parseInt(`${geometry.y}`) + 10;
                const linkPosition = `position:absolute; left:${geometry.x}px; top:${y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                let x = parseInt(`${geometry.x}`) + parseInt(`${geometry.width}`) + 10;
                const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                let dashed = style.dashed === "0" ? "border-style: solid;" : "";
                let font = style.fontFamily ? style.fontFamily : "Helvetica";
                let fontStyle = "";

                switch (style.fontStyle) {
                    case "1":
                        fontStyle = "font-weight: bold;";
                        break;
                    case "2":
                        fontStyle = "font-style: italic;";
                        break;
                    case "3":
                        fontStyle = "font-weight: bold; font-style: italic;";
                        break;
                    case "4":
                        fontStyle = "text-decoration: underline;";
                        break;
                    case "5":
                        fontStyle = "font-weight: bold; text-decoration: underline;";
                        break;
                    case "6":
                        fontStyle = "font-style: italic; text-decoration: underline;";
                        break;
                    default:
                        fontStyle = "font-style: normal;";
                        break;
                };

                switch (cell.$.style.shape) {
                    case "mxgraph.mockup.buttons.button":

                        const buttonHTML = `<button id="a${id}" >${value}</button>`;
                        fs.appendFile(htmlComponent, `\n ${buttonHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A button added`);
                        });

                        const buttonCSS = `#a${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed} text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; font-family:${font}; ${fontStyle} border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}}`;
                        fs.appendFile(cssComponent, `\n ${buttonCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`button style added`);
                        });

                        break;

                    case "mxgraph.mockup.text.textBox":

                        const textboxHTML = `<input id="a${id}" type="text" placeholder="${value}">`;
                        fs.appendFile(htmlComponent, `\n ${textboxHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A textbox added`);
                        });

                        const textboxCSS = `#a${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed} color: ${style.fontColor}; text-align: ${style.align}; font-size: ${style.fontSize}px; font-family:${font}; ${fontStyle} padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;}`;
                        fs.appendFile(cssComponent, `\n ${textboxCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`textbox style added`);
                        });

                        break;

                    case "ellipse":

                        const radioHTML = `<input type="radio" name="${value}" id="a${id}" value="${value}"><label for="a${id}" id="a${id}label">${value}</label>`;
                        fs.appendFile(htmlComponent, `\n ${radioHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A radio button added`);
                        });

                        const radioCSS = `#a${id} {background-color: ${style.fillColor}; ${position} ${dashed} border-color: ${style.strokeColor}; padding-left: ${style.spacingLeft}px;}
                                    #a${id}label {position: absolute; left: ${x}px; top: ${geometry.y}px; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor}; font-family:${font}; ${fontStyle}}`;

                        fs.appendFile(cssComponent, `\n ${radioCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`radio button style added`);
                        });

                        break;

                    case "mxgraph.mockup.forms.comboBox":

                        const comboHTML = `<select id="a${id}"><option value="${value}">${value}</option></select>`;
                        fs.appendFile(htmlComponent, `\n ${comboHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A comboBox added`);
                        });

                        const comboCSS = `#a${id} {${position} border-width: ${style.strokeWidth}px; ${dashed} border-color: ${style.strokeColor}; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor}; font-family:${font}; ${fontStyle} padding-left: ${style.spacingLeft}px;}`;
                        fs.appendFile(cssComponent, `\n ${comboCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`comboBox style added`);
                        });

                        break;

                    case "mxgraph.mockup.forms.rrect":

                        const checkboxHTML = `<input type="checkbox" name="${value}" id="a${id}" value="${value}">
                                        <label for="a${id}" id="a${id}label">${value}</label>`
                        fs.appendFile(htmlComponent, `\n ${checkboxHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A checkbox added`);
                        });

                        const checkboxCSS = `#a${id} {background-color: ${style.fillColor}; ${position} ${dashed} border-color: ${style.strokeColor}; padding-left: ${style.spacingLeft}px;}
                                        #a${id}label {position: absolute; left: ${x}px; top: ${geometry.y}px; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor}; font-family:${font}; ${fontStyle}}`;
                        fs.appendFile(cssComponent, `\n ${checkboxCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`Checkbox style added`);
                        });

                        break;

                    case "rectangle":

                        const linkHTML = `<a href="" id="a${id}">${value}</a>`;
                        fs.appendFile(htmlComponent, `\n ${linkHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A link added`);
                        });

                        const linkCSS = `#a${id} { color: ${style.fontColor}; font-size: ${style.fontSize}px; text-align: ${style.align}; vertical-align: ${style.verticalAlign}; font-family: ${font}; ${fontStyle} ${linkPosition} }`;
                        fs.appendFile(cssComponent, `\n ${linkCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`link style added`);
                        });

                        break;

                    case "text":

                        const textHTML = `<p id="a${id}" >${value}</p>`;
                        fs.appendFile(htmlComponent, `\n ${textHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A text added`);
                        });

                        const textCSS = `#a${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; color: ${style.fontColor}; font-family: ${font}; ${fontStyle} text-align: ${style.align}; vertical-align: ${style.verticalAlign}; font-size: ${style.fontSize}px; padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;}`;

                        fs.appendFile(cssComponent, `\n ${textCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`text style added`);
                        });

                        break;

                    case "div":
                        if (!style.strokeWidth) {
                            style.strokeWidth = 1;
                        }
                        if (!style.strokeColor) {
                            style.strokeColor = '#000000';
                        }
                        if (!dashed) {
                            dashed = "border-style: solid;";
                        }
                        const divHTML = `<div id="a${id}" >${value}</div>`;
                        fs.appendFile(htmlComponent, `\n ${divHTML}`, function (err) {
                            if (err) throw err;
                            console.log(`A div added`);
                        });

                        const divCSS = `#a${id} {border-width: ${style.strokeWidth}px; ${dashed} background-color: ${style.fillColor}; border-color: ${style.strokeColor}; ${position} }`;

                        fs.appendFile(cssComponent, `\n ${divCSS}`, function (err) {
                            if (err) throw err;
                            console.log(`div style added`);
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
        }, 2000);

    }
    setTimeout(function () {
        run();
    }, 10000);
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

