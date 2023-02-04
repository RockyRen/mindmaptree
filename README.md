<h1 align="center">
  Mindmap-Tree
</h1>

<h3 align="center">
  A Web-Based Javascript Mindmap
</h3>

<p align="center">
  <a href="https://www.npmjs.org/package/x-data-spreadsheet">
    <img src="https://img.shields.io/npm/v/x-data-spreadsheet.svg" alt="npm" />
  </a>
  <a href="https://github.com/RockyRen/mindmaptree">
    <img src="https://img.shields.io/github/license/myliang/x-spreadsheet.svg" alt="ci" />
  </a>
</p>

[![mindmap-tree demo](https://rockyren.github.io/mindmaptree/assets/wiki/demo.jpg)](https://rockyren.github.io/mindmaptree/demo.html)

## Document
* en
* [zh-cn中文](https://github.com/RockyRen/mindmaptree/blob/master/wiki/README.zh.md)

## Demo
* [Demo](https://rockyren.github.io/mindmaptree/demo.html) 
* [中文Demo](https://rockyren.github.io/mindmaptree/demo.html)

## Installation

```sh
npm install -S mindmap-tree
```

## Usage

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

## Feature

* Add & Delete Node
* Edit Node Text
* Undo & Redo
* Change Scale
* Drag Node to change Father
* Keyboard operation
* Multi select
* Expand & Shrink Node


## Params

```js
import MindmapTree from 'mindmap-tree';
import 'mindmap-tree/style.css';

new MindmapTree({
  container: '#container',
  data: {
      '1': {
        label: 'My Holiday', // Node label
        direction: 0,        // Node direction  1: right, 0: none, -1: left
        isRoot: true,        // Is root node of not
        children: ['2', '5', '7'], // children ids
      },
      '2': {
        label: 'Morning',
        direction: 1,
        children: ['3'],
        isExpand: false,    // Is expanding node or not, default value is true
      },
      '3': {
        label: 'Read book',
        direction: 1,
        children: [],
      },
  }
});
```


## License

[MIT](https://github.com/RockyRen/mindmaptree/blob/master/LICENSE)

Copyright (c) 2023 - present, RockyRen
