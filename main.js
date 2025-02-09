const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const Store = require('electron-store');
const path = require('path');
const url = require('url');

let safeExit = false;

const store = new Store({
    defaults: {
        // 1000x600 is the default size of our window
        windowSize: [ 1000, 600 ],
        windowPos: [ 200, 200 ], 
        filePath: null
    }
});


function sendReq(msg, data=null) {
    win.webContents.send('mainprocess-request', {msg: msg, data: data});
}


// Window menu template
const menuTemplate = [
    {
        label: '文件',
        submenu : [
            {
                label: '新建', accelerator: 'CmdOrCtrl+N',
                click () {  sendReq('NewFile'); }
            },{
                label: '打开', accelerator: 'CmdOrCtrl+O',
                click () {  sendReq('OpenFile');    }
            },{
                label: '保存', accelerator: 'CmdOrCtrl+S',
                click () {  sendReq('SaveFile');    }
            },{
                label: '另存为', accelerator: 'CmdOrCtrl+Shift+S',
                click () {  sendReq('SaveAsFile');  }
            },{type: 'separator'},{
                label: '导出',
                accelerator: 'CmdOrCtrl+E',
                click () {  sendReq('ExportImage'); }
            }
        ]
    },{
        label: '编辑',
        submenu:[
            {
                label: '撤销', accelerator: 'CmdOrCtrl+Z',
                click () {  sendReq('Undo');    }
            },{
                label: '重做', accelerator: 'CmdOrCtrl+Shift+Z',
                click () {  sendReq('Redo');    }
            },{
                label: '清除', accelerator: 'CmdOrCtrl+Shift+C',
                click () {  sendReq('Clear');    }
            }
        ]
    },{
        label: '视图',
        submenu: [
            // {role: 'reload'},
            // {role: 'forcereload'},
            // {role: 'toggledevtools'},
            // {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    },{
        role: 'help',
        submenu:[
            {
                label: '了解更多',
                accelerator: 'CmdOrCtrl+H',
                click () {
                    createInfoWindow();
                }
            }
        ]
    }
];

// add mac menu (which is a little bit different from Linux/Win)
if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })
}


// Init win
let win;
let infoWin;


function createWindow() {
    // Create browser window

    let pos = store.get('windowPos');
    let x = pos[0];
    let y = pos[1];

    let shape = store.get('windowSize');
    let width = shape[0];
    let height = shape[1];

    win = new BrowserWindow({width: width, height: height, x: x, y: y, icon: path.join(__dirname, '/res/icons/icon.png')});

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    // Open devtool
    // win.webContents.openDevTools();

    const menu = Menu.buildFromTemplate(menuTemplate);

    Menu.setApplicationMenu(menu);

    win.on('resize', () => {
        let size = win.getSize();
        store.set('windowSize', size);
    });

    win.on('move', () => {
        let pos = win.getPosition();
        store.set('windowPos', pos);
    })
    
    win.on('close', (e) => {
        if(!safeExit) {
            e.preventDefault();
            sendReq('Exitting');
        }
    });
}

function createInfoWindow() {
    infoWin = new BrowserWindow({
        width: 400, height: 450,
        resizable: false,
        parent: win,
        icon: path.join(__dirname, '/res/icons/icon.png')
    });
    infoWin.loadURL(url.format({
        pathname: path.join(__dirname, '/src/info.html'),
        protocol: 'file',
        slashes: true
    }));

    // infoWin.webContents.openDevTools();

    infoWin.on('close', (e) => {
        infoWin = null;
    });
}


// Run create window
app.on('ready', createWindow)


// Quit when all windows are closed
app.on('window-all-closed', () => {
    if(process.platform != 'darwin'){
        app.quit();
    }
});


ipcMain.on('renderer-response', (event, arg) => {
    switch(arg.msg) {
      case 'Exit':
        // https://github.com/sindresorhus/electron-store
        safeExit=true;
        app.quit();
        break;
    }
});


ipcMain.on('renderer-request', (event, arg) => {
    switch(arg.msg) {
        case 'TitleChanged':
            store.set('filePath', arg.data);
            // console.log(arg.data);
            break;
        case 'ToInit':
            sendReq("Init", store.get('filePath'));
            break;
        default:
            break;
    }
});
