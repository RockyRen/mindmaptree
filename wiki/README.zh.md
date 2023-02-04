# mindmap-tree

> 一个基于web(svg)的思维导图

![mindmap-tree demo](https://rockyren.github.io/mindmaptree/assets/wiki/demo.jpg)

## Demo
* [Demo](https://rockyren.github.io/mindmaptree/demo.html) 
* [中文Demo](https://rockyren.github.io/mindmaptree/demo.html)

## 安装

```sh
npm install -S mindmap-tree
```

## 使用

html: 
```html
<body>
  <div id="container" style="width:100vh;height:100vh;"></div>
</body>
```

js: 
```js
import MindmapTree from 'mindmap-tree';
import 'mindmap-tree/style.css';

new MindmapTree({
  container: '#container',
});
```

## 功能
* 添加 & 删除节点
* 编辑节点文本
* 撤销 & 重做
* 修改视图scale
* 拖拽改变节点关系
* 键盘操作
* 多选操作
* 展开 & 收缩节点


## 参数

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
