const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin';

// Create the main window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Image Resizers',
        width: isDev ? 1000 : 500,
        height: 600,
        resizable: false
    })

    // Open devtools if in development mode
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// App is ready to serve
app.whenReady().then(() => {
    createMainWindow()

    // Implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

// Menu template
const menu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                click: () => app.quit(),
                accelerator: 'CmdOrCtrl+Q'
            }
        ]
    }
]

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})