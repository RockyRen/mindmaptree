import React, { useEffect, useState, ChangeEvent } from 'react';
import MindemapTree from './mindmap-tree/index';
import { Direction } from './mindmap-tree/types';
import './index.less';

// todo
let hasMindmapTree = false;

const data = [
  {
    id: '111',
    children: ['222', '333', '444', '777'],
    label: '中心主题',
    direction: null,
    isRoot: true,
  },
  {
    id: '222',
    children: [],
    label: '任务2',
    direction: Direction.RIGHT,
    isRoot: false,
  },
  {
    id: '333',
    children: [],
    label: '任务3',
    direction: Direction.LEFT,
    isRoot: false,
  },
  {
    id: '444',
    children: ['555'],
    label: '任务4',
    direction: Direction.RIGHT,
    isRoot: false,
  },
  {
    id: '555',
    children: [],
    label: '任务5',
    direction: Direction.RIGHT,
    isRoot: false,
  },
  {
    id: '666',
    children: [],
    label: '任务6',
    direction: Direction.RIGHT,
    isRoot: false,
  },
  {
    id: '777',
    children: [],
    label: '任务7',
    direction: Direction.RIGHT,
    isRoot: false,
  },
];

// todo 重构
const App = (): JSX.Element => {
  const [mindmapTree, setMindmapTree] = useState<any>(null);
  const [inputText, setInputText] = useState<string>('');

  useEffect(() => {
    if (!hasMindmapTree) {
      const mindmapTreeTemp = new MindemapTree({
        container: '#mindmap-container',
        data,
        onLabelChange: function(label: string) {
          setInputText(label);
        },
      });
      setMindmapTree(mindmapTreeTemp);
      hasMindmapTree = true;
    }
  }, []);

  const addNode = (): void => {
    mindmapTree.addNode();
  };

  const removeNode = (): void => {
    mindmapTree.removeNode();
  };

  const handleChangeInputText = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputText(event.currentTarget.value);
  };

  const commitText = (): void => {
    mindmapTree.setLabel(inputText);
  }

  return (
    <div className="mindmap">
      <div className="mindmap-main">
        <div className="function-bar">
          <div className="toolbar">
            <button className="toolbar-btn btn btn-default btn-sm btn-success node-plus" onClick={addNode}>添加节点</button>
            <button className="toolbar-btn btn btn-default btn-sm btn-danger node-remove" onClick={removeNode}>删除节点</button>
          </div>
          <div className="tip-box">
            <div className="tip-wrapper">
              <div className="tip-triangle"></div>
              <div className="tip-label"></div>
            </div>
          </div>
          <div className="label-group">
            <input type="text" className="form-control" value={inputText} onChange={handleChangeInputText} />
            <button className="btn btn-default btn-sm" onClick={commitText}>确定</button>
          </div>
        </div>
        <div id="mindmap-container"></div>
      </div>
    </div>
  )
};

export default App;
