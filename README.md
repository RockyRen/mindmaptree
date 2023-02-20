<h1 align="center">
  Mindmap-Tree
</h1>

<h3 align="center">
  A Web-Based Javascript Mindmap
</h3>

<p align="center">
  <a href="https://www.npmjs.org/package/x-data-spreadsheet">
    <img src="https://img.shields.io/npm/v/mindmap-tree" alt="npm" />
  </a>
  <a href="https://github.com/RockyRen/mindmaptree">
    <img src="https://img.shields.io/github/license/RockyRen/mindmaptree" alt="ci" />
  </a>

</p>

<p align="center">
  <a href="https://github.com/RockyRen/mindmaptree/blob/master/wiki/README.zh.md">简体中文文档</a>
</p>

[![mindmap-tree demo](https://rockyren.github.io/mindmaptree/assets/wiki/demo.jpg)](https://rockyren.github.io/mindmaptree/demo.html)


## Demo
[Demo](https://rockyren.github.io/mindmaptree/demo.html) 


## Feature

* Add & Delete Node
* Edit Node Text
* Undo & Redo
* Change Scale
* Drag Node to change Father
* Keyboard operation
* Multi select
* Expand & Shrink Node


## Get Started

### Installation

```sh
npm install -S mindmap-tree
```

### Usage

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

### Params

MindmapTree constructor options:

| Prop          |       Type        | Default                  | Description               |
| ------------- | :---------------: | ------------------------ | ------------------------- |
| **container** | String \| Element | ''                       | HTML element of container |
| **data**      |    NodeDataMap    | Record<string, NodeData> | Initial data of mindmap   |
| **isDebug**   |      Boolean      | false                    | Is debug or not           |

NodeData params: 

| Prop          |   Type   | Default | Description                              |
| ------------- | :------: | ------- | ---------------------------------------- |
| **label**     |  String  | ''      | Node label                               |
| **direction** |  Number  | 0       | Node direction, 1:right, 0:none, -1:left |
| **isRoot**    | Boolean  | false   | Is root node or not                      |
| **children**  | String[] | []      | children ids                             |
| **isExpand**  | Boolean  | true    | To expand node or not                    |

## License

[MIT](https://github.com/RockyRen/mindmaptree/blob/master/LICENSE)

Copyright (c) 2023 - present, RockyRen
