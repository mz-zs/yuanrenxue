var History = function History(){
    throw new TypeError("Illegal constructor");
}; catvm.safefunction(History);

Object.defineProperties(History.prototype,{
    [Symbol.toStringTag]:{
        value : "History",
        configurable: true
    }
});
///////////////////////////////////////////////
History.prototype.back = function back(){
    debugger;
};catvm.safefunction(History.prototype.back);
///////////////////////////////////////////////
history = {};
history.__proto__ = History.prototype;


History = catvm.proxy(History);