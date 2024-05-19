
window = this;
function vmProxy(o)
{
    return new Proxy(
        o,{
            set: function(target,property,value )
            {
                console.log('set',target,property,value);
                return Reflect.set(...arguments);
            },
            get:function(target,property,value)
            {
                console.log('get',target,property,value)
            }
        }
    )
}

window = vmProxy(window)
Object.defineProperties(window,{
    [Symbol.toStringTag]:{
        value:'window',
        configurable:true
    }
});
navigator = vmProxy(class navigator{});
document = vmProxy(class document{});
location = vmProxy(class location{});
screen = vmProxy(class screen{});
location.reload = function reload(){

};func_set_native(location.reload);

;(() => {
    'use strict';
    const $toString = Function.toString
    const myFunction_toString_symbol = Symbol('('.concat('',')_',(Math.random() + '').toString(36)))
    const myToString =function(){
        return typeof this == 'function' && this[myFunction_toString_symbol] || $toString.call(this)
    };
    function set_native(func,key,value){
        Object.defineProperty(func,key,{
            "enumerable":false,
            'configurable':true,
            'writable':true,
            'value':value
        })
    }
    delete Function.prototype['toString']
    set_native(Function.prototype,'toString',myToString)
    set_native(Function.prototype.toString,myFunction_toString_symbol,'function toString(){ [native code] }')
    this.func_set_native = (func) =>{
        set_native(func,myFunction_toString_symbol,`function ${myFunction_toString_symbol,func.name || ''}() { [native code] }`)
    }
}).call(this);
