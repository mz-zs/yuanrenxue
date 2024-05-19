// 框架内存管理，用于解决变量名重复问题
// 调试日志 window.catvm 把框架功能集中管理，

var catvm = {};
// 框架运行内存
catvm.memory = {
    config: {print: true, proxy: true}, // 框架配置：是否打印，是否使用proxy
    htmlelements: {}, // 所有的html节点元素存放位置
    getElementsByTagName: {
        0: {
            nodeName: "SCRIPT"
        },
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {}
    },
    listeners: {}, // 所有事件存放位置
    log: [], // 环境调用日志统一存放点
    storage: {} // localStorage 全局存放点
}; // 默认关闭打印


// 主要用来保护伪造的函数，使其更难被识别

// 主要用来保护伪造的函数，让其更难识破
;
(() => {
    'use strict';
    // 取原型链上的toString
    const $toString = Function.toString;
    // 取方法名 reload
    const myFunction_toString_symbol = Symbol('('.concat('', ')_', (Math.random() + '').toString(36)));
    const myToString = function () {
        return typeof this == 'function' && this[myFunction_toString_symbol] || $toString.call(this);
    };

    function set_native(func, key, value) {
        Object.defineProperty(func, key, {
            "enumerable": false,  // 不可枚举
            "configurable": true, // 可配置
            "writable": true, // 可写
            "value": value
        })
    }

    delete Function.prototype['toString'];// 删除原型链上的toString
    set_native(Function.prototype, "toString", myToString); // 自定义一个getter方法，其实就是一个hook
    //套个娃，保护一下我们定义的toString，避免js对toString再次toString，如：location.reload.toString.toString() 否则就暴露了
    set_native(Function.prototype.toString, myFunction_toString_symbol, "function toString() { [native code] }");
    catvm.safefunction = (func) => {
        set_native(func, myFunction_toString_symbol, `function ${myFunction_toString_symbol, func.name || ''}() { [native code] }`);
    }; //导出函数到globalThis，更改原型上的toSting为自己的toString。这个方法相当于过掉func的toString检测点
}).call(this);

// 日志调试功能
catvm.print = {};
catvm.memory.print = []; // 缓存
catvm.print.log = function () {
    if (catvm.memory.config.print) {
        console.table(catvm.memory.log);

    }
};

catvm.print.getAll = function () { // 列出所有日志
    if (catvm.memory.config.print) {
        console.table(catvm.memory.log);

    }
};
// 框架代理功能

catvm.proxy = function (obj) {
    // Proxy 可以多层代理，即 a = new proxy(a); a = new proxy(a);第二次代理
    // 后代理的检测不到先代理的
    if (catvm.memory.config.proxy == false) {
        return obj
    }
    return new Proxy(obj, {
        set(target, property, value) {
            console.table([{"类型": "set-->", "调用者": target, "调用属性": property, "设置值": value}]);
            catvm.memory.log.push({"类型": "set-->", "调用者": target, "调用属性": property, "设置值": value});
            // console.log("set", target, property, value);
            return Reflect.set(...arguments); //这是一种反射语句，这种不会产生死循环问题
        },
        get(target, property, receiver) {
            console.table([{"类型": "get<--", "调用者": target, "调用属性": property, "获取值": target[property]}]);
            catvm.memory.log.push({
                "类型": "get<--",
                "调用者": target,
                "调用属性": property,
                "获取值": target[property]
            });
            // console.log("get", target, property, target[property]);
            return target[property];  // target中访问属性不会再被proxy拦截，所以不会死循环
        }
    });
}

var EventTarget = function EventTarget() { // 构造函数

};
catvm.safefunction(EventTarget);

// 因为EventTarget是构造函数，而我们要的是原型，因此需要先hook EventTarget.prototype，设置下原型的名字，否则它会使用父亲的名字
Object.defineProperties(EventTarget.prototype, {
    [Symbol.toStringTag]: {
        value: "EventTarget",
        configurable: true
    }
})

EventTarget.prototype.addEventListener = function addEventListener(type, callback, options) {
    debugger; //debugger的意义在于检测到是否检测了该方法
    if (!(type in catvm.memory.listeners)) {
        catvm.memory.listeners[type] = [];
    }
    catvm.memory.listeners[type].push(callback);
    return undefined;
};
catvm.safefunction(EventTarget.prototype.addEventListener);

EventTarget.prototype.dispatchEvent = function dispatchEvent() {
    debugger;
};
catvm.safefunction(EventTarget.prototype.dispatchEvent);

EventTarget.prototype.removeEventListener = function removeEventListener() {
    debugger;
};
catvm.safefunction(EventTarget.prototype.removeEventListener);

// EventTarget = catvm.proxy(EventTarget);
// EventTarget.prototype = catvm.proxy(EventTarget.prototype);
var Node = function Node() {
    throw new TypeError('Illegal constructor');
};
catvm.safefunction(Node);

Object.defineProperties(Node.prototype, {
    [Symbol.toStringTag]: {
        value: 'Node',
        configurable: true
    }
});


Node.prototype.ELEMENT_NODE = 1;

Node.prototype.ATTRIBUTE_NODE = 2;

Node.prototype.TEXT_NODE = 3;

Node.prototype.CDATA_SECTION_NODE = 4;

Node.prototype.ENTITY_REFERENCE_NODE = 5;

Node.prototype.ENTITY_NODE = 6;

Node.prototype.PROCESSING_INSTRUCTION_NODE = 7;

Node.prototype.COMMENT_NODE = 8;

Node.prototype.DOCUMENT_NODE = 9;

Node.prototype.DOCUMENT_TYPE_NODE = 10;

Node.prototype.DOCUMENT_FRAGMENT_NODE = 11;

Node.prototype.NOTATION_NODE = 12;

Node.prototype.DOCUMENT_POSITION_DISCONNECTED = 1;

Node.prototype.DOCUMENT_POSITION_PRECEDING = 2;

Node.prototype.DOCUMENT_POSITION_FOLLOWING = 4;

Node.prototype.DOCUMENT_POSITION_CONTAINS = 8;

Node.prototype.DOCUMENT_POSITION_CONTAINED_BY = 16;

Node.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;

Node.prototype.appendChild = function appendChild() {
    debugger;
};
catvm.safefunction(Node.prototype.appendChild);

Node.prototype.cloneNode = function cloneNode() {
    debugger;
};
catvm.safefunction(Node.prototype.cloneNode);

Node.prototype.compareDocumentPosition = function compareDocumentPosition() {
    debugger;
};
catvm.safefunction(Node.prototype.compareDocumentPosition);

Node.prototype.contains = function contains() {
    debugger;
};
catvm.safefunction(Node.prototype.contains);

Node.prototype.getRootNode = function getRootNode() {
    debugger;
};
catvm.safefunction(Node.prototype.getRootNode);

Node.prototype.hasChildNodes = function hasChildNodes() {
    debugger;
};
catvm.safefunction(Node.prototype.hasChildNodes);

Node.prototype.insertBefore = function insertBefore() {
    debugger;
};
catvm.safefunction(Node.prototype.insertBefore);

Node.prototype.isDefaultNamespace = function isDefaultNamespace() {
    debugger;
};
catvm.safefunction(Node.prototype.isDefaultNamespace);

Node.prototype.isEqualNode = function isEqualNode() {
    debugger;
};
catvm.safefunction(Node.prototype.isEqualNode);

Node.prototype.isSameNode = function isSameNode() {
    debugger;
};
catvm.safefunction(Node.prototype.isSameNode);

Node.prototype.lookupNamespaceURI = function lookupNamespaceURI() {
    debugger;
};
catvm.safefunction(Node.prototype.lookupNamespaceURI);

Node.prototype.lookupPrefix = function lookupPrefix() {
    debugger;
};
catvm.safefunction(Node.prototype.lookupPrefix);

Node.prototype.normalize = function normalize() {
    debugger;
};
catvm.safefunction(Node.prototype.normalize);

Node.prototype.removeChild = function removeChild() {
    debugger;
};
catvm.safefunction(Node.prototype.removeChild);

Node.prototype.replaceChild = function replaceChild() {
    debugger;
};
catvm.safefunction(Node.prototype.replaceChild);

Node.prototype.addEventListener = function addEventListener() {
    debugger;
};
catvm.safefunction(Node.prototype.addEventListener);

Node.prototype.dispatchEvent = function dispatchEvent() {
    debugger;
};
catvm.safefunction(Node.prototype.dispatchEvent);

Node.prototype.removeEventListener = function removeEventListener() {
    debugger;
};
catvm.safefunction(Node.prototype.removeEventListener);

Node = catvm.proxy(Node);
var NodeList = function NodeList() {
    throw new TypeError('Illegal constructor');
};
catvm.safefunction(NodeList);

NodeList.prototype.entries = function entries() {
    debugger;
};
catvm.safefunction(NodeList.prototype.entries);
NodeList.prototype.keys = function keys() {
    debugger;
};
catvm.safefunction(NodeList.prototype.keys);
NodeList.prototype.values = function values() {
    debugger;
};
catvm.safefunction(NodeList.prototype.values);
NodeList.prototype.forEach = function forEach() {
    debugger;
};
catvm.safefunction(NodeList.prototype.forEach);

NodeList.prototype.item = function item() {
    debugger;
};
catvm.safefunction(NodeList.prototype.item);

NodeList = catvm.proxy(NodeList);
var WindowProperties = function WindowProperties() { // 构造函数

};
catvm.safefunction(WindowProperties);

Object.defineProperties(WindowProperties.prototype, {
    [Symbol.toStringTag]: {
        value: "WindowProperties",
        configurable: true
    }
})

// 设置原型的父对象
WindowProperties.prototype.__proto__ = EventTarget.prototype;


window = this;
// debugger;
var Window = function Window() { // 构造函数
    // 容易被检测到的  js可以查看堆栈
    throw new TypeError("Illegal constructor");
};
catvm.safefunction(Window);

Object.defineProperties(Window.prototype, {
    [Symbol.toStringTag]: {
        value: "Window",
        configurable: true
    }
})
Window.prototype.__proto__ = WindowProperties.prototype;
window.__proto__ = Window.prototype;

///////////////////////////// 浏览器代码自动生成部分
Window.prototype.PERSISTENT = 1;
Window.prototype.TEMPORARY = 0;


// v8没有setTimeout，浏览器有，但是浏览器把这个方法放到this下面，伪造v8有这个东西，因此我们需要伪造一下
window.setTimeout = function (x, y) {
    // x可能是方法也可能是文本
    typeof (x) == "function" ? x() : undefined;
    typeof (x) == "string" ? eval(x) : undefined;
    // 正确应该 生成UUID，并且保存到内存
    return 123;
};
catvm.safefunction(window.setTimeout);
// 原型下面可以取这个属性\方法，就直接放原型即可
// 只要是方法就需要catvm.safefunction 进行toSting保护
window.open = function open() {
    debugger;
};
catvm.safefunction(window.open);
// 赋值空对象最好使用这种class chrome{} 形式，而不是 {},因为这样我们可以看名字，并且最好挂上代理
window.chrome = catvm.proxy(class chrome {
});
// 打个debugger，因为我们还不知道js有没有调用该方法，也许只是获取了一下，看有没有该方法呢
// 等它真正调用的时候，我们再补全其参数及返回
window.DeviceOrientationEvent = function DeviceOrientationEvent() {
    debugger;
};
catvm.safefunction(window.DeviceOrientationEvent);
window.DeviceMotionEvent = function DeviceMotionEvent() {
    debugger;
};
catvm.safefunction(window.DeviceMotionEvent);

window.requestAnimationFrame = function requestAnimationFrame(callback) {
    (callback)()

    return 1;
}
window.top = window;
// window.localStorage = class localStorage {
// };
// window.localStorage.getItem = function getItem() {
//     debugger;
// };
// catvm.safefunction(window.localStorage.getItem);
// window.localStorage.setItem = function setItem() {
//     debugger;
// };
// catvm.safefunction(window.localStorage.setItem);
// window.localStorage = catvm.proxy(window.localStorage)
//////////////////////

// debugger;
window = catvm.proxy(window);
Window = catvm.proxy(Window);

var Location = function Location() { // 构造函数
    throw new TypeError("Illegal constructor");
};
catvm.safefunction(Location);

Object.defineProperties(Location.prototype, {
    [Symbol.toStringTag]: {
        value: "Location",
        configurable: true
    }
});
location = {};
location.__proto__ = Location.prototype;

////////// 浏览器代码自动生成部分


////////


location = catvm.proxy(location);


var Navigator = function Navigator() { // 构造函数
    throw new TypeError("Illegal constructor");
};
catvm.safefunction(Navigator);

