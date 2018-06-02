// 遍历对象
export function forEach(obj, cb) {
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            cb(obj[key]);
        }
    }
}