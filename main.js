const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const resizeImg = require('resize-img');

const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';

let mainWindow;

// Create the main window
function createMainWindow() {
    mainWindow = new BrowserWindow({
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

    // Remove mainWindow from memory on close
    mainWindow.on('closed', () => (mainWindow = null));

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
];

// Respond to ipcRenderer resize
ipcMain.on('resize:image', (e, options) => {
    resizeImage(options);
})

// Resize the image
async function resizeImage({imgPath, width, height, dest}) {
    try {
        const newPath = await resizeImg(fs.readFileSync(imgPath), {width: +width, height: +height});

        // Create filename
        const fileName = path.basename(imgPath);
        
        // Create destination folder if not exist
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        // Write new image to destination
        fs.writeFileSync(path.join(dest, fileName), newPath);

        // Send success to render
        mainWindow.webContents.send('image:done');

        // Open dest folder
        shell.openPath(dest);
    } catch (err) {
        console.log(err);
    }
}

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})