Object.defineProperties(Navigator.prototype, {
    [Symbol.toStringTag]: {
        value: "Navigator",
        configurable: true
    }
});
navigator = {
    // platform: 'Win32',
    // userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    // maxTouchPoints: 0,
    // onLine: true,
    // mimeTypes: [{
    //     suffixes: "pdf",
    //     type: "application/pdf"
    // }],
    //
    // plugins: [{
    //     "0": {},
    //     "1": {}
    // }]

};
navigator.__proto__ = Navigator.prototype;
////////// 浏览器代码自动生成部分
Navigator.prototype.appName = 'Netscape';
Navigator.prototype.plugins = [];
Navigator.prototype.languages = ["zh-CN", "zh"];
Navigator.prototype.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36';
Navigator.prototype.platform = 'Win32';
Navigator.prototype.maxTouchPoints = 0;
Navigator.prototype.onLine = true;
Navigator.prototype.mimeTypes = [{
    suffixes: "pdf",
    type: "application/pdf"
}];
Navigator.prototype.plugins = [{
    "0": {},
    "1": {}
}];
//上面是定义原型的属性
// navigator比较特殊，它会把属性继续定义到 静态属性中，所以我们也做一下
for (var _prototype in Navigator.prototype) {
    navigator[_prototype] = Navigator.prototype[_prototype]; // 将原型上的方法复制一遍给实例
    if (typeof (Navigator.prototype[_prototype]) != "function") {
        // 相当于Object.defineProperty的get方法，Proxy的get方法，hook原型上的所有方法属性
        Navigator.prototype.__defineGetter__(_prototype, function () {
            debugger;
            var e = new Error();
            e.name = "TypeError";
            e.message = "Illegal constructor";
            e.stack = "VM988:1 Uncaught TypeError: Illegal invocation \r\n " +
                "at <anonymous>:1:21";
            throw e;
            // throw new TypeError("Illegal constructor");
        });
    }
}
////////


navigator = catvm.proxy(navigator);


// 从浏览器中知道History是全局的，且原型链只是一层，因此比较好伪造（window有多层所以要伪造多层）
// 浏览器中new会报错，因此我们此处也需要报错
var History = function History() { // 构造函数
    throw new TypeError("Illegal constructor");
};
catvm.safefunction(History);
// 浏览器
Object.defineProperties(History.prototype, {
    [Symbol.toStringTag]: {
        value: "History",
        configurable: true
    }
});

history = {
    length: 1,
};
history.__proto__ = History.prototype;
////////// 浏览器代码自动生成部分
History.prototype.back = function back() {
    debugger;
};
catvm.safefunction(History.prototype.back);
////////
// 浏览器中history是全局的，因此我们也需要定义一个history

history = catvm.proxy(history);


// 从浏览器中知道Screen是全局的，且原型链只是一层，因此比较好伪造（window有多层所以要伪造多层）
// 浏览器中new会报错，因此我们此处也需要报错
var Screen = function Screen() { // 构造函数
    throw new TypeError("Illegal constructor");
};
catvm.safefunction(Screen);
// 浏览器
Object.defineProperties(Screen.prototype, {
    [Symbol.toStringTag]: {
        value: "Screen",
        configurable: true
    }
});
screen = {};
screen.__proto__ = Screen.prototype;
////////// 浏览器代码自动生成部分

////////
// 浏览器中screen是全局的，因此我们也需要定义一个screen

screen = catvm.proxy(screen);


// 从浏览器中知道Storage是全局的，且原型链只是一层，因此比较好伪造（window有多层所以要伪造多层）
// 浏览器中new会报错，因此我们此处也需要报错
var Storage = function Storage() { // 构造函数
    throw new TypeError("Illegal constructor");
};
catvm.safefunction(Storage);
// 浏览器
Object.defineProperties(Storage.prototype, {
    [Symbol.toStringTag]: {
        value: "Storage",
        configurable: true
    }
});
var localStorage = {};
localStorage.__proto__ = Storage.prototype;

////////// 浏览器代码自动生成部分

function get_length() {
    return Object.keys(catvm.memory.storage).length;
}

Storage.prototype.length = get_length();

Storage.prototype.key = function key(index) {
    return Object.keys(catvm.memory.storage)[index];
};
catvm.safefunction(Storage.prototype.key);

Storage.prototype.getItem = function getItem(keyName) {
    var result = catvm.memory.storage[keyName];
    if (result) {
        return result;
    } else {
        return null;
    }
};
catvm.safefunction(Storage.prototype.getItem);

Storage.prototype.setItem = function setItem(keyName, keyValue) {
    catvm.memory.storage[keyName] = keyValue;
};
catvm.safefunction(Storage.prototype.setItem);

Storage.prototype.removeItem = function removeItem(keyName) {
    delete catvm.memory.storage[keyName];
};
catvm.safefunction(Storage.prototype.removeItem);

Storage.prototype.clear = function clear() {
    catvm.memory.storage = {};
};
catvm.safefunction(Storage.prototype.clear);


////////

// 代理一般挂在实例上
localStorage = catvm.proxy(localStorage);
Storage = catvm.proxy(Storage);


var CSSStyleDeclaration = function CSSStyleDeclaration() {
    throw new TypeError('Illegal constructor');
};
catvm.safefunction(CSSStyleDeclaration);

Object.defineProperties(CSSStyleDeclaration.prototype, {
    [Symbol.toStringTag]: {
        value: 'CSSStyleDeclaration',
        configurable: true

    }
});

CSSStyleDeclaration.prototype.__proto__ = Object.prototype
// 存储一些值，避免污染全局变量空间
catvm.memory.mimetype = {};

var MimeType = function MimeType() { // 构造函数
    throw new TypeError("Illegal constructor");
};
catvm.safefunction(MimeType);

Object.defineProperties(MimeType.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeType",
        configurable: true
    },
});

////////// 浏览器代码自动生成部分
MimeType.prototype.description = "";
MimeType.prototype.enabledPlugin = null;
MimeType.prototype.suffixes = "";
MimeType.prototype.type = "";

for (var _prototype in MimeType.prototype) {
    if (typeof (MimeType.prototype[_prototype]) != "function") {
        // 相当于Object.defineProperty的get方法，Proxy的get方法，hook原型上的所有方法属性
        MimeType.prototype.__defineGetter__(_prototype, function () {
            throw new TypeError("Illegal constructor");
        });
    }
}

////////
catvm.memory.mimetype.new = function (data, initPlugin) {
    var mimetype = {};
    if (data != undefined) {
        mimetype.description = data.description;
        mimetype.enabledPlugin = initPlugin; // plugin实例
        mimetype.suffixes = data.suffixes;
        mimetype.type = data.type;
    }
    // 先赋完值，在指向原型
    mimetype.__proto__ = MimeType.prototype;
    return mimetype;
};

// 代理一般挂在实例上
navigator.plugins = catvm.proxy(navigator.plugins);


// 存储一些值，避免污染全局变量空间
catvm.memory.plugin = {};

var Plugin = function Plugin() { // 构造函数
    throw new TypeError("Illegal constructor");
};
catvm.safefunction(Plugin);


catvm.memory.plugin.iterator = function values() {
    // debugger;
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return {value: tmp, done: tmp == undefined};
        },
        self_: this
    }
};
catvm.safefunction(catvm.memory.plugin.iterator);

Object.defineProperties(Plugin.prototype, {
    [Symbol.toStringTag]: {
        value: "Plugin",
        configurable: true
    },
    // 原型上多了个这个,里面是个方法
    [Symbol.iterator]: {
        value: catvm.memory.plugin.iterator,
        configurable: true
    }
});

////////// 浏览器代码自动生成部分
Plugin.prototype.name = "";
Plugin.prototype.filename = "";
Plugin.prototype.description = "";
Plugin.prototype.length = 0;
Plugin.prototype.item = function item(index) {
    // debugger;
    return this[index];
};
catvm.safefunction(Plugin.prototype.item);
Plugin.prototype.namedItem = function namedItem(key) {
    // debugger;
    return this[key];
};
catvm.safefunction(Plugin.prototype.namedItem);


for (var _prototype in Plugin.prototype) {
    if (typeof (Plugin.prototype[_prototype]) != "function") {
        // 相当于Object.defineProperty的get方法，Proxy的get方法，hook原型上的所有方法属性
        Plugin.prototype.__defineGetter__(_prototype, function () {
            // this是实例
            throw new TypeError("Illegal constructor");
            // return this[pr];
        });
    }
}
/*
{ name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format',MimeTypes:[{"description": "Portable Document Format","suffixes": "pdf","type": "application/pdf"},{"description": "xxxxx","suffixes": "xxxxpdf","type": "xxxxapplication/pdf"}]}
 */
////////
catvm.memory.plugin.new = function (data) {
    var plugin = {};
    if (data != undefined) {
        plugin.description = data.description;
        plugin.filename = data.filename;
        plugin.name = data.name;
        // MimeType
        if (data.MimeTypes != undefined) {
            for (let index = 0; index < data.MimeTypes.length; index++) {
                var mimetypedata = data.MimeTypes[index];
                var mimetype = catvm.memory.mimetype.new(mimetypedata, plugin);
                plugin[index] = mimetype;
                // mimetype.type浏览器显示的是灰色名称，下面这种添加属性会是亮的，因此我们需要换一种添加方式
                // plugin[mimetype.type] = mimetype;
                Object.defineProperty(plugin, mimetype.type, {
                    value: mimetype,
                    writable: true // 是否可以改变
                });
            }

            plugin.length = data.MimeTypes.length;
        }
    }
    // 先赋完值，在指向原型
    plugin.__proto__ = Plugin.prototype;
    return plugin;
};

// 代理一般挂在实例上
navigator.plugins = catvm.proxy(navigator.plugins);


// 存储一些值，避免污染全局变量空间
catvm.memory.PluginArray = {};

var PluginArray = function PluginArray() { // 构造函数
    throw new TypeError("Illegal constructor");
};
catvm.safefunction(PluginArray);


catvm.memory.PluginArray.iterator = function values() {
    // debugger;
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return {value: tmp, done: tmp == undefined};
        },
        self_: this
    }
};
catvm.safefunction(catvm.memory.plugin.iterator);

Object.defineProperties(PluginArray.prototype, {
    [Symbol.toStringTag]: {
        value: "PluginArray",
        configurable: true
    },
    // 原型上多了个这个,里面是个方法
    [Symbol.iterator]: {
        value: catvm.memory.PluginArray.iterator,
        configurable: true
    }
});
// PluginArray实例, PluginArray这个虽然跟Plugin很像，但是无需被new，浏览器一开始就有该实例 navigator.plugins
catvm.memory.PluginArray._ = {};

////////// ///////////////////浏览器代码自动生成部分
PluginArray.prototype.length = 0;
PluginArray.prototype.item = function item(index) {
    // debugger;
    return this[index];
};
catvm.safefunction(PluginArray.prototype.item);
PluginArray.prototype.namedItem = function namedItem(key) {
    // debugger;
    return this[key];
};
catvm.safefunction(PluginArray.prototype.namedItem);

PluginArray.prototype.refresh = function refresh() {
    debugger;
};
catvm.safefunction(PluginArray.prototype.refresh);

// 适用于 调用原型的属性会抛出异常的对象
for (var _prototype in PluginArray.prototype) {
    if (typeof (PluginArray.prototype[_prototype]) != "function") {
        // 相当于Object.defineProperty的get方法，Proxy的get方法，hook原型上的所有方法属性
        PluginArray.prototype.__defineGetter__(_prototype, function () {
            // this是实例
            throw new TypeError("Illegal constructor");
            // return this[pr];
        });
    }
}
/*
{ name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format',MimeTypes:[{"description": "Portable Document Format","suffixes": "pdf","type": "application/pdf"},{"description": "xxxxx","suffixes": "xxxxpdf","type": "xxxxapplication/pdf"}]}
 */
