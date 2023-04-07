const fs = require('fs');
const xmltojson = require('./xmltojson');
const json = xmltojson.parser();

const { execSync } = require('child_process');

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

            console.log(`Installing npm...`);
            execSync('npm i', { stdio: 'inherit' });
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
                    fs.writeFile(htmlComponent, '<html></html> ', (err) => {
                        if (err) throw err;
                        console.log(`Cleared out ${name}.component.html file successfully`);
                    });

                    // fs.writeFile(cssComponent, '', (err) => {
                    fs.writeFile(cssComponent, `html { background-color: ${diagram.mxGraphModel[0].$.background}; width: ${diagram.mxGraphModel[0].$.pageWidth}px; height: ${diagram.mxGraphModel[0].$.pageHeight}px; } `, (err) => {

                        if (err) throw err;
                        console.log(`Cleared out ${name}.component.css file successfully`);
                    });
                }
            });
            // let compTempName = toLowerCase(name);
            // fs.appendFile(appComponent, `\n<li><a routerLinkActive="active" routerLink="${name}" >${tempName}</a></li>`, function (err) {
            fs.appendFile(appComponent, ` >> <a routerLinkActive="active" routerLink="${name}" >${tempName}</a>   `, function (err) {

                if (err) throw err;
            });

            setTimeout(function () {
                const tempCells = diagram.mxGraphModel[0].root[0].mxCell;
                const cells = tempCells.filter(cell => cell.$.style && cell.$.style.shape);

                for (cell of cells) {
                    // console.log(cell.$.style[0]);
                    switch (cell.$.style.shape) {
                        case "mxgraph.mockup.buttons.button":
                            let buttons = [];
                            buttons.push(cell);
                            const buttonHTML = buttons.map(elem => {
                                const id = elem.$.id;
                                const value = elem.$.value;
                                return `<button id="${id}" >${value}</button>`;
                            });
                            // const button = buttonHTML.join("\n");

                            fs.appendFile(htmlComponent, `\n ${buttonHTML.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`A button added`);
                            });

                            const buttonCSS = buttons.map(elem => {
                                const style = elem.$.style;
                                const id = elem.$.id;
                                const geometry = elem.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                const fontStyle = style.fontStyle === "1" ? "font-style: normal" : "";
                                let font = style.fontFamily ? style.fontFamily : "Helvetica";

                                return `#${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; font-family:${font}; ${fontStyle}; border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}}`;
                            });
                            // const cssbutton = buttonCSS.join("\n");

                            fs.appendFile(cssComponent, `\n ${buttonCSS.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`button style added`);
                            });
                            break;

                        case "mxgraph.mockup.text.textBox":
                            let textboxes = [];
                            textboxes.push(cell);

                            const textboxHTML = textboxes.map(elem => {
                                const id = elem.$.id;
                                const value = elem.$.value;
                                return `<input id="${id}" type="text" placeholder="${value}">`;
                            });
                            // const textbox = textboxHTML.join("\n");

                            fs.appendFile(htmlComponent, `\n ${textboxHTML.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`A textbox added`);
                            });

                            const textboxCSS = textboxes.map(elem => {
                                const style = elem.$.style;
                                const id = elem.$.id;
                                const value = elem.$.value;
                                const geometry = elem.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                let font = style.fontFamily ? style.fontFamily : "Helvetica";
                                return `#${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; color: ${style.fontColor}; text-align: ${style.align}; font-size: ${style.fontSize}px; font-family:${font}; padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;}`;
                            });
                            // const CSStextbox = textboxCSS.join("\n");

                            fs.appendFile(cssComponent, `\n ${textboxCSS.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`textbox style added`);
                            });
                            break;

                        case "ellipse":
                            let radios = [];
                            radios.push(cell);
                            const radioHTML = radios.map(elem => {
                                const id = elem.$.id;
                                const value = elem.$.value;
                                return `<input type="radio" name="${value}" id="${id}" value="${value}">
                                        <label for="${id}" id="${id}label">${value}</label>`
                            });
                            // const radio = radioHTML.join("\n");

                            fs.appendFile(htmlComponent, `\n ${radioHTML.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`A radio button added`);
                            });

                            const radioCSS = radios.map(elem => {
                                const style = elem.$.style;
                                const id = elem.$.id;
                                const value = elem.$.value;
                                const geometry = elem.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                var x = parseInt(`${geometry.x}`) + parseInt(`${geometry.width}`) + 10;
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                let font = style.fontFamily ? style.fontFamily : "Helvetica";

                                return `#${id} {background-color: ${style.fillColor}; ${position} ${dashed}; border-color: ${style.strokeColor}; padding-left: ${style.spacingLeft}px;}
                                        #${id}label {position: absolute; left: ${x}px; top: ${geometry.y}px; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor}; font-family:${font};}`
                            });
                            // const cssradio = radioCSS.join("\n");

                            fs.appendFile(cssComponent, `\n ${radioCSS.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`radio button style added`);
                            });
                            break;

                        case "mxgraph.mockup.forms.comboBox":
                            let combos = [];
                            combos.push(cell);
                            const comboHTML = combos.map(elem => {
                                const id = elem.$.id;
                                const value = elem.$.value;
                                return `<select id="${id}"><option value="${value}">${value}</option></select>`;
                            });
                            // const combo = comboHTML.join("\n");

                            fs.appendFile(htmlComponent, `\n ${comboHTML.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`A comboBox added`);
                            });

                            const comboCSS = combos.map(elem => {
                                const style = elem.$.style;
                                const id = elem.$.id;
                                const value = elem.$.value;
                                const geometry = elem.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                var x = parseInt(`${geometry.x}`) + 25;
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                let font = style.fontFamily ? style.fontFamily : "Helvetica";

                                return `#${id} {${position} background-color: ${style.fillColor}; border-width: ${style.strokeWidth}px; ${dashed}; border-color: ${style.strokeColor}; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor}; font-family:${font}; padding-left: ${style.spacingLeft}px;}`
                            });
                            // const csscombo = comboCSS.join("\n");

                            fs.appendFile(cssComponent, `\n ${comboCSS.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`comboBox style added`);
                            });
                            break;

                        case "mxgraph.mockup.forms.rrect":
                            let checkboxes = [];
                            checkboxes.push(cell);
                            const checkboxHTML = checkboxes.map(elem => {
                                const style = elem.$.style;
                                const id = elem.$.id;
                                const value = elem.$.value;
                                return `<input type="checkbox" name="${value}" id="${id}" value="${value}">
                                            <label for="${id}" id="${id}label">${value}</label>`
                            });
                            // const checkbox = checkboxHTML.join("\n");

                            fs.appendFile(htmlComponent, `\n ${checkboxHTML.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`A checkbox added`);
                            });

                            const checkboxCSS = checkboxes.map(elem => {
                                const style = elem.$.style;
                                const id = elem.$.id;
                                const value = elem.$.value;
                                const geometry = elem.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                var x = parseInt(`${geometry.x}`) + parseInt(`${geometry.width}`) + 10;
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                let font = style.fontFamily ? style.fontFamily : "Helvetica";

                                return `#${id} {background-color: ${style.fillColor}; ${position} ${dashed}; border-color: ${style.strokeColor}; padding-left: ${style.spacingLeft}px;}
                                            #${id}label {position: absolute; left: ${x}px; top: ${geometry.y}px; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor}; font-family:${font};}`
                            });
                            // const csscheckbox = checkboxCSS.join("\n");

                            fs.appendFile(cssComponent, `\n ${checkboxCSS.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`Checkbox style added`);
                            });
                            break;

                        case "rectangle":
                            let links = [];
                            links.push(cell);

                            const linkHTML = links.map(elem => {
                                const id = elem.$.id;
                                const value = elem.$.value;
                                return `<a href="" id="${id}">${value}</a>`;
                            });
                            // const link = linkHTML.join("\n");

                            fs.appendFile(htmlComponent, `\n ${linkHTML.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`A link added`);
                            });

                            const linkCSS = links.map(elem => {
                                const style = elem.$.style;
                                const id = elem.$.id;
                                const value = elem.$.value;
                                const geometry = elem.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                let font = style.fontFamily ? style.fontFamily : "Helvetica";
                                return `#${id} { color: ${style.fontColor}; font-size: ${style.fontSize}px; font-family: ${font}; ${position} }`;
                            });
                            // const CSSlink = linkCSS.join("\n");

                            fs.appendFile(cssComponent, `\n ${linkCSS.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`link style added`);
                            });
                            break;

                        case "text":
                            let texts = [];
                            texts.push(cell);

                            const textHTML = texts.map(elem => {
                                const id = elem.$.id;
                                const value = elem.$.value;
                                return `<p id="${id}" >${value}</p>`;
                            });
                            // const text = textHTML.join("\n");

                            fs.appendFile(htmlComponent, `\n ${textHTML.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`A text added`);
                            });

                            const textCSS = texts.map(elem => {
                                const style = elem.$.style;
                                const id = elem.$.id;
                                const value = elem.$.value;
                                const geometry = elem.mxGeometry[0].$;
                                const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                let font = style.fontFamily ? style.fontFamily : "Helvetica";

                                return `#${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; color: ${style.fontColor}; font-family: ${font}; text-align: ${style.align}; font-size: ${style.fontSize}px; padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;}`;
                            });
                            // const CSStext = textCSS.join("\n");

                            fs.appendFile(cssComponent, `\n ${textCSS.join("\n")}`, function (err) {
                                if (err) throw err;
                                console.log(`text style added`);
                            });
                            break;

                        default:
                            break;
                    }
                }
                // }
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
    execSync('ng serve --open', { stdio: 'inherit' });
}

create().then(() => {
    run();
});
