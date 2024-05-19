var Screen = function Screen(){
    throw new TypeError("Illegal constructor");
}; catvm.safefunction(Screen);

Object.defineProperties(Screen.prototype,{
    [Symbol.toStringTag]:{
        value : "Screen",
        configurable: true
    }
})
///////////////////////////////////////////////
Screen.prototype.availWidth = 1040;
Screen.prototype.availLeft = 0;
Screen.prototype.availTop = 0;
Screen.prototype.availHeight = 1920;
Screen.prototype.colorDepth = 24;


///////////////////////////////////////////////
screen = {};
screen.__proto__ = Screen.prototype;
screen = catvm.proxy(screen);