///////////////////////
catvm.memory.PluginArray.ls = [
    {
        "name": "PDF Viewer",
        "filename": "internal-pdf-viewer",
        "description": "Portable Document Format",
        "MimeTypes": [
            {
                "description": "Portable Document Format",
                "suffixes": "pdf",
                "type": "application/pdf"
            },
            {
                "description": "Portable Document Format",
                "suffixes": "pdf",
                "type": "text/pdf"
            }
        ]
    },
    {
        "name": "Chrome PDF Viewer",
        "filename": "internal-pdf-viewer",
        "description": "Portable Document Format",
        "MimeTypes": [
            {
                "description": "Portable Document Format",
                "suffixes": "pdf",
                "type": "application/pdf"
            },
            {
                "description": "Portable Document Format",
                "suffixes": "pdf",
                "type": "text/pdf"
            }
        ]
    },
    {
        "name": "Chromium PDF Viewer",
        "filename": "internal-pdf-viewer",
        "description": "Portable Document Format",
        "MimeTypes": [
            {
                "description": "Portable Document Format",
                "suffixes": "pdf",
                "type": "application/pdf"
            },
            {
                "description": "Portable Document Format",
                "suffixes": "pdf",
                "type": "text/pdf"
            }
        ]
    },
    {
        "name": "Microsoft Edge PDF Viewer",
        "filename": "internal-pdf-viewer",
        "description": "Portable Document Format",
        "MimeTypes": [
            {
                "description": "Portable Document Format",
                "suffixes": "pdf",
                "type": "application/pdf"
            },
            {
                "description": "Portable Document Format",
                "suffixes": "pdf",
                "type": "text/pdf"
            }
        ]
    },
    {
        "name": "WebKit built-in PDF",
        "filename": "internal-pdf-viewer",
        "description": "Portable Document Format",
        "MimeTypes": [
            {
                "description": "Portable Document Format",
                "suffixes": "pdf",
                "type": "application/pdf"
            },
            {
                "description": "Portable Document Format",
                "suffixes": "pdf",
                "type": "text/pdf"
            }
        ]
    }
]


for (let index = 0; index < catvm.memory.PluginArray.ls.length; index++) {
    let tmp_plugin = catvm.memory.plugin.new(catvm.memory.PluginArray.ls[index]);
    catvm.memory.PluginArray._[index] = tmp_plugin;
    // mimetype.type浏览器显示的是灰色名称，下面这种添加属性会是亮的，因此我们需要换一种添加方式
    Object.defineProperty(catvm.memory.PluginArray._, tmp_plugin.name, {
        value: tmp_plugin,
    });
}
catvm.memory.PluginArray._.length = catvm.memory.PluginArray.ls.length;

catvm.memory.PluginArray._.__proto__ = PluginArray.prototype;
// 代理一般挂在实例上
catvm.memory.PluginArray._ = catvm.proxy(catvm.memory.PluginArray._);
// 依赖注入
navigator.plugins = catvm.memory.PluginArray._;

// 存储一些值，避免污染全局变量空间
catvm.memory.MimeTypeArray = {};
// MimeTypeArray实例,MimeTypeArray这个虽然跟MimeType很像，但是无需被new，浏览器一开始就有该实例 navigator.mimeTypes
catvm.memory.MimeTypeArray._ = {};


var MimeTypeArray = function MimeTypeArray() { // 构造函数
    throw new TypeError("Illegal constructor");
};
catvm.safefunction(MimeTypeArray);


catvm.memory.MimeTypeArray.iterator = function values() {
    debugger;
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return {value: tmp, done: tmp == undefined};
        },
        self_: this
    }
};
catvm.safefunction(catvm.memory.MimeTypeArray.iterator);

Object.defineProperties(MimeTypeArray.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeTypeArray",
        configurable: true
    },
    // 原型上多了个这个,里面是个方法
    [Symbol.iterator]: {
        value: catvm.memory.MimeTypeArray.iterator,
        configurable: true
    }
});

////////// ///////////////////浏览器代码自动生成部分
MimeTypeArray.prototype.length = 0;
MimeTypeArray.prototype.item = function item(index) {
    // debugger;
    return this[index];
};
catvm.safefunction(MimeTypeArray.prototype.item);
MimeTypeArray.prototype.namedItem = function namedItem(key) {
    // debugger;
    return this[key];
};
catvm.safefunction(MimeTypeArray.prototype.namedItem);


// 适用于 调用原型的属性会抛出异常的对象
for (var _prototype in MimeTypeArray.prototype) {
    if (typeof (MimeTypeArray.prototype[_prototype]) != "function") {
        // 相当于Object.defineProperty的get方法，Proxy的get方法，hook原型上的所有方法属性
        MimeTypeArray.prototype.__defineGetter__(_prototype, function () {
            // this是实例
            throw new TypeError("Illegal constructor");
            // return this[pr];
        });
    }
}
///////////////////////
// catvm.memory.MimeTypeArray.ls = []  // 所有MimeType存放点
// 遍历 PluginArray实例里面的所有Plugin实例
catvm.memory.MimeTypeArray.mimetype_count = 0;
catvm.memory.MimeTypeArray.mimetype_types = {}; // 所有MimeType.type存放点
for (let index = 0; index < catvm.memory.PluginArray._.length; index++) {
    let tmp_plugin = catvm.memory.PluginArray._[index];
    // 遍历 Plugin实例里面的所有MimeType实例，增加到 MimeTypeArray中
    for (let m_index = 0; m_index < tmp_plugin.length; m_index++) {
        let tmp_mimetype = tmp_plugin.item(m_index);
        // catvm.memory.MimeTypeArray.ls.push(tmp_mimetype);
        if (!(tmp_mimetype.type in catvm.memory.MimeTypeArray.mimetype_types)) {
            catvm.memory.MimeTypeArray.mimetype_types[tmp_mimetype.type] = 1;
            catvm.memory.MimeTypeArray._[catvm.memory.MimeTypeArray.mimetype_count] = tmp_mimetype;
            catvm.memory.MimeTypeArray.mimetype_count += 1;
            // mimetype.type浏览器显示的是灰色名称，下面这种添加属性会是亮的，因此我们需要换一种添加方式
            Object.defineProperty(catvm.memory.MimeTypeArray._, tmp_mimetype.type, {
                value: tmp_mimetype,
            });
        }
    }
}
catvm.memory.MimeTypeArray._.length = catvm.memory.MimeTypeArray.mimetype_count;

catvm.memory.MimeTypeArray._.__proto__ = MimeTypeArray.prototype;
// 依赖注入
navigator.mimeTypes = catvm.memory.MimeTypeArray._;
// 代理一般挂在实例上
navigator.mimeTypes = catvm.proxy(navigator.mimeTypes)
var HTMLDivElement = function HTMLDivElement() { // 构造函数
    throw new TypeError("Illegal constructor");
};
catvm.safefunction(HTMLDivElement);

Object.defineProperties(HTMLDivElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDivElement",
        configurable: true
    }
});
////////// 浏览器代码自动生成部分
HTMLDivElement.prototype.className = function className() {
    debugger;
};

HTMLDivElement.prototype.getAttribute = function getAttribute() {
    debugger;
};
HTMLDivElement.prototype.parentNode = function parentNode() {
    debugger;
};

HTMLDivElement.prototype.appendChild = function appendChild() {
    debugger;
};


////////


// 用户创建div
// catvm.memory.htmlelements["div"] = function () {
//     var div = new (function () {});
//     //////////////////////////////////////////
//     div.align = "";
//     /////////////////////////
//     div.__proto__ = HTMLDivElement.prototype;
//     return div;
// }


var HTMLCollection = function HTMLCollection() {
    throw new TypeError('Illegal constructor');
};
catvm.safefunction(HTMLCollection);

Object.defineProperties(HTMLCollection.prototype, {
    [Symbol.toStringTag]: {
        value: 'HTMLCollection',
        configurable: true
    }
});
var HTMLScriptElement = function HTMLScriptElement() {
    throw new TypeError('Illegal constructor');
};
catvm.safefunction(HTMLScriptElement);

Object.defineProperties(HTMLScriptElement.prototype, {
    [Symbol.toStringTag]: {
        value: 'HTMLScriptElement',
        configurable: true
    }
});

// 从浏览器中知道Document是全局的，new Document会返回一个对象
var Document = function Document() { // 构造函数
};
catvm.safefunction(Document);
// 浏览器
Object.defineProperties(Document.prototype, {
    [Symbol.toStringTag]: {
        value: "Document",
        configurable: true
    }
});
document = {};
document.__proto__ = Document.prototype;

///////////////////////////////////////////////////////////浏览器代码自动生成部分

document.hidden = false;
document.nodeType = 9;
document.defaultView = window;
document.ownerDocument = document;
document.getElementById = function getElementById(id) {
    debugger;
    // 用id匹配当前环境内存中已有的Element，没找到则返回null
    return null;
};
catvm.safefunction(document.getElementById);

document.getElementsByTagName = function getElementsByTagName(tag_name) {
    return catvm.memory.getElementsByTagName;
    debugger;
};
catvm.safefunction(document.getElementsByTagName);


document.addEventListener = function addEventListener(type, listener, options, useCapture) {
    debugger;
    return undefined;
};
catvm.safefunction(document.addEventListener);


document.createElement = function createElement(tagName) {
    tagName = tagName.toLowerCase();
    if (catvm.memory.htmlelements[tagName] == undefined) {
        debugger;
    } else {
        var tagElement = catvm.memory.htmlelements[tagName]();
        return catvm.proxy(tagElement);
    }
};
catvm.safefunction(document.createElement);
//////////////////////////////////////////////////////////////
// 浏览器中document是全局的，因此我们也需要定义一个document


////////////////////////////////////////


document['documentElement'] = {
    style: {}
};

