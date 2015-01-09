/**
 * Created by rockyren on 14/11/23.
 */
require.config({
    paths: {
        'Raphael': 'packages/bower/raphael/raphael',
        'jquery': 'packages/bower/jquery/dist/jquery',
        'bootstrap': '../bootstrap/js/bootstrap.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        }
    }
});

require(['imp/Graph', 'imp/Renderer', 'jquery', 'bootstrap', 'Raphael'],function(Graph, Renderer){
    var gRenderer = new Renderer('mindmap-canvas', 'toolbar');
    var graph = new Graph(gRenderer);

    //初始化根结点

    var rootNode = graph.addNode({
        x: gRenderer.canvasWidth/2 - 50,
        y: 200
    });

    rootNode.label = '中心主题';
    graph.setRootNode(rootNode);
    graph.root.render();
    gRenderer.setShape(rootNode, {shapeType: 'root'});


    var nodeAdd = document.getElementById('node-add');
    nodeAdd.onclick = function(){
        var node = graph.addNode();
        node.setParent(graph.selected);
        node.render();
    };

    var nodeEdit = document.getElementById('node-edit');
    nodeEdit.onclick = function(){
        alert('edit');
    };

    var nodeCancel = document.getElementById('node-cancel');
    nodeCancel.onclick = function(){
        if(graph.selected){
            if(graph.selected.isRootNode()){
                console.log('cannot cancel root node');
            }else{
                graph.selected.remove();
                graph.setSelected(null);
            }
        }
    }

});