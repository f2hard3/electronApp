require('dotenv').config();
const { crashReporter } = require('electron');
const req = require('request');
const manifest = require('../package.json');

const host = process.env.HOST;

const config = {
    productName: process.env.PRODUCT_NAME,
    companyName: process.env.COMPANY_NAME,
    submitURL: `${host}${process.env.SUBMIT_API}`,
    uploadToserver: process.env.UPLOAD_TO_SERVER
};

crashReporter.start(config);

const sendUncaughtException = error => {
    const { productName, companyName } = config;
    req.post(`${host}uncaughtexceptions`, {
        form: {
            _productName: productName,
            _companyName: companyName,
            _version: manifest.version,
            process_type: process.type,
            ver: process.versions.electron,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            }
        }
    });
};

process.type === 'browser'
    ? process.on('uncaughtException', sendUncaughtException)
    : window.addEventListener('error', sendUncaughtException);

console.log('[INFO] Crash reporting started.', crashReporter);

module.exports = crashReporter;
