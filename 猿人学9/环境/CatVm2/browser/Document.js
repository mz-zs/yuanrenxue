var Document = function Document(){
    
}; catvm.safefunction(Document);

Object.defineProperties(Document.prototype,{
    [Symbol.toStringTag]:{
        value : "Document",
        configurable: true
    }
});
document = {};
document.__proto__ = Document.prototype;
///////////////////////////////////////////////
document.getElementById = function getElementById(id){
    debugger;
    return null;
};catvm.safefunction(document.getElementById);

///////////////////////////////////////////////

document = catvm.proxy(document);