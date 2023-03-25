const fs = require('fs');

const { execSync } = require('child_process');

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

        fs.readFile('../ui.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            const json = JSON.parse(data);
            const diagrams = json.mxfile.diagram;

            for (const diagram of diagrams) {
                const name1 = diagram.$.name;
                const name = name1.replace("-", "");
                // const id = diagram.$.id;
                console.log(`Creating new component ${name}...`);
                const htmlComponent = `../${projectName}/src/app/${name}/${name}.component.html`;
                const cssComponent = `../${projectName}/src/app/${name}/${name}.component.css`;
                // console.log(htmlcomponent);
                fs.readFile(htmlComponent, 'utf8', (err) => {
                    if (err) {
                        execSync(`ng g c ${name}`, { stdio: 'inherit' });
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

                fs.appendFile(appComponent, `\n<app-${name}></app-${name}>`.toLowerCase(), function (err) {
                    // fs.appendFile(appComponent, `<a src="/src/app/${name}/${name}.component.html">${name}</a>`.toLowerCase(), function (err) {
                    if (err) throw err;
                });

                setTimeout(function () {
                    const cells = diagram.mxGraphModel[0].root[0].mxCell;
                    // console.log(cells);
                    // cells.forEach((cell) => {
                    for (cell of cells) {
                        if (cell.$.style) {
                            switch (cell.$.style.shape) {
                                case "mxgraph.mockup.buttons.button":
                                    const buttons = diagram.mxGraphModel[0].root[0].mxCell.filter(cell => cell.$.style && cell.$.style.shape === "mxgraph.mockup.buttons.button");
                                    // console.log(buttons);
                                    // const buttonStyles = buttons.map(button => button.$.style);

                                    const buttonHTML = buttons.map(button => {
                                        // const style = button.$.style;
                                        const id = button.$.id;
                                        const value = button.$.value;
                                        // const geometry = button.mxGeometry[0].$;
                                        // const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                        // const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                                        // const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                        // const fontStyle = style.fontStyle === "1" ? "font-style: normal" : "";

                                        return `<button id="${id}" >${value}</button>`;
                                    });
                                    const button = buttonHTML.join("\n");

                                    fs.appendFile(htmlComponent, `\n ${button}`, function (err) {
                                        // fs.appendFile(appComponent, `<a src="/src/app/${name}/${name}.component.html">${name}</a>`.toLowerCase(), function (err) {
                                        if (err) throw err;
                                        console.log(`A button added`);
                                    });

                                    const buttonCSS = buttons.map(button => {
                                        const style = button.$.style;
                                        const id = button.$.id;
                                        // const value = button.$.value;
                                        const geometry = button.mxGeometry[0].$;
                                        const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                        const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                                        const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                        const fontStyle = style.fontStyle === "1" ? "font-style: normal" : "";

                                        return `#${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; ${fontStyle}; border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}}`;
                                    });
                                    const cssbutton = buttonCSS.join("\n");

                                    fs.appendFile(cssComponent, `\n ${cssbutton}`, function (err) {
                                        // fs.appendFile(appComponent, `<a src="/src/app/${name}/${name}.component.html">${name}</a>`.toLowerCase(), function (err) {
                                        if (err) throw err;
                                        console.log(`button style added`);
                                    });


                                    // console.log(buttonHTML.join("\n"));
                                    break;
                                case "mxgraph.mockup.text.textBox":
                                    const textboxes = diagram.mxGraphModel[0].root[0].mxCell.filter(cell => cell.$.style && cell.$.style.shape === "mxgraph.mockup.text.textBox");
                                    // console.log(buttons);
                                    // const buttonStyles = buttons.map(button => button.$.style);

                                    const textboxHTML = textboxes.map(textbox => {
                                        // const style = textbox.$.style;
                                        const id = textbox.$.id;
                                        const value = textbox.$.value;
                                        // const geometry = textbox.mxGeometry[0].$;
                                        // const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                        // const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                                        // const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                        // const fontStyle = style.fontStyle === "1" ? "font-style: normal" : "";

                                        // return `<button id="${id}" style="border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; ${fontStyle}; border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}">${value}</button>`;
                                        return `<input id="${id}" type="text" placeholder="${value}">`;
                                    });
                                    const textbox = textboxHTML.join("\n");

                                    fs.appendFile(htmlComponent, `\n ${textbox}`, function (err) {
                                        // fs.appendFile(appComponent, `<a src="/src/app/${name}/${name}.component.html">${name}</a>`.toLowerCase(), function (err) {
                                        if (err) throw err;
                                        console.log(`A textbox added`);
                                    });

                                    const textboxCSS = textboxes.map(textbox => {
                                        const style = textbox.$.style;
                                        const id = textbox.$.id;
                                        const value = textbox.$.value;
                                        const geometry = textbox.mxGeometry[0].$;
                                        const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                        // const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                                        const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                        // const fontStyle = style.fontStyle === "1" ? "font-style: normal" : "";

                                        // return `<button id="${id}" style="border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; ${fontStyle}; border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}">${value}</button>`;
                                        return `#${id} {border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; color: ${style.fontColor}; text-align: ${style.align}; font-size: ${style.fontSize}px; padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;}`;
                                    });
                                    const textCSS = textboxCSS.join("\n");

                                    fs.appendFile(cssComponent, `\n ${textCSS}`, function (err) {
                                        // fs.appendFile(appComponent, `<a src="/src/app/${name}/${name}.component.html">${name}</a>`.toLowerCase(), function (err) {
                                        if (err) throw err;
                                        console.log(`textbox style added`);
                                    });

                                    break;
                                case "ellipse":
                                    const radios = diagram.mxGraphModel[0].root[0].mxCell.filter(cell => cell.$.style && cell.$.style.shape === "ellipse");
                                    // console.log(buttons);
                                    // const buttonStyles = buttons.map(button => button.$.style);

                                    const radioHTML = radios.map(radio => {
                                        const style = radio.$.style;
                                        const id = radio.$.id;
                                        const value = radio.$.value;
                                        const geometry = radio.mxGeometry[0].$;
                                        const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                        var x = parseInt(`${geometry.x}`) + 25;
                                        // const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                                        // const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                        // const fontStyle = style.fontStyle === "1" ? "font-style: normal" : "";

                                        // return `<button id="${id}" style="border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; ${fontStyle}; border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}">${value}</button>`;
                                        // return `<input id="${id}" type="text" value="${value}" style="border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; color: ${style.fontColor}; text-align: ${style.align}; font-size: ${style.fontSize}px; padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;">`;
                                        return `<input type="radio" name="${value}" id="${id}" value="${value}">
                                        <label for="${id}" id="${id}label">${value}</label>`
                                    });
                                    const radio = radioHTML.join("\n");

                                    fs.appendFile(htmlComponent, `\n ${radio}`, function (err) {
                                        // fs.appendFile(appComponent, `<a src="/src/app/${name}/${name}.component.html">${name}</a>`.toLowerCase(), function (err) {
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
                                        // const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                                        const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                        // const fontStyle = style.fontStyle === "1" ? "font-style: normal" : "";

                                        // return `<button id="${id}" style="border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; ${fontStyle}; border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}">${value}</button>`;
                                        // return `<input id="${id}" type="text" value="${value}" style="border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; color: ${style.fontColor}; text-align: ${style.align}; font-size: ${style.fontSize}px; padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;">`;
                                        return `#${id} {background-color: ${style.fillColor}; ${position} ${dashed}; border-color: ${style.strokeColor}; padding-left: ${style.spacingLeft}px;}
                                        #${id}label {position: absolute; left: ${x}px; top: ${geometry.y}px; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor};}`

                                    });
                                    const cssradio = radioCSS.join("\n");

                                    fs.appendFile(cssComponent, `\n ${cssradio}`, function (err) {
                                        // fs.appendFile(appComponent, `<a src="/src/app/${name}/${name}.component.html">${name}</a>`.toLowerCase(), function (err) {
                                        if (err) throw err;
                                        console.log(`radio button style added`);
                                    });
                                    break;
                                case "mxgraph.mockup.forms.comboBox":
                                    const combos = diagram.mxGraphModel[0].root[0].mxCell.filter(cell => cell.$.style && cell.$.style.shape === "mxgraph.mockup.forms.comboBox");
                                    // console.log(buttons);
                                    // const buttonStyles = buttons.map(button => button.$.style);

                                    const comboHTML = combos.map(combo => {
                                        const style = combo.$.style;
                                        const id = combo.$.id;
                                        const value = combo.$.value;
                                        const geometry = combo.mxGeometry[0].$;
                                        const position = `position:absolute; left:${geometry.x}px; top:${geometry.y}px; width:${geometry.width}px; height:${geometry.height}px;`;
                                        var x = parseInt(`${geometry.x}`) + 25;
                                        // const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                                        const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                        // const fontStyle = style.fontStyle === "1" ? "font-style: normal" : "";

                                        // return `<button id="${id}" style="border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; ${fontStyle}; border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}">${value}</button>`;
                                        // return `<input id="${id}" type="text" value="${value}" style="border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; color: ${style.fontColor}; text-align: ${style.align}; font-size: ${style.fontSize}px; padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;">`;
                                        // return `<input type="" name="${value}" id="${id}" value="${value}" style="${position} background-color: ${style.fillColor}; ${dashed}; border-color: ${style.strokeColor}; padding-left: ${style.spacingLeft}px;">
                                        // <label for="NxeJCdvBE4MFut9FiqpC-1" style="position: absolute; left: ${x}px; top: ${geometry.y}px; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor};">${value}</label>`
                                        return `<select id="${id}">
                                        <option value="${value}">${value}</option>
                                        </select>`;
                                    });
                                    const combo = comboHTML.join("\n");

                                    fs.appendFile(htmlComponent, `\n ${combo}`, function (err) {
                                        // fs.appendFile(appComponent, `<a src="/src/app/${name}/${name}.component.html">${name}</a>`.toLowerCase(), function (err) {
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
                                        // const buttonStyle = style.buttonStyle === "round" ? "border-radius: 15px" : "";
                                        const dashed = style.dashed === "0" ? "border-style: solid" : "";
                                        // const fontStyle = style.fontStyle === "1" ? "font-style: normal" : "";

                                        // return `<button id="${id}" style="border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; text-align: ${style.align}; background-color: ${style.fillColor}; color: ${style.fontColor}; font-size: ${style.fontSize}px; ${fontStyle}; border-color: ${style.strokeColor}; ${buttonStyle}; white-space: ${style.whiteSpace}; ${position}">${value}</button>`;
                                        // return `<input id="${id}" type="text" value="${value}" style="border-width: ${style.strokeWidth}px; box-shadow: ${style.shadow}; ${dashed}; color: ${style.fontColor}; text-align: ${style.align}; font-size: ${style.fontSize}px; padding-left: ${style.spacingLeft}px; padding-top: ${style.spacingTop}px; border-color: ${style.strokeColor}; ${position} box-sizing: border-box;">`;
                                        // return `<input type="" name="${value}" id="${id}" value="${value}" style="${position} background-color: ${style.fillColor}; ${dashed}; border-color: ${style.strokeColor}; padding-left: ${style.spacingLeft}px;">
                                        // <label for="NxeJCdvBE4MFut9FiqpC-1" style="position: absolute; left: ${x}px; top: ${geometry.y}px; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor};">${value}</label>`
                                        return `#${id} {${position} background-color: ${style.fillColor}; border-width: ${style.strokeWidth}px; ${dashed}; border-color: ${style.strokeColor}; text-align: left; font-size: ${style.fontSize}px; color: ${style.fontColor}; padding-left: ${style.spacingLeft}px;}`
                                    });
                                    const csscombo = comboCSS.join("\n");

                                    fs.appendFile(cssComponent, `\n ${csscombo}`, function (err) {
                                        // fs.appendFile(appComponent, `<a src="/src/app/${name}/${name}.component.html">${name}</a>`.toLowerCase(), function (err) {
                                        if (err) throw err;
                                        console.log(`comboBox style added`);
                                    });

                                    break;

                                default:
                                    break;
                            }
                        }
                    }
                    // );
                }, 2000);


                setTimeout(function () {
                    resolve();
                }, 10000);
            }

        });

    });
}


function run() {
    console.log(`Running the application...`);
    execSync('ng serve', { stdio: 'inherit' });
}

create().then(() => {
    run();
});
