import './index.less';
import $ from 'jquery';
import Graph from './libs/Graph';
import Renderer from './libs/Renderer';

var graph = new Graph();
var renderer = new Renderer({
    canvasId: 'mindmapCanvas',
    canvasClickCb: () => {
        $('.label-group input').val('');
        $('.btn').addClass('disabled');
    },
    nodeClickCb: (label) => {
        $('.label-group input').val(label);
        $('.btn').removeClass('disabled');
    }
}, {
    setSelected: graph.setSelected.bind(graph),
    getParentAddableNodeSet: graph.getParentAddableNodeSet.bind(graph),
    getSelected: graph.getSelected.bind(graph),
    getNodes: graph.getNodes.bind(graph),
    setParent: graph.setParent.bind(graph)
});
graph.init(renderer);

$('.node-plus').click(() => {
    graph.addNode();
});


$('.node-cancel').click(() => {
    graph.removeNode();
});

$('.label-group button').click(() => {
    var text = $('.label-group input').val();
    graph.setLabel(text);
});