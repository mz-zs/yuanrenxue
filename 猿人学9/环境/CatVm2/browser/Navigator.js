var Navigator = function Navigator(){
    debugger;
    throw new TypeError("Illegal constructor");
}; catvm.safefunction(Navigator);

Object.defineProperties(Navigator.prototype,{
    [Symbol.toStringTag]:{
        value : "Navigator",
        configurable: true
    }
})


///////////////////////////////////////////////
Navigator.prototype.plugins = [];
Navigator.prototype.languages = ["zh-CN", "zh"];
Navigator.prototype.appName = 'Netscape'
navigator = {};
navigator.__proto__ = Navigator.prototype;


for (var prototype_ in Navigator.prototype){
    navigator[prototype_] = Navigator.prototype[prototype_];
    Navigator.prototype.__defineGetter__(prototype_, function(){
       throw new TypeError("Illegal constructor")
    })
}

///////////////////////////////////////////////


navigator = catvm.proxy(navigator);