////////////////////////////////////////
//document.documentElement.style
document.documentElement.style['accentColor'] = ""
document.documentElement.style['additiveSymbols'] = ""
document.documentElement.style['alignContent'] = ""
document.documentElement.style['alignItems'] = ""
document.documentElement.style['alignSelf'] = ""
document.documentElement.style['alignmentBaseline'] = ""
document.documentElement.style['all'] = ""
document.documentElement.style['animation'] = ""
document.documentElement.style['animationComposition'] = ""
document.documentElement.style['animationDelay'] = ""
document.documentElement.style['animationDirection'] = ""
document.documentElement.style['animationDuration'] = ""
document.documentElement.style['animationFillMode'] = ""
document.documentElement.style['animationIterationCount'] = ""
document.documentElement.style['animationName'] = ""
document.documentElement.style['animationPlayState'] = ""
document.documentElement.style['animationRange'] = ""
document.documentElement.style['animationRangeEnd'] = ""
document.documentElement.style['animationRangeStart'] = ""
document.documentElement.style['animationTimeline'] = ""
document.documentElement.style['animationTimingFunction'] = ""
document.documentElement.style['appRegion'] = ""
document.documentElement.style['appearance'] = ""
document.documentElement.style['ascentOverride'] = ""
document.documentElement.style['aspectRatio'] = ""
document.documentElement.style['backdropFilter'] = ""
document.documentElement.style['backfaceVisibility'] = ""
document.documentElement.style['background'] = ""
document.documentElement.style['backgroundAttachment'] = ""
document.documentElement.style['backgroundBlendMode'] = ""
document.documentElement.style['backgroundClip'] = ""
document.documentElement.style['backgroundColor'] = ""
document.documentElement.style['backgroundImage'] = ""
document.documentElement.style['backgroundOrigin'] = ""
document.documentElement.style['backgroundPosition'] = ""
document.documentElement.style['backgroundPositionX'] = ""
document.documentElement.style['backgroundPositionY'] = ""
document.documentElement.style['backgroundRepeat'] = ""
document.documentElement.style['backgroundSize'] = ""
document.documentElement.style['basePalette'] = ""
document.documentElement.style['baselineShift'] = ""
document.documentElement.style['baselineSource'] = ""
document.documentElement.style['blockSize'] = ""
document.documentElement.style['border'] = ""
document.documentElement.style['borderBlock'] = ""
document.documentElement.style['borderBlockColor'] = ""
document.documentElement.style['borderBlockEnd'] = ""
document.documentElement.style['borderBlockEndColor'] = ""
document.documentElement.style['borderBlockEndStyle'] = ""
document.documentElement.style['borderBlockEndWidth'] = ""
document.documentElement.style['borderBlockStart'] = ""
document.documentElement.style['borderBlockStartColor'] = ""
document.documentElement.style['borderBlockStartStyle'] = ""
document.documentElement.style['borderBlockStartWidth'] = ""
document.documentElement.style['borderBlockStyle'] = ""
document.documentElement.style['borderBlockWidth'] = ""
document.documentElement.style['borderBottom'] = ""
document.documentElement.style['borderBottomColor'] = ""
document.documentElement.style['borderBottomLeftRadius'] = ""
document.documentElement.style['borderBottomRightRadius'] = ""
document.documentElement.style['borderBottomStyle'] = ""
document.documentElement.style['borderBottomWidth'] = ""
document.documentElement.style['borderCollapse'] = ""
document.documentElement.style['borderColor'] = ""
document.documentElement.style['borderEndEndRadius'] = ""
document.documentElement.style['borderEndStartRadius'] = ""
document.documentElement.style['borderImage'] = ""
document.documentElement.style['borderImageOutset'] = ""
document.documentElement.style['borderImageRepeat'] = ""
document.documentElement.style['borderImageSlice'] = ""
document.documentElement.style['borderImageSource'] = ""
document.documentElement.style['borderImageWidth'] = ""
document.documentElement.style['borderInline'] = ""
document.documentElement.style['borderInlineColor'] = ""
document.documentElement.style['borderInlineEnd'] = ""
document.documentElement.style['borderInlineEndColor'] = ""
document.documentElement.style['borderInlineEndStyle'] = ""
document.documentElement.style['borderInlineEndWidth'] = ""
document.documentElement.style['borderInlineStart'] = ""
document.documentElement.style['borderInlineStartColor'] = ""
document.documentElement.style['borderInlineStartStyle'] = ""
document.documentElement.style['borderInlineStartWidth'] = ""
document.documentElement.style['borderInlineStyle'] = ""
document.documentElement.style['borderInlineWidth'] = ""
document.documentElement.style['borderLeft'] = ""
document.documentElement.style['borderLeftColor'] = ""
document.documentElement.style['borderLeftStyle'] = ""
document.documentElement.style['borderLeftWidth'] = ""
document.documentElement.style['borderRadius'] = ""
document.documentElement.style['borderRight'] = ""
document.documentElement.style['borderRightColor'] = ""
document.documentElement.style['borderRightStyle'] = ""
document.documentElement.style['borderRightWidth'] = ""
document.documentElement.style['borderSpacing'] = ""
document.documentElement.style['borderStartEndRadius'] = ""
document.documentElement.style['borderStartStartRadius'] = ""
document.documentElement.style['borderStyle'] = ""
document.documentElement.style['borderTop'] = ""
document.documentElement.style['borderTopColor'] = ""
document.documentElement.style['borderTopLeftRadius'] = ""
document.documentElement.style['borderTopRightRadius'] = ""
document.documentElement.style['borderTopStyle'] = ""
document.documentElement.style['borderTopWidth'] = ""
document.documentElement.style['borderWidth'] = ""
document.documentElement.style['bottom'] = ""
document.documentElement.style['boxShadow'] = ""
document.documentElement.style['boxSizing'] = ""
document.documentElement.style['breakAfter'] = ""
document.documentElement.style['breakBefore'] = ""
document.documentElement.style['breakInside'] = ""
document.documentElement.style['bufferedRendering'] = ""
document.documentElement.style['captionSide'] = ""
document.documentElement.style['caretColor'] = ""
document.documentElement.style['clear'] = ""
document.documentElement.style['clip'] = ""
document.documentElement.style['clipPath'] = ""
document.documentElement.style['clipRule'] = ""
document.documentElement.style['color'] = ""
document.documentElement.style['colorInterpolation'] = ""
document.documentElement.style['colorInterpolationFilters'] = ""
document.documentElement.style['colorRendering'] = ""
document.documentElement.style['colorScheme'] = ""
document.documentElement.style['columnCount'] = ""
document.documentElement.style['columnFill'] = ""
document.documentElement.style['columnGap'] = ""
document.documentElement.style['columnRule'] = ""
document.documentElement.style['columnRuleColor'] = ""
document.documentElement.style['columnRuleStyle'] = ""
document.documentElement.style['columnRuleWidth'] = ""
document.documentElement.style['columnSpan'] = ""
document.documentElement.style['columnWidth'] = ""
document.documentElement.style['columns'] = ""
document.documentElement.style['contain'] = ""
document.documentElement.style['containIntrinsicBlockSize'] = ""
document.documentElement.style['containIntrinsicHeight'] = ""
document.documentElement.style['containIntrinsicInlineSize'] = ""
document.documentElement.style['containIntrinsicSize'] = ""
document.documentElement.style['containIntrinsicWidth'] = ""
document.documentElement.style['container'] = ""
document.documentElement.style['containerName'] = ""
document.documentElement.style['containerType'] = ""
document.documentElement.style['content'] = ""
document.documentElement.style['contentVisibility'] = ""
document.documentElement.style['counterIncrement'] = ""
document.documentElement.style['counterReset'] = ""
document.documentElement.style['counterSet'] = ""
document.documentElement.style['cursor'] = ""
document.documentElement.style['cx'] = ""
document.documentElement.style['cy'] = ""
document.documentElement.style['d'] = ""
document.documentElement.style['descentOverride'] = ""
document.documentElement.style['direction'] = ""
document.documentElement.style['display'] = ""
document.documentElement.style['dominantBaseline'] = ""
document.documentElement.style['emptyCells'] = ""
document.documentElement.style['fallback'] = ""
document.documentElement.style['fill'] = ""
document.documentElement.style['fillOpacity'] = ""
document.documentElement.style['fillRule'] = ""
document.documentElement.style['filter'] = ""
document.documentElement.style['flex'] = ""
document.documentElement.style['flexBasis'] = ""
document.documentElement.style['flexDirection'] = ""
document.documentElement.style['flexFlow'] = ""
document.documentElement.style['flexGrow'] = ""
document.documentElement.style['flexShrink'] = ""
document.documentElement.style['flexWrap'] = ""
document.documentElement.style['float'] = ""
document.documentElement.style['floodColor'] = ""
document.documentElement.style['floodOpacity'] = ""
document.documentElement.style['font'] = ""
document.documentElement.style['fontDisplay'] = ""
document.documentElement.style['fontFamily'] = ""
document.documentElement.style['fontFeatureSettings'] = ""
document.documentElement.style['fontKerning'] = ""
document.documentElement.style['fontOpticalSizing'] = ""
document.documentElement.style['fontPalette'] = ""
document.documentElement.style['fontSize'] = ""
document.documentElement.style['fontStretch'] = ""
document.documentElement.style['fontStyle'] = ""
document.documentElement.style['fontSynthesis'] = ""
document.documentElement.style['fontSynthesisSmallCaps'] = ""
document.documentElement.style['fontSynthesisStyle'] = ""
document.documentElement.style['fontSynthesisWeight'] = ""
document.documentElement.style['fontVariant'] = ""
document.documentElement.style['fontVariantAlternates'] = ""
document.documentElement.style['fontVariantCaps'] = ""
document.documentElement.style['fontVariantEastAsian'] = ""
document.documentElement.style['fontVariantLigatures'] = ""
document.documentElement.style['fontVariantNumeric'] = ""
document.documentElement.style['fontVariantPosition'] = ""
document.documentElement.style['fontVariationSettings'] = ""
document.documentElement.style['fontWeight'] = ""
document.documentElement.style['forcedColorAdjust'] = ""
document.documentElement.style['gap'] = ""
document.documentElement.style['grid'] = ""
document.documentElement.style['gridArea'] = ""
document.documentElement.style['gridAutoColumns'] = ""
document.documentElement.style['gridAutoFlow'] = ""
document.documentElement.style['gridAutoRows'] = ""
document.documentElement.style['gridColumn'] = ""
document.documentElement.style['gridColumnEnd'] = ""
document.documentElement.style['gridColumnGap'] = ""
document.documentElement.style['gridColumnStart'] = ""
document.documentElement.style['gridGap'] = ""
document.documentElement.style['gridRow'] = ""
document.documentElement.style['gridRowEnd'] = ""
document.documentElement.style['gridRowGap'] = ""
document.documentElement.style['gridRowStart'] = ""
document.documentElement.style['gridTemplate'] = ""
document.documentElement.style['gridTemplateAreas'] = ""
document.documentElement.style['gridTemplateColumns'] = ""
document.documentElement.style['gridTemplateRows'] = ""
document.documentElement.style['height'] = ""
document.documentElement.style['hyphenateCharacter'] = ""
document.documentElement.style['hyphenateLimitChars'] = ""
document.documentElement.style['hyphens'] = ""
document.documentElement.style['imageOrientation'] = ""
document.documentElement.style['imageRendering'] = ""
document.documentElement.style['inherits'] = ""
document.documentElement.style['initialLetter'] = ""
document.documentElement.style['initialValue'] = ""
document.documentElement.style['inlineSize'] = ""
document.documentElement.style['inset'] = ""
document.documentElement.style['insetBlock'] = ""
document.documentElement.style['insetBlockEnd'] = ""
document.documentElement.style['insetBlockStart'] = ""
document.documentElement.style['insetInline'] = ""
document.documentElement.style['insetInlineEnd'] = ""
document.documentElement.style['insetInlineStart'] = ""
document.documentElement.style['isolation'] = ""
document.documentElement.style['justifyContent'] = ""
document.documentElement.style['justifyItems'] = ""
document.documentElement.style['justifySelf'] = ""
document.documentElement.style['left'] = ""
document.documentElement.style['letterSpacing'] = ""
document.documentElement.style['lightingColor'] = ""
document.documentElement.style['lineBreak'] = ""
document.documentElement.style['lineGapOverride'] = ""
document.documentElement.style['lineHeight'] = ""
document.documentElement.style['listStyle'] = ""
document.documentElement.style['listStyleImage'] = ""
document.documentElement.style['listStylePosition'] = ""
document.documentElement.style['listStyleType'] = ""
document.documentElement.style['margin'] = ""
document.documentElement.style['marginBlock'] = ""
document.documentElement.style['marginBlockEnd'] = ""
document.documentElement.style['marginBlockStart'] = ""
document.documentElement.style['marginBottom'] = ""
document.documentElement.style['marginInline'] = ""
document.documentElement.style['marginInlineEnd'] = ""
document.documentElement.style['marginInlineStart'] = ""
document.documentElement.style['marginLeft'] = ""
document.documentElement.style['marginRight'] = ""
document.documentElement.style['marginTop'] = ""
document.documentElement.style['marker'] = ""
document.documentElement.style['markerEnd'] = ""
document.documentElement.style['markerMid'] = ""
document.documentElement.style['markerStart'] = ""
document.documentElement.style['mask'] = ""
document.documentElement.style['maskClip'] = ""
document.documentElement.style['maskComposite'] = ""
document.documentElement.style['maskImage'] = ""
document.documentElement.style['maskMode'] = ""
document.documentElement.style['maskOrigin'] = ""
document.documentElement.style['maskPosition'] = ""
document.documentElement.style['maskRepeat'] = ""
document.documentElement.style['maskSize'] = ""
document.documentElement.style['maskType'] = ""
document.documentElement.style['mathDepth'] = ""
document.documentElement.style['mathShift'] = ""
document.documentElement.style['mathStyle'] = ""
document.documentElement.style['maxBlockSize'] = ""
document.documentElement.style['maxHeight'] = ""
document.documentElement.style['maxInlineSize'] = ""
document.documentElement.style['maxWidth'] = ""
document.documentElement.style['minBlockSize'] = ""
document.documentElement.style['minHeight'] = ""
document.documentElement.style['minInlineSize'] = ""
document.documentElement.style['minWidth'] = ""
document.documentElement.style['mixBlendMode'] = ""
document.documentElement.style['negative'] = ""
document.documentElement.style['objectFit'] = ""
document.documentElement.style['objectPosition'] = ""
document.documentElement.style['objectViewBox'] = ""
document.documentElement.style['offset'] = ""
document.documentElement.style['offsetAnchor'] = ""
document.documentElement.style['offsetDistance'] = ""
document.documentElement.style['offsetPath'] = ""
document.documentElement.style['offsetPosition'] = ""
document.documentElement.style['offsetRotate'] = ""
document.documentElement.style['opacity'] = ""
document.documentElement.style['order'] = ""
document.documentElement.style['orphans'] = ""
document.documentElement.style['outline'] = ""
document.documentElement.style['outlineColor'] = ""
document.documentElement.style['outlineOffset'] = ""
document.documentElement.style['outlineStyle'] = ""
document.documentElement.style['outlineWidth'] = ""
document.documentElement.style['overflow'] = ""
document.documentElement.style['overflowAnchor'] = ""
document.documentElement.style['overflowClipMargin'] = ""
document.documentElement.style['overflowWrap'] = ""
document.documentElement.style['overflowX'] = ""
document.documentElement.style['overflowY'] = ""
document.documentElement.style['overlay'] = ""
document.documentElement.style['overrideColors'] = ""
document.documentElement.style['overscrollBehavior'] = ""
document.documentElement.style['overscrollBehaviorBlock'] = ""
document.documentElement.style['overscrollBehaviorInline'] = ""
document.documentElement.style['overscrollBehaviorX'] = ""
document.documentElement.style['overscrollBehaviorY'] = ""
document.documentElement.style['pad'] = ""
document.documentElement.style['padding'] = ""
document.documentElement.style['paddingBlock'] = ""
document.documentElement.style['paddingBlockEnd'] = ""
document.documentElement.style['paddingBlockStart'] = ""
document.documentElement.style['paddingBottom'] = ""
document.documentElement.style['paddingInline'] = ""
document.documentElement.style['paddingInlineEnd'] = ""
document.documentElement.style['paddingInlineStart'] = ""
document.documentElement.style['paddingLeft'] = ""
document.documentElement.style['paddingRight'] = ""
document.documentElement.style['paddingTop'] = ""
document.documentElement.style['page'] = ""
document.documentElement.style['pageBreakAfter'] = ""
document.documentElement.style['pageBreakBefore'] = ""
document.documentElement.style['pageBreakInside'] = ""
document.documentElement.style['pageOrientation'] = ""
document.documentElement.style['paintOrder'] = ""
document.documentElement.style['perspective'] = ""
document.documentElement.style['perspectiveOrigin'] = ""
document.documentElement.style['placeContent'] = ""
document.documentElement.style['placeItems'] = ""
document.documentElement.style['placeSelf'] = ""
document.documentElement.style['pointerEvents'] = ""
document.documentElement.style['position'] = ""
document.documentElement.style['prefix'] = ""
document.documentElement.style['quotes'] = ""
document.documentElement.style['r'] = ""
document.documentElement.style['range'] = ""
document.documentElement.style['resize'] = ""
document.documentElement.style['right'] = ""
document.documentElement.style['rotate'] = ""
document.documentElement.style['rowGap'] = ""
document.documentElement.style['rubyPosition'] = ""
document.documentElement.style['rx'] = ""
document.documentElement.style['ry'] = ""
document.documentElement.style['scale'] = ""
document.documentElement.style['scrollBehavior'] = ""
document.documentElement.style['scrollMargin'] = ""
document.documentElement.style['scrollMarginBlock'] = ""
document.documentElement.style['scrollMarginBlockEnd'] = ""
document.documentElement.style['scrollMarginBlockStart'] = ""
document.documentElement.style['scrollMarginBottom'] = ""
document.documentElement.style['scrollMarginInline'] = ""
document.documentElement.style['scrollMarginInlineEnd'] = ""
document.documentElement.style['scrollMarginInlineStart'] = ""
document.documentElement.style['scrollMarginLeft'] = ""
document.documentElement.style['scrollMarginRight'] = ""
document.documentElement.style['scrollMarginTop'] = ""
document.documentElement.style['scrollPadding'] = ""
document.documentElement.style['scrollPaddingBlock'] = ""
document.documentElement.style['scrollPaddingBlockEnd'] = ""
document.documentElement.style['scrollPaddingBlockStart'] = ""
document.documentElement.style['scrollPaddingBottom'] = ""
document.documentElement.style['scrollPaddingInline'] = ""
document.documentElement.style['scrollPaddingInlineEnd'] = ""
document.documentElement.style['scrollPaddingInlineStart'] = ""
document.documentElement.style['scrollPaddingLeft'] = ""
document.documentElement.style['scrollPaddingRight'] = ""
document.documentElement.style['scrollPaddingTop'] = ""
document.documentElement.style['scrollSnapAlign'] = ""
document.documentElement.style['scrollSnapStop'] = ""
document.documentElement.style['scrollSnapType'] = ""
document.documentElement.style['scrollTimeline'] = ""
document.documentElement.style['scrollTimelineAxis'] = ""
document.documentElement.style['scrollTimelineName'] = ""
document.documentElement.style['scrollbarColor'] = ""
document.documentElement.style['scrollbarGutter'] = ""
document.documentElement.style['scrollbarWidth'] = ""
document.documentElement.style['shapeImageThreshold'] = ""
document.documentElement.style['shapeMargin'] = ""
document.documentElement.style['shapeOutside'] = ""
document.documentElement.style['shapeRendering'] = ""
document.documentElement.style['size'] = ""
document.documentElement.style['sizeAdjust'] = ""
document.documentElement.style['speak'] = ""
document.documentElement.style['speakAs'] = ""
document.documentElement.style['src'] = ""
document.documentElement.style['stopColor'] = ""
document.documentElement.style['stopOpacity'] = ""
document.documentElement.style['stroke'] = ""
document.documentElement.style['strokeDasharray'] = ""
document.documentElement.style['strokeDashoffset'] = ""
document.documentElement.style['strokeLinecap'] = ""
document.documentElement.style['strokeLinejoin'] = ""
document.documentElement.style['strokeMiterlimit'] = ""
document.documentElement.style['strokeOpacity'] = ""
document.documentElement.style['strokeWidth'] = ""
document.documentElement.style['suffix'] = ""
document.documentElement.style['symbols'] = ""
document.documentElement.style['syntax'] = ""
document.documentElement.style['system'] = ""
document.documentElement.style['tabSize'] = ""
document.documentElement.style['tableLayout'] = ""
document.documentElement.style['textAlign'] = ""
document.documentElement.style['textAlignLast'] = ""
document.documentElement.style['textAnchor'] = ""
document.documentElement.style['textCombineUpright'] = ""
document.documentElement.style['textDecoration'] = ""
document.documentElement.style['textDecorationColor'] = ""
document.documentElement.style['textDecorationLine'] = ""
document.documentElement.style['textDecorationSkipInk'] = ""
document.documentElement.style['textDecorationStyle'] = ""
document.documentElement.style['textDecorationThickness'] = ""
document.documentElement.style['textEmphasis'] = ""
document.documentElement.style['textEmphasisColor'] = ""
document.documentElement.style['textEmphasisPosition'] = ""
document.documentElement.style['textEmphasisStyle'] = ""
document.documentElement.style['textIndent'] = ""
document.documentElement.style['textOrientation'] = ""
document.documentElement.style['textOverflow'] = ""
document.documentElement.style['textRendering'] = ""
document.documentElement.style['textShadow'] = ""
document.documentElement.style['textSizeAdjust'] = ""
document.documentElement.style['textTransform'] = ""
document.documentElement.style['textUnderlineOffset'] = ""
document.documentElement.style['textUnderlinePosition'] = ""
document.documentElement.style['textWrap'] = ""
document.documentElement.style['timelineScope'] = ""
document.documentElement.style['top'] = ""
document.documentElement.style['touchAction'] = ""
document.documentElement.style['transform'] = ""
document.documentElement.style['transformBox'] = ""
document.documentElement.style['transformOrigin'] = ""
document.documentElement.style['transformStyle'] = ""
document.documentElement.style['transition'] = ""
document.documentElement.style['transitionBehavior'] = ""
document.documentElement.style['transitionDelay'] = ""
document.documentElement.style['transitionDuration'] = ""
document.documentElement.style['transitionProperty'] = ""
document.documentElement.style['transitionTimingFunction'] = ""
document.documentElement.style['translate'] = ""
document.documentElement.style['unicodeBidi'] = ""
document.documentElement.style['unicodeRange'] = ""
document.documentElement.style['userSelect'] = ""
document.documentElement.style['vectorEffect'] = ""
document.documentElement.style['verticalAlign'] = ""
document.documentElement.style['viewTimeline'] = ""
document.documentElement.style['viewTimelineAxis'] = ""
document.documentElement.style['viewTimelineInset'] = ""
document.documentElement.style['viewTimelineName'] = ""
document.documentElement.style['viewTransitionName'] = ""
document.documentElement.style['visibility'] = ""
document.documentElement.style['webkitAlignContent'] = ""
document.documentElement.style['webkitAlignItems'] = ""
document.documentElement.style['webkitAlignSelf'] = ""
document.documentElement.style['webkitAnimation'] = ""
document.documentElement.style['webkitAnimationDelay'] = ""
document.documentElement.style['webkitAnimationDirection'] = ""
document.documentElement.style['webkitAnimationDuration'] = ""
document.documentElement.style['webkitAnimationFillMode'] = ""
document.documentElement.style['webkitAnimationIterationCount'] = ""
document.documentElement.style['webkitAnimationName'] = ""
document.documentElement.style['webkitAnimationPlayState'] = ""
document.documentElement.style['webkitAnimationTimingFunction'] = ""
document.documentElement.style['webkitAppRegion'] = ""
document.documentElement.style['webkitAppearance'] = ""
document.documentElement.style['webkitBackfaceVisibility'] = ""
document.documentElement.style['webkitBackgroundClip'] = ""
document.documentElement.style['webkitBackgroundOrigin'] = ""
document.documentElement.style['webkitBackgroundSize'] = ""
document.documentElement.style['webkitBorderAfter'] = ""
document.documentElement.style['webkitBorderAfterColor'] = ""
document.documentElement.style['webkitBorderAfterStyle'] = ""
document.documentElement.style['webkitBorderAfterWidth'] = ""
document.documentElement.style['webkitBorderBefore'] = ""
document.documentElement.style['webkitBorderBeforeColor'] = ""
document.documentElement.style['webkitBorderBeforeStyle'] = ""
document.documentElement.style['webkitBorderBeforeWidth'] = ""
document.documentElement.style['webkitBorderBottomLeftRadius'] = ""
document.documentElement.style['webkitBorderBottomRightRadius'] = ""
document.documentElement.style['webkitBorderEnd'] = ""
document.documentElement.style['webkitBorderEndColor'] = ""
document.documentElement.style['webkitBorderEndStyle'] = ""
document.documentElement.style['webkitBorderEndWidth'] = ""
document.documentElement.style['webkitBorderHorizontalSpacing'] = ""
document.documentElement.style['webkitBorderImage'] = ""
document.documentElement.style['webkitBorderRadius'] = ""
document.documentElement.style['webkitBorderStart'] = ""
document.documentElement.style['webkitBorderStartColor'] = ""
document.documentElement.style['webkitBorderStartStyle'] = ""
document.documentElement.style['webkitBorderStartWidth'] = ""
document.documentElement.style['webkitBorderTopLeftRadius'] = ""
document.documentElement.style['webkitBorderTopRightRadius'] = ""
document.documentElement.style['webkitBorderVerticalSpacing'] = ""
document.documentElement.style['webkitBoxAlign'] = ""
document.documentElement.style['webkitBoxDecorationBreak'] = ""
document.documentElement.style['webkitBoxDirection'] = ""
document.documentElement.style['webkitBoxFlex'] = ""
document.documentElement.style['webkitBoxOrdinalGroup'] = ""
document.documentElement.style['webkitBoxOrient'] = ""
document.documentElement.style['webkitBoxPack'] = ""
document.documentElement.style['webkitBoxReflect'] = ""
document.documentElement.style['webkitBoxShadow'] = ""
document.documentElement.style['webkitBoxSizing'] = ""
document.documentElement.style['webkitClipPath'] = ""
document.documentElement.style['webkitColumnBreakAfter'] = ""
document.documentElement.style['webkitColumnBreakBefore'] = ""
document.documentElement.style['webkitColumnBreakInside'] = ""
document.documentElement.style['webkitColumnCount'] = ""
document.documentElement.style['webkitColumnGap'] = ""
document.documentElement.style['webkitColumnRule'] = ""
document.documentElement.style['webkitColumnRuleColor'] = ""
document.documentElement.style['webkitColumnRuleStyle'] = ""
document.documentElement.style['webkitColumnRuleWidth'] = ""
document.documentElement.style['webkitColumnSpan'] = ""
document.documentElement.style['webkitColumnWidth'] = ""
document.documentElement.style['webkitColumns'] = ""
document.documentElement.style['webkitFilter'] = ""
document.documentElement.style['webkitFlex'] = ""
document.documentElement.style['webkitFlexBasis'] = ""
document.documentElement.style['webkitFlexDirection'] = ""
document.documentElement.style['webkitFlexFlow'] = ""
document.documentElement.style['webkitFlexGrow'] = ""
document.documentElement.style['webkitFlexShrink'] = ""
document.documentElement.style['webkitFlexWrap'] = ""
document.documentElement.style['webkitFontFeatureSettings'] = ""
document.documentElement.style['webkitFontSmoothing'] = ""
document.documentElement.style['webkitHyphenateCharacter'] = ""
document.documentElement.style['webkitJustifyContent'] = ""
document.documentElement.style['webkitLineBreak'] = ""
document.documentElement.style['webkitLineClamp'] = ""
document.documentElement.style['webkitLocale'] = ""
document.documentElement.style['webkitLogicalHeight'] = ""
document.documentElement.style['webkitLogicalWidth'] = ""
document.documentElement.style['webkitMarginAfter'] = ""
document.documentElement.style['webkitMarginBefore'] = ""
document.documentElement.style['webkitMarginEnd'] = ""
document.documentElement.style['webkitMarginStart'] = ""
document.documentElement.style['webkitMask'] = ""
document.documentElement.style['webkitMaskBoxImage'] = ""
document.documentElement.style['webkitMaskBoxImageOutset'] = ""
document.documentElement.style['webkitMaskBoxImageRepeat'] = ""
document.documentElement.style['webkitMaskBoxImageSlice'] = ""
document.documentElement.style['webkitMaskBoxImageSource'] = ""
document.documentElement.style['webkitMaskBoxImageWidth'] = ""
document.documentElement.style['webkitMaskClip'] = ""
document.documentElement.style['webkitMaskComposite'] = ""
document.documentElement.style['webkitMaskImage'] = ""
document.documentElement.style['webkitMaskOrigin'] = ""
document.documentElement.style['webkitMaskPosition'] = ""
document.documentElement.style['webkitMaskPositionX'] = ""
document.documentElement.style['webkitMaskPositionY'] = ""
document.documentElement.style['webkitMaskRepeat'] = ""
document.documentElement.style['webkitMaskSize'] = ""
document.documentElement.style['webkitMaxLogicalHeight'] = ""
document.documentElement.style['webkitMaxLogicalWidth'] = ""
document.documentElement.style['webkitMinLogicalHeight'] = ""
document.documentElement.style['webkitMinLogicalWidth'] = ""
document.documentElement.style['webkitOpacity'] = ""
document.documentElement.style['webkitOrder'] = ""
document.documentElement.style['webkitPaddingAfter'] = ""
document.documentElement.style['webkitPaddingBefore'] = ""
document.documentElement.style['webkitPaddingEnd'] = ""
document.documentElement.style['webkitPaddingStart'] = ""
document.documentElement.style['webkitPerspective'] = ""
document.documentElement.style['webkitPerspectiveOrigin'] = ""
document.documentElement.style['webkitPerspectiveOriginX'] = ""
document.documentElement.style['webkitPerspectiveOriginY'] = ""
document.documentElement.style['webkitPrintColorAdjust'] = ""
document.documentElement.style['webkitRtlOrdering'] = ""
document.documentElement.style['webkitRubyPosition'] = ""
document.documentElement.style['webkitShapeImageThreshold'] = ""
document.documentElement.style['webkitShapeMargin'] = ""
document.documentElement.style['webkitShapeOutside'] = ""
document.documentElement.style['webkitTapHighlightColor'] = ""
document.documentElement.style['webkitTextCombine'] = ""
document.documentElement.style['webkitTextDecorationsInEffect'] = ""
document.documentElement.style['webkitTextEmphasis'] = ""
document.documentElement.style['webkitTextEmphasisColor'] = ""
document.documentElement.style['webkitTextEmphasisPosition'] = ""
document.documentElement.style['webkitTextEmphasisStyle'] = ""
document.documentElement.style['webkitTextFillColor'] = ""
document.documentElement.style['webkitTextOrientation'] = ""
document.documentElement.style['webkitTextSecurity'] = ""
document.documentElement.style['webkitTextSizeAdjust'] = ""
document.documentElement.style['webkitTextStroke'] = ""
document.documentElement.style['webkitTextStrokeColor'] = ""
document.documentElement.style['webkitTextStrokeWidth'] = ""
document.documentElement.style['webkitTransform'] = ""
document.documentElement.style['webkitTransformOrigin'] = ""
document.documentElement.style['webkitTransformOriginX'] = ""
document.documentElement.style['webkitTransformOriginY'] = ""
document.documentElement.style['webkitTransformOriginZ'] = ""
document.documentElement.style['webkitTransformStyle'] = ""
document.documentElement.style['webkitTransition'] = ""
document.documentElement.style['webkitTransitionDelay'] = ""
document.documentElement.style['webkitTransitionDuration'] = ""
document.documentElement.style['webkitTransitionProperty'] = ""
document.documentElement.style['webkitTransitionTimingFunction'] = ""
document.documentElement.style['webkitUserDrag'] = ""
document.documentElement.style['webkitUserModify'] = ""
document.documentElement.style['webkitUserSelect'] = ""
document.documentElement.style['webkitWritingMode'] = ""
document.documentElement.style['whiteSpace'] = ""
document.documentElement.style['whiteSpaceCollapse'] = ""
document.documentElement.style['widows'] = ""
document.documentElement.style['width'] = ""
document.documentElement.style['willChange'] = ""
document.documentElement.style['wordBreak'] = ""
document.documentElement.style['wordSpacing'] = ""
document.documentElement.style['wordWrap'] = ""
document.documentElement.style['writingMode'] = ""
document.documentElement.style['x'] = ""
document.documentElement.style['y'] = ""
document.documentElement.style['zIndex'] = ""
document.documentElement.style['zoom'] = ""
document.documentElement.style['cssText'] = ""
document.documentElement.style['length'] = ""
document.documentElement.style['parentRule'] = null
document.documentElement.style['cssFloat'] = ""
document.documentElement.style['getPropertyPriority'] = function getPropertyPriority() {
    debugger;
}
document.documentElement.style['getPropertyValue'] = function getPropertyValue() {
    debugger;
}
document.documentElement.style['item'] = function item() {
    debugger;
}
document.documentElement.style['removeProperty'] = function removeProperty() {
    debugger;
}
document.documentElement.style['setProperty'] = function setProperty() {
    debugger;
}
document.documentElement.style.__proto__ = CSSStyleDeclaration.prototype;


