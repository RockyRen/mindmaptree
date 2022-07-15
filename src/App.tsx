import React, { useEffect, useState, ChangeEvent } from 'react';
// @ts-ignore
import Graph from './libs/Graph/index';
// @ts-ignore
import Renderer from './libs/Renderer/index';
import './index.less';

// todo 重构
const App = (): JSX.Element => {
  const [graph, setGraph] = useState(null);
  const [inputText, setInputText] = useState<string>('');

  useEffect(() => {
    const graph = new Graph();
    const renderer = new Renderer({
      canvasId: 'mindmapCanvas',
      canvasClickCb: () => {
        setInputText('');
      },
      nodeClickCb: (label: string) => {
        setInputText(label);
      }
    }, {
      setSelected: graph.setSelected.bind(graph),
      getParentAddableNodeSet: graph.getParentAddableNodeSet.bind(graph),
      getSelected: graph.getSelected.bind(graph),
      getNodes: graph.getNodes.bind(graph),
      setParent: graph.setParent.bind(graph)
    });
    graph.init(renderer);

    setGraph(graph);
  }, []);

  const addNode = (): void => {
    // @ts-ignore
    graph?.addNode();
  };

  const removeNode = (): void => {
    // @ts-ignore
    graph?.removeNode();
  };

  const handleChangeInputText = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputText(event.currentTarget.value);
  };

  const commitText = (): void => {
    // @ts-ignore
    graph?.setLabel(inputText);
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

        <div id="mindmapCanvas"></div>
      </div>
    </div>
  )
};

export default App;
