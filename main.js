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
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Open devtools if in development mode
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// Create about window
function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About Image Resizers',
        width: 300,
        height: 300,
        resizable: false
    })

    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
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

const aboutMenuOption = {
    label: 'About',
    click: createAboutWindow
};

// Menu template
const menu = [
    ...(isMac ? [
        {
            label: app.getName(),
            submenu: [
                aboutMenuOption,
                {
                    role: 'Quit'
                }
            ]
        }
    ] : []),
    {
        role: 'FileMenu',
    },
    ...(!isMac ? [
        {
            label: 'Help',
            submenu: [
                aboutMenuOption
            ]
        }
    ] : [])
]

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})