document.childNodes = {
    0: {},
    1: {}
};

document.childNodes.length = 2;

document.childNodes.__proto__ = NodeList.prototype;


////////////此模块下是文档需要什么，就返回什么
////////////getelementbyid,getelementbytagname……,直接返回所需要的值
document.ownerDocument = function () {
    return null;
}();

document.getAttribute = function () {
    debugger;
};

document.parentNode = function parentNode() {
    debugger;
};


document.appendChild = function appendChild() {
    debugger;
};


document.getElementsByClassName = function getElementsByClassName() {
    debugger;
};

/////把document的代理挂在最后

document = catvm.proxy(document);
document.documentElement = catvm.proxy(document.documentElement);

debugger;
var e, t;
_0x4c28 = ["18|38|15|2", "ucisR", "wWwRM", "LzcOo", "yWGcu", "PlAEw", "ihcci", "hBKtU", "rvloG", "xcQTI", "uhJgH", "vRqUp", "EQEzR", "abc", "QgSUn", "0|45|44|19", "WMqBp", "koePJ", "jGSEC", "IKbhW", "wEOgn", "|49|71|11|", "xgzfr", "ABCDEF", "DdHPB", "aFxRD", "sFtiw", "concat", "YhaCC", "YVBwM", "abYok", "2|28|6|36|", "NLOsy", "bRLIN", "xGAWc", "length", "zYRlD", "14|67|61|3", "bolvy", "pagBT", "mdsJQ", "4|69|41|26", "kaXPV", "IWxBE", "pviAr", "5|0|2", "lvwPz", "YcDFe", "yGmJD", "FcYqi", "AAZoR", "|46|5|3|50", "PnITs", "ABCDEFGHIJ", "charCodeAt", "KLMNOPQRST", "prrXX", "FDiNG", "split", "oBesn", "9|24|10|56", "VaXsK", "fromCharCo", "FDfcp", "rrdPR", "HHkBN", "89+/", "mfuQZ", "PbrnX", "FcXlo", "rNapo", "fEXNi", "qtIDJ", "60|53|21|5", "Rtsed", "SUrST", "nsaps", "vyNVU", "2|29|23|64", "0|43|57|4|", "NNXUu", "nCrbn", "wQPIq", "XBcOb", "39|40|47|6", "ljkOt", "yMPhx", "TXzzv", "0123456789", "fmdcS", "iXQwu", "grCxb", "3|6|1|4|7|", "wKeAM", "Iekey", "opqrstuvwx", "|7|17", "BQgZQ", "BtzmV", "jZUAt", "HYhpy", "Yvoqt", "VyzBI", "NNVLf", "dbmfK", "0|58|16|32", "UAFHv", "WNIsZ", "2|1|4|3|5|", "JFqRJ", "zObVA", "d24fb0d696", "XfWkD", "MFmWH", "lZISZ", "WzbFA", "kaQlD", "3f7d28e17f", "eSwEi", "YpeFX", "kZhzK", "KxKIe", "LAIPf", "LjyKQ", "YLwOK", "iqfMz", "51|8|0|65|", "JRihE", "nqEyg", "|37|22|27|", "ZXsFi", "goEwl", "|31|63|48|", "wvVCN", "wnDlW", "Myvqp", "UlhBp", "fwCDC", "charAt", "Lmhlz", "WQCAS", "UXeVn", "KIXRL", "HiEZt", "WNzfT", "lNWda", "tsNzQ"],
    e = _0x4c28,
    t = 368,
    function (t) {
        for (; --t;)
            e.push(e.shift())
    }(++t);
