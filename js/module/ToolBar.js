/**
 * Created by rockyren on 14/12/21.
 */
define([], function(){
    var ToolBar = function($aToolBar) {
        var $toolBar = $aToolBar;

        return {
            setToolBarPosition: function(points) {
                if(points) {
                    $toolBar.css({
                        left: points.x,
                        top: points.y - 38,
                        display: 'block'
                    });
                }else {
                    $toolBar.css({

                        display: 'none'
                    });
                }
            }
        }
    };

    return ToolBar;

});