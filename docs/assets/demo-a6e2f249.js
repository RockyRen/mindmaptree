import{S as a,M as o,g as e}from"./common-04ac8719.js";const l={1:{label:"My Holiday",direction:0,isRoot:!0,children:["2","5","7"]},2:{label:"Morning",direction:1,children:["3","4"]},3:{label:"Read book",direction:1,children:[]},4:{label:"Cook",direction:1,children:[]},5:{label:"Afternoon",direction:1,children:["6"]},6:{label:"Baseball competition",direction:1,children:[]},7:{label:"Evening",direction:-1,children:["8"],isExpand:!1},8:{label:"Happy Dinner",direction:-1,children:[]}},n=new a("demo"),r=n.getData()||l,t=new o({container:"#container",isDebug:e("debug")==="1",data:r,scale:parseFloat(e("scale"))});t.on("data",i=>{n.save(i)});