var n = function (e, t) {
    return _0x4c28[e -= 0]
};
window.md5 = function (e) {
    var t = n
        , r = {
        fEXNi: function (e, t) {
            return e(t)
        },
        LzcOo: function (e, t, n) {
            return e(t, n)
        }
    };
    r[t(3)] = function (e, t) {
        return e(t)
    }
        ,
        r.wEOgn = function (e, t, n) {
            return e(t, n)
        }
        ,
        r[t(120)] = function (e, t, n) {
            return e(t, n)
        }
        ,
        r[t(69)] = function (e, t) {
            return e == t
        }
        ,
        r[t(109)] = function (e, t) {
            return e(t)
        }
        ,
        r[t(112)] = t(86),
        r.oBesn = "900150983c" + t(37) + t(43) + "72",
        r[t(70)] = t(18) + t(118),
        r[t(16)] = function (e, t) {
            return e < t
        }
        ,
        r[t(2)] = t(110) + t(5) + t(133) + "|55|13|12|" + t(146) + t(114) + t(94) + "35|68|33|4" + t(104) + t(52) + t(73) + t(88) + t(55) + "25|34|1|2|" + t(10) + t(4) + t(124) + t(58) + "52|59|66|7" + t(31) + t(22),
        r[t(53)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(35)] = function (e, t) {
            return e + t
        }
        ,
        r[t(141)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(91)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(65)] = function (e, t) {
            return e + t
        }
        ,
        r[t(38)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(19)] = function (e, t) {
            return e + t
        }
        ,
        r[t(117)] = function (e, t, n) {
            return e(t, n)
        }
        ,
        r[t(92)] = function (e, t) {
            return e + t
        }
        ,
        r[t(82)] = function (e, t) {
            return e + t
        }
        ,
        r[t(111)] = function (e, t, n) {
            return e(t, n)
        }
        ,
        r[t(78)] = function (e, t) {
            return e + t
        }
        ,
        r.lZISZ = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r.Iekey = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r.AAZoR = function (e, t) {
            return e + t
        }
        ,
        r[t(67)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r.UlhBp = function (e, t) {
            return e + t
        }
        ,
        r.yMPhx = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(138)] = function (e, t) {
            return e + t
        }
        ,
        r[t(121)] = function (e, t) {
            return e + t
        }
        ,
        r[t(98)] = function (e, t, n) {
            return e(t, n)
        }
        ,
        r.kHuTw = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(50)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(142)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(87)] = function (e, t) {
            return e + t
        }
        ,
        r[t(90)] = function (e, t) {
            return e + t
        }
        ,
        r[t(59)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(28)] = function (e, t) {
            return e + t
        }
        ,
        r[t(119)] = function (e, t) {
            return e + t
        }
        ,
        r.YpeFX = function (e, t) {
            return e + t
        }
        ,
        r[t(7)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r.prrXX = function (e, t) {
            return e + t
        }
        ,
        r.kaQlD = function (e, t) {
            return e + t
        }
        ,
        r.qtIDJ = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r.xGAWc = function (e, t) {
            return e + t
        }
        ,
        r[t(134)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(89)] = function (e, t) {
            return e + t
        }
        ,
        r[t(15)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(9)] = function (e, t) {
            return e + t
        }
        ,
        r[t(56)] = function (e, t) {
            return e + t
        }
        ,
        r[t(6)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(32)] = function (e, t) {
            return e + t
        }
        ,
        r[t(99)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(39)] = function (e, t) {
            return e + t
        }
        ,
        r[t(113)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(106)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(66)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r.TXzzv = function (e, t) {
            return e + t
        }
        ,
        r.NNVLf = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(79)] = function (e, t) {
            return e + t
        }
        ,
        r[t(1)] = function (e, t, n, r, i, o, a, s) {
            return e(t, n, r, i, o, a, s)
        }
        ,
        r[t(81)] = function (e, t) {
            return e + t
        }
        ,
        r.MXnIN = function (e, t) {
            return e >> t
        }
        ,
        r[t(23)] = function (e, t) {
            return e << t
        }
        ,
        r.nqEyg = function (e, t) {
            return e % t
        }
        ,
        r.kaXPV = function (e, t) {
            return e >>> t
        }
        ,
        r[t(24)] = function (e, t, n) {
            return e(t, n)
        }
        ,
        r[t(44)] = function (e, t, n) {
            return e(t, n)
        }
        ,
        r[t(30)] = function (e, t, n) {
            return e(t, n)
        }
        ,
        r[t(143)] = function (e, t) {
            return e | t
        }
        ,
        r[t(101)] = function (e, t) {
            return e & t
        }
        ,
        r[t(122)] = function (e, t, n, r, i, o, a) {
            return e(t, n, r, i, o, a)
        }
        ,
        r.ZpUiH = function (e, t) {
            return e & t
        }
        ,
        r[t(72)] = function (e, t) {
            return e ^ t
        }
        ,
        r[t(130)] = function (e, t) {
            return e ^ t
        }
        ,
        r[t(41)] = function (e, t) {
            return e | t
        }
        ,
        r[t(116)] = function (e, t) {
            return e > t
        }
        ,
        r[t(80)] = function (e, t) {
            return e(t)
        }
        ,
        r[t(33)] = function (e, t, n) {
            return e(t, n)
        }
        ,
        r[t(83)] = function (e, t) {
            return e(t)
        }
        ,
        r[t(60)] = function (e, t) {
            return e + t
        }
        ,
        r.FDfcp = function (e, t) {
            return e * t
        }
        ,
        r[t(95)] = function (e, t) {
            return e + t
        }
        ,
        r[t(51)] = function (e, t) {
            return e & t
        }
        ,
        r.DdHPB = function (e, t) {
            return e >> t
        }
        ,
        r.abYok = function (e, t) {
            return e | t
        }
        ,
        r[t(84)] = function (e, t) {
            return e << t
        }
        ,
        r[t(105)] = function (e, t) {
            return e & t
        }
        ,
        r[t(8)] = function (e, t) {
            return e - t
        }
        ,
        r[t(137)] = function (e) {
            return e()
        }
        ,
        r.YVBwM = function (e, t) {
            return e << t
        }
        ,
        r[t(27)] = function (e, t) {
            return e & t
        }
        ,
        r[t(26)] = function (e, t) {
            return e / t
        }
        ,
        r[t(74)] = function (e, t) {
            return e * t
        }
        ,
        r[t(49)] = t(14) + "abcdef",
        r[t(36)] = function (e, t) {
            return e >> t
        }
        ,
        r[t(46)] = function (e, t) {
            return e + t
        }
        ,
        r[t(75)] = function (e, t) {
            return e >> t
        }
        ,
        r[t(47)] = function (e, t) {
            return e * t
        }
        ,
        r[t(11)] = t(126) + t(128) + "UVWXYZabcdefghijklmn" + t(21) + "yz01234567" + t(139),
        r[t(63)] = function (e, t) {
            return e * t
        }
    ,
    r.KIXRL = function (e, t) {
        return e << t
    }
    ,
    r[t(57)] = function (e, t) {
        return e % t
    }
    ,
    r[t(77)] = function (e, t) {
        return e << t
    }
    ,
    r[t(71)] = function (e, t) {
        return e >> t
    }
    ,
    r.jZUAt = function (e, t) {
        return e >> t
    }
    ,
    r[t(48)] = function (e, t) {
        return e + t
    }
    ,
    r[t(17)] = function (e, t) {
        return e % t
    }
    ,
    r[t(85)] = function (e, t) {
        return e * t
    }
    ,
    r[t(61)] = function (e, t) {
        return e < t
    }
    ,
    r.mfuQZ = function (e, t) {
        return e + t
    }
    ,
    r[t(125)] = function (e, t) {
        return e * t
    }
    ,
    r[t(0)] = function (e, t) {
        return e(t)
    }
    ;
    var i = r;

    function o(e, n) {
        for (var r = t, o = i.WNzfT[r(131)]("|"), a = 0; ;) {
            switch (o[a++]) {
                case "0":
                    for (var d = 0; i.iXQwu(d, e.length); d += 16)
                        for (var p = i[r(2)][r(131)]("|"), h = 0; ;) {
                            switch (p[h++]) {
                                case "0":
                                    w = i[r(53)](l, w, b, x, T, e[d + 2], 9, -51403784);
                                    continue;
                                case "1":
                                    x = u(x, T, w, b, e[d + 6], 23, 76029189);
                                    continue;
                                case "2":
                                    b = i[r(53)](u, b, x, T, w, e[i.JFqRJ(d, 9)], 4, -640364487);
                                    continue;
                                case "3":
                                    T = i[r(141)](c, T, w, b, x, e[d + 10], 15, -1051523);
                                    continue;
                                case "4":
                                    T = s(T, w, b, x, e[i.JFqRJ(d, 2)], 17, 606105819);
                                    continue;
                                case "5":
                                    w = i[r(91)](c, w, b, x, T, e[i[r(65)](d, 3)], 10, -1894446606);
                                    continue;
                                case "6":
                                    w = i.XfWkD(l, w, b, x, T, e[i.wKeAM(d, 14)], 9, -1019803690);
                                    continue;
                                case "7":
                                    T = i.pviAr(f, T, v);
                                    continue;
                                case "8":
                                    b = i.XfWkD(l, b, x, T, w, e[i[r(92)](d, 13)], 5, -1444681467);
                                    continue;
                                case "9":
                                    x = i[r(38)](s, x, T, w, b, e[i[r(82)](d, 3)], 22, -1044525330);
                                    continue;
                                case "10":
                                    w = s(w, b, x, T, e[i[r(82)](d, 5)], 12, 1200080426);
                                    continue;
                                case "11":
                                    x = i[r(38)](l, x, T, w, b, e[i[r(82)](d, 0)], 20, -373897302);
                                    continue;
                                case "12":
                                    w = i[r(38)](s, w, b, x, T, e[i[r(82)](d, 9)], 12, -1958435417);
                                    continue;
                                case "13":
                                    b = i.XfWkD(s, b, x, T, w, e[i.xcQTI(d, 8)], 7, 1770035416);
                                    continue;
                                case "14":
                                    var m = b;
                                    continue;
                                case "15":
                                    w = i[r(38)](u, w, b, x, T, e[i.xcQTI(d, 8)], 11, -2022574463);
                                    continue;
                                case "16":
                                    b = f(b, m);
                                    continue;
                                case "17":
                                    w = i[r(111)](f, w, g);
                                    continue;
                                case "18":
                                    x = l(x, T, w, b, e[i[r(78)](d, 12)], 20, -1921207734);
                                    continue;
                                case "19":
                                    w = i[r(40)](u, w, b, x, T, e[d + 4], 11, 1272893353);
                                    continue;
                                case "20":
                                    T = i[r(20)](u, T, w, b, x, e[i.PlAEw(d, 11)], 16, 1839030562);
                                    continue;
                                case "21":
                                    b = s(b, x, T, w, e[i[r(123)](d, 12)], 7, 1804550682);
                                    continue;
                                case "22":
                                    x = u(x, T, w, b, e[i[r(123)](d, 10)], 23, -1094730640);
                                    continue;
                                case "23":
                                    T = i[r(67)](c, T, w, b, x, e[d + 14], 15, -1416354905);
                                    continue;
                                case "24":
                                    b = s(b, x, T, w, e[i[r(123)](d, 4)], 7, -176418897);
                                    continue;
                                case "25":
                                    w = i.UXeVn(u, w, b, x, T, e[d + 0], 11, -358537222);
                                    continue;
                                case "26":
                                    b = i.UXeVn(l, b, x, T, w, e[i[r(62)](d, 1)], 5, -165796510);
                                    continue;
                                case "27":
                                    b = i.UXeVn(u, b, x, T, w, e[i[r(62)](d, 13)], 4, 681279174);
                                    continue;
                                case "28":
                                    b = i[r(12)](l, b, x, T, w, e[i[r(138)](d, 9)], 5, 568446438);
                                    continue;
                                case "29":
                                    w = i.yMPhx(c, w, b, x, T, e[d + 7], 10, 11261161415);
                                    continue;
                                case "30":
                                    var g = w;
                                    continue;
                                case "31":
                                    b = c(b, x, T, w, e[i.yGmJD(d, 8)], 6, 1873313359);
                                    continue;
                                case "32":
                                    x = i.aFxRD(f, x, y);
                                    continue;
                                case "33":
                                    T = i[r(12)](l, T, w, b, x, e[i[r(121)](d, 15)], 14, -660478335);
                                    continue;
                                case "34":
                                    T = i.kHuTw(u, T, w, b, x, e[d + 3], 16, -722881979);
                                    continue;
                                case "35":
                                    b = i[r(50)](l, b, x, T, w, e[i[r(121)](d, 5)], 5, -701520691);
                                    continue;
                                case "36":
                                    T = l(T, w, b, x, e[i[r(121)](d, 3)], 14, -187363961);
                                    continue;
                                case "37":
                                    T = i[r(142)](u, T, w, b, x, e[i.QgSUn(d, 7)], 16, -155497632);
                                    continue;
                                case "38":
                                    b = i.FcXlo(u, b, x, T, w, e[i.koePJ(d, 5)], 4, -378558);
                                    continue;
                                case "39":
                                    w = i[r(142)](u, w, b, x, T, e[i[r(90)](d, 12)], 11, -421815835);
                                    continue;
                                case "40":
                                    T = i[r(59)](u, T, w, b, x, e[i[r(28)](d, 15)], 16, 530742520);
                                    continue;
                                case "41":
                                    x = i.wvVCN(s, x, T, w, b, e[d + 15], 22, 1236531029);
                                    continue;
                                case "42":
                                    x = i[r(59)](l, x, T, w, b, e[i[r(119)](d, 4)], 20, -405537848);
                                    continue;
                                case "43":
                                    b = i[r(59)](s, b, x, T, w, e[i.lvwPz(d, 0)], 7, -680976936);
                                    continue;
                                case "44":
                                    b = i[r(59)](u, b, x, T, w, e[i[r(45)](d, 1)], 4, -1530992060);
                                    continue;
                                case "45":
                                    x = i.nCrbn(u, x, T, w, b, e[i[r(129)](d, 14)], 23, -35311556);
                                    continue;
                                case "46":
                                    b = c(b, x, T, w, e[i[r(42)](d, 12)], 6, 1700485571);
                                    continue;
                                case "47":
                                    x = i[r(7)](u, x, T, w, b, e[i.kaQlD(d, 2)], 23, -995338651);
                                    continue;
                                case "48":
                                    T = c(T, w, b, x, e[d + 6], 15, -1560198380);
                                    continue;
                                case "49":
                                    w = i[r(145)](l, w, b, x, T, e[i[r(107)](d, 6)], 9, -1069501632);
                                    continue;
                                case "50":
                                    x = i[r(134)](c, x, T, w, b, e[i[r(89)](d, 1)], 21, -2054922799);
                                    continue;
                                case "51":
                                    x = i.fmdcS(l, x, T, w, b, e[d + 8], 20, 1163531501);
                                    continue;
                                case "52":
                                    x = i[r(15)](c, x, T, w, b, e[i[r(9)](d, 13)], 21, 1309151649);
                                    continue;
                                case "53":
                                    x = i[r(15)](s, x, T, w, b, e[i[r(56)](d, 11)], 22, -1990404162);
                                    continue;
                                case "54":
                                    w = i[r(6)](s, w, b, x, T, e[i[r(32)](d, 13)], 12, -40341101);
                                    continue;
                                case "55":
                                    x = i.sFtiw(s, x, T, w, b, e[i.UAFHv(d, 7)], 22, -45705983);
                                    continue;
                                case "56":
                                    T = i.sFtiw(s, T, w, b, x, e[i.MFmWH(d, 6)], 17, -1473231341);
                                    continue;
                                case "57":
                                    w = i[r(99)](s, w, b, x, T, e[i.MFmWH(d, 1)], 12, -389564586);
                                    continue;
                                case "58":
                                    x = c(x, T, w, b, e[i[r(39)](d, 9)], 21, -343485551);
                                    continue;
                                case "59":
                                    b = i[r(113)](c, b, x, T, w, e[i[r(39)](d, 4)], 6, -145523070);
                                    continue;
                                case "60":
                                    T = i.bRLIN(s, T, w, b, x, e[i[r(39)](d, 10)], 17, -42063);
                                    continue;
                                case "61":
                                    var v = T;
                                    continue;
                                case "62":
                                    b = i[r(66)](c, b, x, T, w, e[d + 0], 6, -198630844);
                                    continue;
                                case "63":
                                    w = i[r(66)](c, w, b, x, T, e[i[r(13)](d, 15)], 10, -30611744);
                                    continue;
                                case "64":
                                    x = c(x, T, w, b, e[d + 5], 21, -57434055);
                                    continue;
                                case "65":
                                    T = i[r(29)](l, T, w, b, x, e[i[r(13)](d, 7)], 14, 1735328473);
                                    continue;
                                case "66":
                                    w = i[r(29)](c, w, b, x, T, e[i[r(79)](d, 11)], 10, -1120210379);
                                    continue;
                                case "67":
                                    var y = x;
                                    continue;
                                case "68":
                                    w = i[r(1)](l, w, b, x, T, e[d + 10], 9, 38016083);
                                    continue;
                                case "69":
                                    T = i[r(1)](s, T, w, b, x, e[i[r(79)](d, 14)], 17, -1502002290);
                                    continue;
                                case "70":
                                    T = i.SUrST(c, T, w, b, x, e[i[r(79)](d, 2)], 15, 718787259);
                                    continue;
                                case "71":
                                    T = l(T, w, b, x, e[i[r(81)](d, 11)], 14, 643717713);
                                    continue
                            }
                            break
                        }
                    continue;
                case "1":
                    var b = 1732584193;
                    continue;
                case "2":
                    return Array(b, x, T, w);
                case "3":
                    e[i.MXnIN(n, 5)] |= i[r(23)](128, i[r(54)](n, 32));
                    continue;
                case "4":
                    var x = -271733879;
                    continue;
                case "5":
                    var w = 271733878;
                    continue;
                case "6":
                    e[i.BQgZQ(i[r(115)](n + 64, 9), 4) + 14] = n;
                    continue;
                case "7":
                    var T = -1732584194;
                    continue
            }
            break
        }
    }

    function a(e, n, r, o, a, s) {
        var l = t;
        return f(i.BtzmV(d, i[l(44)](f, i.dbmfK(f, n, e), i[l(30)](f, o, s)), a), r)
    }

    function s(e, n, r, o, s, l, u) {
        var c = t;
        return a(i[c(143)](i[c(101)](n, r), i[c(101)](~n, o)), e, n, s, l, u)
    }

    function l(e, n, r, o, s, l, u) {
        var c = t;
        return i[c(122)](a, i[c(143)](i.ZpUiH(n, o), i.ZpUiH(r, ~o)), e, n, s, l, u)
    }

    function u(e, n, r, o, s, l, u) {
        return i[t(122)](a, i.tsNzQ(n ^ r, o), e, n, s, l, u)
    }

    function c(e, n, r, o, s, l, u) {
        var c = t;
        return i[c(122)](a, i[c(130)](r, i[c(41)](n, ~o)), e, n, s, l, u)
    }

    function f(e, n) {
        var r = t
            , o = i[r(95)](65535 & e, i.iqfMz(n, 65535))
            , a = i[r(95)](e >> 16, i[r(97)](n, 16)) + i[r(97)](o, 16);
        return i[r(103)](i[r(84)](a, 16), i[r(105)](o, 65535))
    }

    function d(e, n) {
        var r = t;
        return i.abYok(e << n, e >>> i[r(8)](32, n))
    }

    function p(e) {
        for (var n = t, r = i[n(137)](Array), o = i[n(8)](i.vRqUp(1, 16), 1), a = 0; a < i.FDfcp(e[n(108)], 16); a += 16)
            r[i[n(97)](a, 5)] |= i[n(102)](i[n(27)](e[n(127)](i[n(26)](a, 16)), o), i[n(54)](a, 32));
        return r
    }

    function h(e) {
        for (var n = t, r = i[n(49)], o = "", a = 0; i.iXQwu(a, i[n(74)](e[n(108)], 4)); a++)
            o += i.xgzfr(r[n(64)](15 & i[n(36)](e[i[n(36)](a, 2)], i[n(46)](i[n(74)](a % 4, 8), 4))), r[n(64)](15 & i.wWwRM(e[a >> 2], i[n(47)](a % 4, 8))));
        return o
    }

    return i[t(0)]((function (e) {
            var n = t;
            return i[n(144)](h, i[n(76)](o, i.vyNVU(p, e), 16 * e[n(108)]))
        }
    ), e)
}
////////////////////////////////////////////////////////////////////

