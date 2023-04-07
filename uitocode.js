const fs = require('fs');
const xmltojson = require('./xmltojson');
const json = xmltojson.parser();

const { execSync } = require('child_process');

// function main() {
//     return new Promise(resolve => {
//         console.log("install");
//         resolve();
//     })

// }

function main() {
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

    // const appComponent = `../${projectName}/src/app/app.component.html`;

    // const text = '<router-outlet></router-outlet>';

    // fs.writeFile(appComponent, text, (err) => {
    //     if (err) throw err;
    //     console.log('Cleared out app.component.html file successfully');
    // });

}


main();