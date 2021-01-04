const fs = require('fs');


exports.dataOfStateCitiesFile = () => {
    let data = fs.readFileSync(`${__dirname}/state_cities.json`);
    return (JSON.parse(data))
}

exports.createEssentialDirectories = () => {
    let uploads = './uploads';
    let admin = `${uploads}/admin`;
   

    if(!fs.existsSync(uploads)){
        fs.mkdirSync(uploads);
        fs.mkdirSync(admin);
    }
    else{
        if(!fs.existsSync(admin)) fs.mkdirSync(admin);  
    }
}
