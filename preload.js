const os = require('os');
const path = require('path');
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
})

contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
})
