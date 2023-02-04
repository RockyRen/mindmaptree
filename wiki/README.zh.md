<h1 align="center">
  Mindmap-Tree
</h1>

<h3 align="center">
  一个基于web(svg)的思维导图
</h3>

<p align="center">
  <a href="https://www.npmjs.org/package/x-data-spreadsheet">
    <img src="https://img.shields.io/npm/v/mindmap-tree" alt="npm" />
  </a>
  <a href="https://github.com/RockyRen/mindmaptree">
    <img src="https://img.shields.io/github/license/RockyRen/mindmaptree" alt="ci" />
  </a>
</p>

[![mindmap-tree demo](https://rockyren.github.io/mindmaptree/assets/wiki/demo.jpg)](https://rockyren.github.io/mindmaptree/demo.html)

## Demo
[Demo](https://rockyren.github.io/mindmaptree/demo.html) 


## 功能
* 添加 & 删除节点
* 编辑节点文本
* 撤销 & 重做
* 修改视图scale
* 拖拽改变节点关系
* 键盘操作
* 多选操作
* 展开 & 收缩节点


## 开始使用

### 安装

```sh
npm install -S mindmap-tree
```

### 使用

```html
<body>
  <div id="container" style="width:100vh;height:100vh;"></div>
</body>
```

```js
import MindmapTree from 'mindmap-tree';
import 'mindmap-tree/style.css';

new MindmapTree({
  container: '#container',
});
```

### 参数

MindmapTree constructor 参数:

| Prop            | Type    | Default | Description                                            |
|-----------------|:-------:|---------|--------------------------------------------------------|
| **container**       | String \| Element   | ''      |   container的HTML元素     |
| **data** | NodeDataMap   | Record<string, NodeData>      | 思维导图的初始化数据 |
| **isDebug**    | Boolean   | false     | 是否调试  |

NodeData params: 

| Prop            | Type    | Default | Description                                            |
|-----------------|:-------:|---------|--------------------------------------------------------|
| **label**       | String   | ''      | 节点文本          |
| **direction** | Number   |  0  |  节点方向, 1:右边, 0:无, -1:左边    |
| **isRoot**    | Boolean   | false     | 是否根节点  |
| **children**    | String[]   | []     | 子节点的id数组  |
| **isExpand**    | Boolean   | true   | 是否展开节点  |

## License

[MIT](https://github.com/RockyRen/mindmaptree/blob/master/LICENSE)

Copyright (c) 2023 - present, RockyRen
