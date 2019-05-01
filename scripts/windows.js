const { createWindowsInstaller } = require('electron-winstaller');
const path = require('path');

const iconPath = path.resolve(__dirname, '../icons/Icon.ico');

const result = createWindowsInstaller({
    title: 'Fire Sale',
    authors: 'Sunggon Park',
    description: "test",
    appDirectory: path.resolve(__dirname, '../build/firesale-win32-x64'),
    outputDirectory: path.resolve(
        __dirname,
        '../build/firesale-win32-x64-installer'
    ),
    iconUrl: iconPath,
    setupIcon: iconPath,
    name: 'FireSale',
    setupExe: 'FireSaleSetup.exe',
    setupMsi: 'FireSaleSetup.msi'
});

result
    .then(() => console.log('Success'))
    .catch(error => console.error('Failed', error));
