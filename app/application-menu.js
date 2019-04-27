const { app, BrowserWindow, dialog, Menu, Shell } = require('electron');
const mainProcess = require('./main');

const getTemplate = () => {
    const hasOneOrMoreWindows = !!BrowserWindow.getAllWindows().length;
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const hasFilePath = !!(
        focusedWindow && focusedWindow.getRepresentedFilename()
    );
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open File',
                    accelerator: 'CommandOrControl+O',
                    click: (item, focusedWindow) => {
                        if (focusedWindow)
                            return mainProcess.getFileFromUser(focusedWindow);

                        const newWindow = mainProcess.createWindow();

                        newWindow.on('show', () =>
                            mainProcess.getFileFromUser(newWindow)
                        );
                    }
                },
                {
                    label: 'New File',
                    accelerator: 'CommandOrControl+N',
                    click: () => mainProcess.createWindow()
                },
                {
                    label: 'Save File',
                    accelerator: 'CommandOrControl+S',
                    enabled: hasOneOrMoreWindows,
                    click: (item, focusedWindow) => {
                        if (!focusedWindow)
                            return dialog.showErrorBox(
                                'Cannot Save or Export',
                                'There is currently no active document to save or export.'
                            );

                        focusedWindow.webContents.send('save-markdown');
                    }
                },
                {
                    label: 'Export HTML',
                    accelerator: 'Shift+CommandOrControl+S',
                    enabled: hasOneOrMoreWindows,
                    click: (item, focusedWindow) => {
                        if (!focusedWindow)
                            return dialog.showErrorBox(
                                'Cannot Save or Export',
                                'There is currently no active document to save or export.'
                            );

                        focusedWindow.webContents.send('save-html');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Show File',
                    accelerator: 'Shift+CommandOrControl+S',
                    enabled: hasFilePath,
                    click: (item, focusedWindow) => {
                        if (!focusedWindow)
                            return dialog.showErrorBox(
                                "Cannot Show File's Location",
                                'There is currently no active document to show.'
                            );
                        focusedWindow.webContents.send('show-file');
                    }
                },
                {
                    label: 'Open in Default Editor',
                    accelerator: 'Shift+CommandOrControl+D',
                    enabled: hasFilePath,
                    click: (item, focusedWindow) => {
                        if (!focusedWindow)
                            return dialog.showErrorBox(
                                'Cannot Open File in Default Editor',
                                'There is currently no active document to open.'
                            );
                        focusedWindow.webContents.send('open-in-default');
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CommandOrControl+Z',
                    role: 'undo'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CommandOrControl+Z',
                    role: 'redo'
                },
                { type: 'separator' },
                {
                    label: 'Cut',
                    accelerator: 'CommandOrControl+X',
                    role: 'cut'
                },
                {
                    label: 'Copy',
                    accelerator: 'CommandOrControl+C',
                    role: 'copy'
                },
                {
                    label: 'Paste',
                    accelerator: 'CommandOrControl+V',
                    role: 'paste'
                },
                {
                    label: 'Select All',
                    accelerator: 'CommandOrControl+A',
                    role: 'selectall'
                }
            ]
        },
        {
            label: 'Window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'CommandOrControl+M',
                    role: 'minimize'
                },
                {
                    label: 'Close',
                    accelerator: 'CommandOrControl+W',
                    role: 'close'
                }
            ]
        },
        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'Visit Website',
                    click: () => {
                        /* To be implemented */
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    click: (item, focusedWindow) => {
                        if (focusedWindow)
                            focusedWindow.webContents.toggleDevTools();
                    }
                }
            ]
        }
    ];

    const appName = 'Fire Sale';

    const appMenuForMac = {
        label: appName,
        submenu: [
            {
                label: `About ${appName}`,
                role: 'about'
            },
            { type: 'separator' },
            {
                label: 'Services',
                role: 'services'
            },
            { type: 'separator' },
            {
                label: `Hide ${appName}`,
                role: 'hide'
            },
            {
                label: 'Hide Others',
                role: 'hideothers'
            },
            {
                label: 'Show All',
                role: 'unhide'
            },
            { type: 'separator' },
            {
                label: `Quit ${appName}`,
                role: 'quit'
            }
        ]
    };

    if (process.platform === 'darwin') template.unshift(appMenuForMac);

    const windowMenu = template.find(item => item.label === 'Window');
    windowMenu.role = 'window';
    windowMenu.submenu.push(
        { type: 'separator' },
        {
            label: 'Bring All to Front',
            role: 'front'
        }
    );

    return template;
};

const createApplicationMenu = () =>
    Menu.setApplicationMenu(Menu.buildFromTemplate(getTemplate()));

module.exports = createApplicationMenu;
