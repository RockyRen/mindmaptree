// 去掉forEach
// 遍历对象
export function forEach(obj: any, cb: any) {
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            cb(obj[key]);
        }
    }
}