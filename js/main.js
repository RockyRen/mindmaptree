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

require(['module/Graph','module/Renderer','module/ToolBar','jquery','bootstrap'],function(Graph, Renderer, ToolBar){
    var $toolBar = $('.toolbar');
    var toolBar = ToolBar($toolBar);

    var gRenderer = new Renderer(toolBar);
    var g = new Graph(gRenderer);



    var obj1 = {
        id: 1,
        parentId: null,
        x: 100,
        y: 100
    };

    var obj2 = {
        id: 8,
        parentId: 1,
        x: 200,
        y: 200
    };

    var obj3 = {
        id: 9,
        parentId: 1,
        x: 200,
        y: 300
    };



/*
    var modules = [obj1,obj2,obj3,
        {
            id: 4,
            parentId: 8,
            x: 400,
            y: 400
        },{
            id: 5,
            parentId: 9,
            x: 400,
            y: 500
        }];*/
    var modules = [{
        id: 1,
        parentId: null,
        x: 400,
        y: 300
    }];

    g.fromJsonObj(modules);

    gRenderer.drawGraph(g);

    $('span.glyphicon-plus').click(function(event){
        //g.nodes[1].translate(100, 100);
        var node = g.addNode({x:400, y:400});
        node.setParent(g.selected);
        node.render();

    });
    /*
    $('span.glyphicon-plus').click(function(event){


        var node = g.addNode({
            x: event.clientX,
            y: event.clientY
        });


        node.setParent(g.selected);


        node.render();


        //e.page相对于文档
        var lastX = event.pageX;
        var lastY = event.pageY;
        var dragging = true;

        $('#mindmap-canvas').mousemove(function(event){

            if(dragging) {
                var dX = event.pageX - lastX;
                var dY = event.pageY - lastY;

                node.translate(dX,dY);

                lastX = event.pageX;
                lastY = event.pageY;
            }


        });

        $('#mindmap-canvas').bind('mouseup',function(event){
            dragging = false;
            g.setSelected(node);
            $(this).unbind('mouseup');
        });

    });*/

    $('span.glyphicon-remove').click(function(event){
        if(g.selected) {
            g.selected.remove();
            g.setSelected(null);
        }
    });








});