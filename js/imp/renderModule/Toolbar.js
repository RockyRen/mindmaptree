/**
 * Created by rockyren on 14/12/25.
 */
define([], function(){
    var Toolbar = function(aToolbar, aViewBox) {
        var toolbar = document.getElementById(aToolbar);
        var viewBox = aViewBox;
        return {
            setToolbarPosition: function(points, isRoot) {
                //@workaround:是否隐藏部分键
                var rootHideButton = document.getElementsByClassName('root-hide');
                console.log(rootHideButton);
                //console.log(isRoot);
                if(isRoot) {
                    for(var i=0;i<rootHideButton.length;i++){

                        rootHideButton[i].style.display = 'none';
                    }
                }else{
                    for(var i=0;i<rootHideButton.length;i++){

                        rootHideButton[i].style.display = 'inline';
                    }
                }
                if(points) {
                    var left = points.x - viewBox.x;
                    var top = points.y - 38 - viewBox.y;
                    toolbar.style.left = left + 'px';
                    toolbar.style.top = top + 'px';
                    toolbar.style.display = 'block';
                }else{
                    toolbar.style.display = 'none';
                }
            },
            translateToolbar: function(dPoints){
                if(dPoints){
                    var left = parseInt(toolbar.style.left);
                    var top = parseInt(toolbar.style.top);
                    left += dPoints.x;
                    top += dPoints.y;
                    toolbar.style.left = left + 'px';
                    toolbar.style.top = top + 'px';
                }
            }
        }
    };
    return Toolbar;
});