var r,
    o,
    a,
    s;
_0x34e7 = ["AqLWq", "0zyxwvutsr", "TKgNw", "eMnqD", "thjIz", "btoa", "MNPQRSTWXY", "oPsqh", "niIlq", "evetF", "LVZVH", "fYWEX", "kmnprstwxy", "aYkvo", "tsrqpomnlk", "HfLqY", "aQCDK", "lGBLj", "test", "3210zyxwvu", "QWK2Fi", "return /\" ", "hsJtK", "jdwcO", "SlFsj", "OWUOc", "LCaAn", "[^ ]+)+)+[", "FAVYf", "2Fi+987654", "floor", "join", "EuwBW", "OXYrZ", "charCodeAt", "SkkHG", "iYuJr", "GwoYF", "kPdGe", "cVCcp", "INQRH", "INVALID_CH", "charAt", "push", "apply", "lalCJ", "kTcRS", "+ this + \"", "ykpOn", "gLnjm", "gmBaq", "kukBH", "dvEWE", "SFKLi", "^([^ ]+( +", "qpomnlkjih", "^ ]}", "pHtmC", "length", "split", "ABHICESQWK", "FKByN", "U987654321", "lmHcG", "dICfr", "Szksx", "Bgrij", "iwnNJ", "jihgfdecba", "GfTek", "gfdecbaZXY", "constructo", "QIoXW", "jLRMs"],
    a = _0x34e7;
