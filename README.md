# Desmos Desktop 桌面版
Desmos 是一款基于JavaScript开发的先进数学函数图形计算器，提供网页版和移动版应用。本项目使用Electron框架构建跨平台离线桌面版本，支持函数绘图、本地保存、截图导出等功能，内置示例文件于`'examples'`目录。

<img src="./res/app.png" width="600"/>

## 安装指南
已编译的二进制文件发布在Release页面，目前提供Windows和Linux(Ubuntu)版本。如需macOS或其他平台版本，请通过源码编译。

安装后可使用软件打开`'examples'`目录中的.des示例文件。

## 编译指南
```bash
git clone https://github.com/DingShizhe/Desmos-Desktop.git
cd Desmos-Desktop
npm install -d
npm run dist
cd dist && ls   # 生成的可执行文件位于此目录
```
Linux系统需手动编辑`./res/appimagekit-desmos.desktop`文件并放置于`./local/share/applications`目录。

## 依赖环境
- Node.js 运行环境
- Electron 框架
- Desmos API 图形引擎
## 功能特性
- 完整实现Web版核心绘图功能
- 支持PNG格式图形导出
- 本地工程文件保存/加载（.des格式，基于JSON）
- 消息提示淡出效果
- 新建/关闭未保存文件时提示
- 自动加载最近打开的文件
- 提供`examples/getDesByUrl.py`工具下载Desmos官网作品
## 示例作品
打开'examples'目录中的.des文件查看以下作品：

<img src="res/Cardioid.png" width="200"/> <img src="res/Folded Conic Section.png" width="200"/> <img src="res/Folded Conic Section2.png" width="200"/>

<img src="res/Folded Conic Section3.png" width="200"/> <img src="res/Brain.png" width="200"/> <img src="res/Mobius2.png" width="200"/>

<img src="res/Mobius.png" width="200"/> <img src="res/Astroid.png" width="200"/> <img src="res/Powerpuff Grils.png" width="200"/>



希望本工具能为您的工作学习带来便利，欢迎体验！ ;)