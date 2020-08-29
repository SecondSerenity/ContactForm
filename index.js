#!/usr/bin/env node
let http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

let args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Error: Requires 2 arguments [config_path port]');
    return;
}

let config_path = args[0];
try {
    let stats = fs.lstatSync(config_path);
    if (!stats.isFile()) {
        throw new Error();
    }
} catch(error) {
    console.error('Error: File does not exist -> ' + config_path);
    return;
}

let config;
try {
    config = JSON.parse(fs.readFileSync(config_path));
} catch (error) {
    console.error('Error: Failed to parse config file -> ' + config_path);
    return;
}

let port = args[1];
if (isNaN(port)) {
    console.error('Error: Port value is not a number.');
    return;
}

const app = express();
app.config = config;

app.use(express.json());
app.use(cors());
app.use('/', require('./router'));

let server = http.createServer(app);
server.on('listening', () => {
    console.debug('Listening on port http://localhost:' + port);
});
server.on('error', (err) => {
    console.error(err);
});
server.listen(port);
