const { app, autoUpdater, dialog, BrowserWindow } = require('electron');

const isDevelopment = app.getPath('exe').indexOf('electron') !== -1;

const baseUrl = 'https://firesale-releases.glitch.me';

const platform = process.platform;
const currentVersion = app.getVersion();

const releaseFeed = `${baseUrl}/releases/${platform}?currentVersion=${currentVersion}`;

if (isDevelopment)
    console.info('[AutoUpdator]', 'In Development Mode. Skipping...');
else {
    console.info('[AutouUpdater]', `Setting release feed to ${releaseFeed}`);
    autoUpdater.setFeedURL(releaseFeed);
}

autoUpdater.addListener('update-available', () => {
    dialog.showMessageBox(
        {
            type: 'question',
            buttons: ['Install & Realunch', 'Not Now'],
            defaultId: 0,
            message: `${app.getName()} has been updated!`,
            detail: 'An update has been downloaded and can be installed now.'
        },
        response => {
            if (response === 0)
                setTimeout(() => {
                    app.removeAllListeners('windows-all-closed');
                    BrowserWindow.getAllWindows().forEach(win => win.close());
                    autoUpdater.quitAndInstall();
                }, 0);
        }
    );
});

module.exports = autoUpdater