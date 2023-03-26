const fs = require('fs');
const xmltojson = require('./xmltojson');
const { execSync } = require('child_process');

const json = xmltojson.parser();
// console.log(json);
// const xmltojson = require('./xmltojson');

// var run = 0;

function create() {
    return new Promise((resolve, reject) => {
        try {
            execSync('ng version', { stdio: 'ignore' });
            console.log('Angular is already installed.');
        } catch (error) {
            console.log('Installing Angular...');
            execSync('npm install -g @angular/cli --silent --skip-install', { stdio: 'inherit' });
        }

        const projectName = 'my-app';

        try {
            execSync(`ng new ${projectName} --routing=true --style=css --skip-git`, { stdio: 'inherit' });
            console.log('New project has been created successfully.');
            console.log(`Changing directory ${projectName}...`);
            process.chdir(projectName);

            // console.log(`Installing npm...`);
            // execSync('npm i', { stdio: 'inherit' });
        } catch (error) {
            console.log('Project already exist');
            console.log(`Changing directory ${projectName}...`);
            process.chdir(projectName);
        }

        const appComponent = `../${projectName}/src/app/app.component.html`;

        const text = '<router-outlet></router-outlet>';

        fs.writeFile(appComponent, text, (err) => {
            if (err) throw err;
            console.log('Cleared out app.component.html file successfully');
        });

        // fs.readFile('../ui.json', 'utf8', (err, data) => {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }

        // const json = JSON.parse(data);
        const diagrams = json.mxfile.diagram;

        for (const diagram of diagrams) {
            const tempName = diagram.$.name;
            const name = tempName.replace("-", "");
            // const id = diagram.$.id;
            console.log(`Creating new component ${name}...`);
            const htmlComponent = `../${projectName}/src/app/${name}/${name}.component.html`;
            const cssComponent = `../${projectName}/src/app/${name}/${name}.component.css`;
            // console.log(htmlcomponent);
            fs.readFile(htmlComponent, 'utf8', (err) => {
                if (err) {
                    // execSync(`ng g c ${name}`, { stdio: 'inherit' });
                    // execSync(`ng generate module app-routing --route ${name} --module app.module`, { stdio: 'inherit' });
                    execSync(`ng g module ${name} --route ${name} --module app.module`, { stdio: 'inherit' });

                    console.log(`Component ${name} Created Successfully`);

                    // fs.appendFile(appComponent, `\n<app-${name}></app-${name}>`.toLowerCase(), function (err) {
                    //   // fs.appendFile(appComponent, `<a src="/src/app/${name}/${name}.component.html">${name}</a>`.toLowerCase(), function (err) {
                    //   if (err) throw err;
                    //   console.log(`Component ${name} Created Successfully`);
                    // });
                } else {
                    console.log(`Component ${name} already existed`);
                    fs.writeFile(htmlComponent, ' ', (err) => {
                        if (err) throw err;
                        console.log(`Cleared out ${name}.component.html file successfully`);
                    });

                    fs.writeFile(cssComponent, ' ', (err) => {
                        if (err) throw err;
                        console.log(`Cleared out ${name}.component.css file successfully`);
                    });
                }
            });
            let compTempName = name.toLowerCase();
            fs.appendFile(appComponent, `\n<li><a routerLinkActive="active" routerLink="${compTempName}" >${name}</a></li>`, function (err) {
                if (err) throw err;
            });

            setTimeout(function () {
                const tempCells = diagram.mxGraphModel[0].root[0].mxCell;
                const cells = tempCells.filter(cell => cell.$.style && cell.$.style.shape);

                for (cell of cells) {
                    switch (cell.$.style.shape) {
                        case "mxgraph.mockup.buttons.button":
                            let buttons = [];
                            buttons.push(cell);
                            const buttonHTML = buttons.map(button => {
                                const id = button.$.id;
                                const value = button.$.value;
                                return `<button id="${id}" >${value}</button>`;
                            });
                            const button = buttonHTML.join("\n");

                            fs.appendFile(htmlComponent, `\n ${button}`, function (err) {
                                if (err) throw err;
                                console.log(`A button added`);
                            });

                            const buttonCSS = buttons.map(button => {
                                const style = button.$.style;
                                const id = button.$.id;
                                const geometry = button.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                const fontStyle = style.fontStyle === "1" ? "font-style: normal" : "";

                                return `#${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; ${fontStyle}; border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}}`;
                            });
                            const cssbutton = buttonCSS.join("\n");

                            fs.appendFile(cssComponent, `\n ${cssbutton}`, function (err) {
                                if (err) throw err;
                                console.log(`button style added`);
                            });
                            break;

                        case "mxgraph.mockup.text.textBox":
                            let textboxes = [];
                            textboxes.push(cell);

                            const textboxHTML = textboxes.map(textbox => {
                                const id = textbox.$.id;
                                const value = textbox.$.value;
                                return `<input id="${id}" type="text" placeholder="${value}">`;
                            });
                            const textbox = textboxHTML.join("\n");

                            fs.appendFile(htmlComponent, `\n ${textbox}`, function (err) {
                                if (err) throw err;
                                console.log(`A textbox added`);
                            });

                            const textboxCSS = textboxes.map(textbox => {
                                const style = textbox.$.style;
                                const id = textbox.$.id;
                                const value = textbox.$.value;
                                const geometry = textbox.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                return `#${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; color: ${style.fontColor}; text-align: ${style.align}; font-size: ${style.fontSize}px; padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;}`;
                            });
                            console.log(textboxHTML);
                            const textCSS = textboxCSS.join("\n");

                            fs.appendFile(cssComponent, `\n ${textCSS}`, function (err) {
                                if (err) throw err;
                                console.log(`textbox style added`);
                            });
                            break;

                        case "ellipse":
                            let radios = [];
                            radios.push(cell);
                            const radioHTML = radios.map(radio => {
                                const style = radio.$.style;
                                const id = radio.$.id;
                                const value = radio.$.value;
                                const geometry = radio.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                var x = parseInt(`${geometry.x}`) + 25;
                                return `<input type="radio" name="${value}" id="${id}" value="${value}">
                                        <label for="${id}" id="${id}label">${value}</label>`
                            });
                            const radio = radioHTML.join("\n");

                            fs.appendFile(htmlComponent, `\n ${radio}`, function (err) {
                                if (err) throw err;
                                console.log(`A radio button added`);
                            });

                            const radioCSS = radios.map(radio => {
                                const style = radio.$.style;
                                const id = radio.$.id;
                                const value = radio.$.value;
                                const geometry = radio.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                var x = parseInt(`${geometry.x}`) + 25;
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                return `#${id} {background-color: ${style.fillColor}; ${position} ${dashed}; border-color: ${style.strokeColor}; padding-left: ${style.spacingLeft}px;}
                                        #${id}label {position: absolute; left: ${x}px; top: ${geometry.y}px; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor};}`
                            });
                            const cssradio = radioCSS.join("\n");

                            fs.appendFile(cssComponent, `\n ${cssradio}`, function (err) {
                                if (err) throw err;
                                console.log(`radio button style added`);
                            });
                            break;

                        case "mxgraph.mockup.forms.comboBox":
                            let combos = [];
                            combos.push(cell);
                            const comboHTML = combos.map(combo => {
                                const style = combo.$.style;
                                const id = combo.$.id;
                                const value = combo.$.value;
                                const geometry = combo.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                var x = parseInt(`${geometry.x}`) + 25;
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                return `<select id="${id}"><option value="${value}">${value}</option></select>`;
                            });
                            const combo = comboHTML.join("\n");

                            fs.appendFile(htmlComponent, `\n ${combo}`, function (err) {
                                if (err) throw err;
                                console.log(`A comboBox added`);
                            });

                            const comboCSS = combos.map(combo => {
                                const style = combo.$.style;
                                const id = combo.$.id;
                                const value = combo.$.value;
                                const geometry = combo.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                var x = parseInt(`${geometry.x}`) + 25;
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                return `#${id} {${position} background-color: ${style.fillColor}; border-width: ${style.strokeWidth}px; ${dashed}; border-color: ${style.strokeColor}; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor}; padding-left: ${style.spacingLeft}px;}`
                            });
                            const csscombo = comboCSS.join("\n");

                            fs.appendFile(cssComponent, `\n ${csscombo}`, function (err) {
                                if (err) throw err;
                                console.log(`comboBox style added`);
                            });
                            break;

                        default:
                            break;
                    }
                    // }
                }
                // );
            }, 2000);


            setTimeout(function () {
                resolve();
            }, 10000);
        }

    });

    // });
}


function run() {
    console.log(`Running the application...`);
    execSync('ng serve', { stdio: 'inherit' });
}

create().then(() => {
    run();
});
