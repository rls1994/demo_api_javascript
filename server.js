require('dotenv').config();
let fs = require("./core/lib/FileStream.js");

//function that will check all the passed .env variables are set
//if any is missing then it will terminate the server
((names) => {
    let shouldExit = false
    for (let i = 0; i < names.length; i++) {
        if (!process.env[names[i]]) {
            shouldExit = true
            console.log(`Missing ${names[i]} in .env`)
        }
    }
    if (shouldExit) {
        console.log('*************Server Terminates**************')
        process.exit(0)
    }
})([
    'DB_URL',
    'BASE_URL',
    'PORT',
    'APP_NAME',
]);

//creates database connection
(async () =>{
    db =  await require("./core/db");
    await db();
})();


//intialize and start express server
const express = require('express');
const app = express();



//for only http
const http = require("http");
let server = http.createServer(app);

//for only https
/*
const https = require('https');
let options = {
    cert: fileStream.readFileSync(path.join(__dirname, "..", "sslfiles", "ssl.cert")),
    key: fileStream.readFileSync(path.join(__dirname, "..", "sslfiles", "ssl.key")),
    ca: fileStream.readFileSync(path.join(__dirname, "..", "sslfiles", "ssl.ca"))
}
let server = https.createServer(options, app);
*/

//for both http and https
/*
let httpx = require('./httpx');
let options = {
    cert: fileStream.readFileSync(path.join(__dirname, "..", "sslfiles", "ssl.cert")),
    key: fileStream.readFileSync(path.join(__dirname, "..", "sslfiles", "ssl.key")),
    ca: fileStream.readFileSync(path.join(__dirname, "..", "sslfiles", "ssl.ca"))
}
let server = httpx.createServer(options, app);
*/




//require morgan for request logging
const morgan = require("morgan");
app.use(morgan("dev"));

const bodyParser = require('body-parser');

app.use(express.json())
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "Content-Range")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


let appApi = require('./api/routes');

app.use('/uploads/admin', express.static('uploads/admin'));
fs.createEssentialDirectories();

/////////importing state cities/////////////////
let stateCityCtrl = require("./core/controllers/stateCity");
stateCityCtrl.bulkAddStateCities();



app.use('/api/', appApi)
app.get('*', function(req, res) {
    res.status(404).send({
        success: false,
        message: "Not Found",
        data:null
    })
});



    //app.listen(process.env.PORT, () => console.log('Rep Server Running...'))
server.listen(process.env.PORT, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`${process.env.APP_NAME} server started on port ${process.env.PORT}`);
    }
});