s = function (e) {
    for (; --e;)
        a.push(a.shift())
}(134),

    !(o = (r = {
        data: {
            key: "cookie",
            value: "timeout"
        },
        setCookie: function (e, t, n, r) {
            r = r || {};
            for (var i = t + "=" + n, o = 0, a = e.length; o < a; o++) {
                var s = e[o];
                i += "; " + s;
                var l = e[s];
                e.push(l),
                    a = e.length,
                !0 !== l && (i += "=" + l)
            }
            r.cookie = i
        },
        removeCookie: function () {
            return "dev"
        },
        getCookie: function (e, t) {
            var n, r = (e = e || function (e) {
                    return e
                }
            )(new RegExp("(?:^|; )" + t.replace(/([.$?*|{}()[]\/+^])/g, "$1") + "=([^;]*)"));
            return n = 133,
                s(++n),
                r ? decodeURIComponent(r[1]) : void 0
        },
        updateCookie: function () {
            return new RegExp("\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}").test(r.removeCookie.toString())
        }
    }).updateCookie()) ? o ? r.getCookie(null, "counter") : r.removeCookie() : r.setCookie(["*"], "counter", 1);

var l = function (e, t) {
        return _0x34e7[e -= 188];
    },
    u = l,
    c = function () {
        var e = l,
            t = {};
        t[e(236)] = function (e, t) {
            return e !== t;
        },
            t[e(218)] = "FhgtN",
            t[e(210)] = e(249),
            t[e(225)] = e(224) + "+ this + \"/",
            t[e(252)] = e(211);
        var n = t,
            r = true;
        return function (t, i) {
            var o = e;

            if ({}[o(248)] = n[o(225)], n[o(252)] === o(211)) {
                var a = r ? function () {
                        var e = o;

                        if (n[e(236)](n[e(218)], n[e(218)])) {
                        } else {
                            if (i && n[e(210)] !== e(235)) {
                                var r = i[e(247)](t, arguments);
                                return i = null,
                                    r;
                            }
                        }
                    }
                    : function () {
                    };
                return r = false,
                    a;
            }
        };
    }
    ()(this, function () {
        var e = l,
            t = {};
        t[e(243)] = function (e, t) {
            return e & t;
        },
            t[e(240)] = function (e, t) {
                return e >> t;
            },
            t.ykpOn = function (e, t) {
                return e !== t;
            },
            t[e(253)] = e(194),
            t.AqLWq = e(224) + e(250) + "/",
            t[e(239)] = e(257) + "[^ ]+)+)+[^ ]}",
            t[e(193)] = function (e) {
                return e();
            };

        var n = t,
            r = function () {
                var t = e,
                    i = {};

                if (i[t(190)] = function (e, r) {
                    return n[t(243)](e, r);
                }, i[t(192)] = function (e, r) {
                    return n[t(240)](e, r);
                }, n[t(251)]("GmVVy", n[t(253)])) {
                    return false;
                }
            };

        return n[e(193)](r);
    });

c();
var f = u(191) + u(204) + u(258) + u(199) + "WVUTSRQPON" + u(189) + u(232) + u(222) + u(217) + u(197) + "ZXYWVUTSRQPONABHICES" + u(223);

function d(e) {
    var t = u,
        n = {};
    n[t(214)] = function (e, t) {
        return e || t;
    },
        n.bWcgB = function (e, t) {
            return e * t;
        },
        n[t(227)] = "ABCDEFGHJK" + t(209) + "Zabcdefhij" + t(215) + "z2345678";

    for (var r = n, o = "1|3|0|4|2|5"[t(188)]("|"), a = 0; ;) {
        switch (o[a++]) {
            case "0":
                var s = l[t(261)];
                continue;

            case "1":
                e = r[t(214)](e, 32);
                continue;

            case "2":
                for (i = 0; i < e; i++)
                    c += l[t(245)](Math[t(233)](r.bWcgB(Math.random(), s)));

                continue;

            case "3":
                var l = r[t(227)];
                continue;

            case "4":
                var c = "";
                continue;

            case "5":
                return c;
        }

        break;
    }
}

window[u(208)] = function (e) {
    var t = u,
        r = {};
    r.TGmSp = t(244) + "ARACTER_ERR",
        r[t(238)] = t(224) + t(250) + "/",
        r[t(205)] = "^([^ ]+( +" + t(230) + t(259),
        r.aYkvo = function (e) {
            return e();
        },
        r[t(254)] = function (e, t) {
            return e % t;
        },
        r.evetF = function (e, t) {
            return e >> t;
        },
        r.GfTek = t(196),
        r[t(260)] = function (e, t) {
            return e << t;
        },
        r[t(229)] = function (e, t) {
            return e | t;
        },
        r[t(242)] = function (e, t) {
            return e << t;
        },
        r[t(228)] = function (e, t) {
            return e & t;
        },
        r[t(207)] = function (e, t) {
            return e << t;
        },
        r[t(202)] = function (e, t) {
            return e & t;
        },
        r.jdwcO = function (e, t) {
            return e === t;
        },
        r.kPdGe = t(231),
        r[t(195)] = t(213),
        r[t(201)] = function (e, t) {
            return e & t;
        },
        r[t(206)] = function (e, t) {
            return e == t;
        },
        r[t(219)] = function (e, t) {
            return e + t;
        },
        r[t(220)] = function (e, t) {
            return e(t);
        };
    var i = r;

    if (/([^\u0000-\u00ff])/.test(e)) {
        throw new Error(i.TGmSp);
    }


    for (var o, a, s, l = 0, c = []; l < e[t(261)];) {
        switch (a = e[t(237)](l), s = i.kukBH(l, 6)) {
            case 0:
                c[t(246)](f[t(245)](i[t(212)](a, 2)));
                break;

            case 1:
                try {
                    n.g = function () {
                        if ("object" == typeof globalThis)
                            return globalThis;
                        try {
                            return this || new Function("return this")()
                        } catch (e) {
                            e = warma.handleException(e);
                            if ("object" == typeof window)
                                return window
                        }
                    }()
                    "WhHMm" === i[t(198)] || n.g && c[t(246)](f[t(245)](i.pHtmC(2 & o, 3) | i.evetF(a, 4)));
                } catch (e) {
                    e = warma.handleException(e);
                    c[t(246)](f[t(245)](i[t(229)](i.cVCcp(3 & o, 4), a >> 4)));
                }

                break;

            case 2:
                c[t(246)](f[t(245)](i[t(229)](i[t(242)](15 & o, 2), i.evetF(a, 6)))),
                    c[t(246)](f[t(245)](i[t(228)](a, 63)));
                break;

            case 3:
                c[t(246)](f[t(245)](i[t(212)](a, 3)));
                break;

            case 4:
                c.push(f[t(245)](i[t(229)](i[t(207)](i.OWUOc(o, 4), 6), i[t(212)](a, 6))));
                break;

            case 5:
                c[t(246)](f[t(245)](i[t(229)](i[t(207)](i[t(202)](o, 15), 4), a >> 8))),
                    c.push(f.charAt(i[t(202)](a, 63)));
        }

        o = a,
            l++;
    }

    // return 0 == s ? i[t(226)](i[t(241)], i[t(195)]) || (c[t(246)](f[t(245)](i[t(201)](o, 3) << 4)), c.push("FM")) : i.eMnqD(s, 1) && (c[t(246)](f[t(245)]((15 & o) << 2)), c[t(246)]("K")),
    //     i[t(219)](i.aQCDK(d(15), window.md5(c[t(234)](""))), i[t(220)](d, 10));
    return 0 == s ? i[t(226)](i[t(241)], i[t(195)]) || (c[t(246)](f[t(245)](i[t(201)](o, 3) << 4)), c.push("FM")) : i.eMnqD(s, 1) && (c[t(246)](f[t(245)]((15 & o) << 2)), c[t(246)]("K")),
        i[t(219)](i.aQCDK(d(15), window.md5(c[t(234)](""))), i[t(220)](d, 10));
}


function get_m() {
    time_stemp = Date.parse(new Date)
    return [window.btoa(time_stemp.toString()),time_stemp]
}