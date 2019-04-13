const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const windows = new Set();

const createWindow = (exports.createWindow = () => {
    let x, y;

    const currentWindow = BrowserWindow.getFocusedWindow();

    if (currentWindow) {
        const [currentWindowX, currentWindowY] = currentWindow.getPosition();
        x = currentWindowX + 10;
        y = currentWindowY + 10;
    }

    let newWindow = new BrowserWindow({ x, y, show: false });

    newWindow.loadFile(path.join(__dirname, 'index.html'));

    newWindow.once('ready-to-show', () => {
        newWindow.webContents.openDevTools();
        newWindow.show();
    });

    newWindow.on('closed', () => {
        windows.delete(newWindow);
        newWindow = null;
    });

    windows.add(newWindow);
    return newWindow;
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') return false;
    app.quit();
});

app.on('activate', (event, hasVisibleWindows) => {
    if (!hasVisibleWindows) createWindow();
})

const getFileFromUser = (exports.getFileFromUser = targetWindow => {
    const files = dialog.showOpenDialog(targetWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Markdown Files', extensions: ['md', 'markdown'] },
            { name: 'Text Files', extensions: ['txt'] }
        ]
    });

    if (files) openFile(targetWindow, files.shift());
});

const openFile = (exports.openFile = (targetWindow, file) => {
    const content = fs.readFileSync(file).toString();
    targetWindow.webContents.send('file-opened', file, content);
});

// let mainWindow = null

// app.on('ready', () => {
//     mainWindow = new BrowserWindow({
//         show: false,
//         // webPreferences: { nodeIntegration: false }
//     })

//     mainWindow.webContents.loadFile(`${__dirname}/index.html`)

//     mainWindow.once('ready-to-show', () => {
//         mainWindow.show()
//         mainWindow.webContents.openDevTools()
//         // getFileFromUser()
//     })

//     mainWindow.on('closed', () => {
//         mainWindow = null
//     })
// })
