window = this;


var Window = function Window(){
    throw new TypeError("Illegal constructor");
}; catvm.safefunction(Window);
Object.defineProperties(Window.prototype,{
    [Symbol.toStringTag]:{
        value:"Window",
        configurable:true
    }
}); 
///////////////////////////////////////
window.setTimeout = function setTimeout(x, d){
    //x可能是方法，也可能是文本
    typeof(x) == 'function'?x():undefined;
    typeof(x) == 'string'?eval(x):undefined;
    //正确应该 生成UUID 并且保存到内存；
    return 0;
};catvm.safefunction(window.setTimeout);
Window.prototype.PERSISTENT = 1;
Window.prototype.TEMPORARY = 0;
window.osversion = "win10" ;
window.open = function open(){debugger}; catvm.safefunction(window.open);
window.chrome = catvm.proxy(class chrome{});
///////////////////////////////////////
Window.prototype.__proto__ = WindowProperties.prototype;

window.__proto__ = Window.prototype;

Window = catvm.proxy(Window)
window = catvm.proxy(window)