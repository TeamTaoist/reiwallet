const fs = require('node:fs');

const TstVersion = () =>{

    const data =  fs.readFileSync('../public/version.txt', 'utf8');


    const versionParts = data.split('.');
    const patch = Number(versionParts[2])+1;

    const newVersion = `${versionParts[0]}.${versionParts[1]}.${patch}`;


    fs.writeFileSync('../public/version.txt', newVersion);
}

TstVersion()
