const { app, BrowserWindow } = require("electron");
const path = require("path");

const server = require("./index.js");

let serverClosed = false;

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "Music Blocks",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: true,
            enableRemoteModule: false
        }
    });

    win.loadURL("http://127.0.0.1:3000");
}

app.whenReady().then(async () => {
    await server.startServer();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}).catch(error => {
    console.error("Failed to start Music Blocks:", error);
    app.quit();
});

app.on("before-quit", event => {
    if (serverClosed) return;

    event.preventDefault();
    server.closeServer().finally(() => {
        serverClosed = true;
        app.quit();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
