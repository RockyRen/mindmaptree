# Mindmap Tree
一个基于[Raphael.js](http://dmitrybaranovskiy.github.io/raphael/)图形库实现的思维导图

[Demo](https://rockyren.github.io/mindmaptree/index.html)
## 开始
安装依赖包：

```sh
npm install
```

## 开发
```sh
npm start
```

启动后访问 **http://127.0.0.1:8201/index.html**

## 发布
```sh
npm run dist
```

运行上面命令后会在项目目录下生成 **dist** 目录

## 功能介绍
* 增加节点：选择某个节点后，点击增加键可以增加节点
* 删除节点：选择某个节点后，点击删除键可以删除节点
* 拖动节点改变父子关系：拖动A节点到B节点上，可将A节点设为B节点的子节点
* 节点文本编辑：在输入框中输入文本后，点击确定即可修改节点文本

## 其他
* 仅供学习使用，问题比较多，请勿直接运用到生产环境上
* 如要查看旧版本，就点击[这里](https://github.com/RockyRen/mindmaptree/tree/v1)

## License

[MIT](https://github.com/RockyRen/mindmaptree/blob/master/LICENSE)

Copyright (c) 2018 - present, RockyRen