import{S as i,M as a,g as o}from"./common-fa07d231.js";const l={1:{label:"My Holiday",direction:0,isRoot:!0,children:["2","5","7"]},2:{label:"Morning",direction:1,children:["3","4"]},3:{label:"Read book",direction:1,children:[]},4:{label:"Cook",direction:1,children:[]},5:{label:"Afternoon",direction:1,children:["6"]},6:{label:"Baseball competition",direction:1,children:[]},7:{label:"Evening",direction:-1,children:["8"],isExpand:!1},8:{label:"Happy Dinner",direction:-1,children:[]}},e=new i,r=e.getData()||l,t=new a({container:"#container",isDebug:o("debug")==="1",data:r});t.on("data",n=>{e.save(n)});