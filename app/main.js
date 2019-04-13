const { app, BrowserWindow, dialog } = require('electron')
const fs = require('fs')

let mainWindow = null

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        show: false,
        // webPreferences: { nodeIntegration: false }
    })

    mainWindow.webContents.loadFile(`${__dirname}/index.html`)

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        mainWindow.webContents.openDevTools()
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
})

exports.getFileFromUser = () => {
    const files = dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Markdown Files', extensions: ['md', 'markdown'] },
            { name: 'Text Files', extensions: ['txt'] }
        ]
    })

    const openFile = file => {
        const content = fs.readFileSync(file).toString()
        mainWindow.webContents.send('file-opened', file, content)
    }

    if (files) openFile(files.shift())    
}

