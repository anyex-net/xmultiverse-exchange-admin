// 导入模块
import {app, BrowserWindow} from 'electron'
// const { app, BrowserWindow } = require('electron')
import path from 'path'
const NODE_ENV = process.env.NODE_ENV
// const path = require('path')
// 创建主窗口
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        center: true, // 窗口居中显示
        frame: true, //是否显示顶部导航，去掉关闭按钮 最大化最小化按钮
        // titleBarStyle: "hidden", //Windows下创建的窗口是否带边框
        // frame: false, // 隐藏默认标题栏和边框
        titleBarStyle: "hiddenInset", // MacOS下使用内嵌式无边框样式
        resizable: true, // 不允许用户调整窗口大小
        // fullscreen: true, // 设置全屏
        // backgroundColor: "#02243B", //窗口背景

        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true, //开启true这一步很重要,目的是为了vue文件中可以引入node和electron相关的API
            contextIsolation: true, // 可以使用require方法 // 是否在独立 JavaScript 环境中运行
            enableRemoteModule: true, // 可以使用remote方法
            webSecurity: false, // 它将禁用同源策略 (通常用来测试网站), 如果此选项不是由开发者设置的默认为true
            defaultMonospaceFontSize: 16, //页面字体默认为16
            minimumFontSize: 12, //页面字体最小为12
        }
    })

    // 和自己本地vue项目启动的地址保持一致

    mainWindow.loadURL('http://112.14.45.72:8890')

    // mainWindow.loadURL(
    //     NODE_ENV === 'development' ? 'http://121.41.226.80:10002' : 'http://192.168.1.20:3003/'
    // );
    if (NODE_ENV === "development") {
        mainWindow.webContents.openDevTools()
    }

}

// 应用准备就绪，加载窗口
app.whenReady().then(() => {
    createWindow()

    // mac 上默认保留一个窗口
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 关闭所有窗口 ： 程序退出 ： windows & linux
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
