const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  copyToClipboard: (text) => ipcRenderer.invoke('clipboard:copy', text),
  getLogo: () => ipcRenderer.invoke('app:getLogo'),
});