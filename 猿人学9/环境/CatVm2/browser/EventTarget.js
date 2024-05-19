var EventTarget = function EventTarget(){
    debugger;
}; catvm.safefunction(EventTarget);

Object.defineProperties(EventTarget.prototype,{
    [Symbol.toStringTag]:{
        value:"EventTarget",
        configurable:true
    }
}); 

EventTarget.prototype.addEventListener = function addEventListener(){
    debugger;
}; catvm.safefunction(EventTarget.prototype.addEventListener);

EventTarget.prototype.dispatchEvent = function dispatchEvent(){
    debugger;
}; catvm.safefunction(EventTarget.prototype.dispatchEvent);

EventTarget.prototype.removeEventListener = function removeEventListener(){
    debugger;
}; catvm.safefunction(EventTarget.prototype.removeEventListener);

EventTarget = catvm.proxy(EventTarget)